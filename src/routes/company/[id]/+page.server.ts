import type { PageServerLoad } from './$types';
import db from "$lib/db";
import { redirect, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { createEventSchema, createJobSchema, createWorkerSchema } from '$lib/zod';
import { scheduleJobEvents } from '$lib/functions/scheduling';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async ({ params }) => {
    // Get the company from the database
    const company = await db.company.findUnique({
        where: {
            id: params.id
        }
    })

    if (!company) {
        return redirect(404, '/404');
    }

    const workers = await db.employee.findMany({
        where: {
            companyId: params.id
        }
    })

    const jobs = await db.job.findMany({
        where: {
            companyId: params.id
        }
    })

    // Filter out any jobs with workers already assigned
    const filteredJobs = jobs.map(job => {
        return {
            ...job,
            title: job.title + ` (${job.hours}H)`
        }
    });

    const events = await db.event.findMany({
        where: {
            companyId: params.id
        }
    })

    // Forms
    const createWorkerForm = await superValidate(zod(createWorkerSchema));
    const createJobForm = await superValidate(zod(createJobSchema));
    const createEventForm = await superValidate(zod(createEventSchema));

    return {
        company,
        createWorkerForm,
        createJobForm,
        createEventForm,
        data: {
            workers,
            jobs,
            filteredJobs,
            events
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    createWorker: async (event) => {
        const form = await superValidate(event.request, zod(createWorkerSchema));
        if (!form.valid) return fail(400, { form })

        // Create the worker
        const worker = await db.employee.create({
            data: {
                companyId: event.params.id,
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                maxHours: form.data.dailyHours
            }
        })

        if (!worker) {
            setFlash({ type: 'error', message: 'Failed to create worker' }, event)
            return setError(form, "Failed to create worker")
        }

        setFlash({ type: 'success', message: 'Worker created successfully' }, event)
        return redirect(302, `/company/${event.params.id}`);
    },
    createJob: async (event) => {
        const form = await superValidate(event.request, zod(createJobSchema));
        if (!form.valid) return fail(400, { form })

        // Create the job
        const job = await db.job.create({
            data: {
                companyId: event.params.id,
                title: form.data.title,
                hours: form.data.hours
            }
        })

        if (!job) {
            setFlash({ type: 'error', message: 'Failed to create job' }, event)
            return setError(form, "Failed to create job")

        }

        setFlash({ type: 'success', message: 'Job created successfully' }, event)
        return redirect(302, `/company/${event.params.id}`);
    },
    createEvent: async (event) => {
        const form = await superValidate(event.request, zod(createEventSchema));
        if (!form.valid) return fail(400, { form })

        // Create the event

        // Get the worker
        const worker = await db.employee.findUnique({
            where: {
                id: form.data.worker
            }
        })

        if (!worker) {
            setFlash({ type: 'error', message: 'Invalid worker' }, event)
            return setError(form, "Invalid worker")
        }

        // Get the job
        const job = await db.job.findUnique({
            where: {
                id: form.data.job
            }
        })

        if (!job) {
            setFlash({ type: 'error', message: 'Invalid job' }, event)
            return setError(form, "Invalid job")
        }

        // Check if the worker is already assigned to the job
        if (!job.employeeIds.includes(worker.id)) {
            // Assign the worker to the job
            await db.job.update({
                where: {
                    id: job.id
                },
                data: {
                    employeeIds: [...job.employeeIds, worker.id]
                }
            })
        }


        // Get all events to create
        const eventsToCreate = await scheduleJobEvents(worker.id, `${worker.firstName} ${worker.lastName}`, job.id, job.title, job.hours, new Date(form.data.startDate), worker.maxHours);

        // Create a random signature for the event
        const signature = Math.random().toString(36).substring(7);
        // Create the events
        for (const event of eventsToCreate) {
            // Get the current timezone offset for the local system
            const localOffset = new Date().getTimezoneOffset();

            // Create a date object for 'America/New_York' timezone
            const easternDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

            // Get the timezone offset for Eastern Time by comparing it to UTC
            const easternOffset = easternDate.getTimezoneOffset();

            // Calculate the difference in offsets
            const timezoneOffset = localOffset - easternOffset;

            // Convert start and end times to Eastern Time
            const startInEastern = new Date(event.start.getTime() - timezoneOffset * 60000 + 4 * 60 * 60 * 1000);
            const endInEastern = new Date(event.end.getTime() - timezoneOffset * 60000 + 4 * 60 * 60 * 1000);

            // Ensure the date is set to the start of the day in Eastern Time
            const dateInEastern = new Date(startInEastern);
            dateInEastern.setHours(0, 0, 0, 0);

            await db.event.create({
                data: {
                    companyId: job.companyId,
                    employeeId: event.workerId,
                    jobId: event.jobId,
                    start: startInEastern,
                    end: endInEastern,
                    title: event.title,
                    color: form.data.color,
                    date: dateInEastern,
                    signature: signature
                }
            });
        }

        // Refresh the page
        setFlash({ type: 'success', message: 'Events created successfully' }, event)
        return redirect(302, `/company/${event.params.id}`);
    }
}