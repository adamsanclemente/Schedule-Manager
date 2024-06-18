import type { PageServerLoad } from './$types';
import db from "$lib/db";
import { redirect, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { createJobSchema, createWorkerSchema } from '$lib/zod';

export const load = (async ({ params }) => {
    // Get the company from the database
    const company = await db.company.findUnique({
        where: {
            id: params.id
        }
    })

    if(!company) {
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

    // Forms
    const createWorkerForm = await superValidate(zod(createWorkerSchema));
    const createJobForm = await superValidate(zod(createJobSchema));


    return {
        company,
        createWorkerForm,
        createJobForm,
        data: {
            workers,
            jobs
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    createWorker: async (event) => {
        const form = await superValidate(event.request, zod(createWorkerSchema));
        console.log(form)
        if(!form.valid) return fail(400, { form })

        // Create the worker
        const worker = await db.employee.create({
            data: {
                companyId: event.params.id,
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                maxHours: form.data.dailyHours
            }
        })

        if (!worker) return fail(500, { message: "Failed to create worker" })

        return redirect(302, `/company/${event.params.id}`);
    },
    createJob: async (event) => {
        const form = await superValidate(event.request, zod(createJobSchema));
        if(!form.valid) return fail(400, { form })

        // Create the job
        const job = await db.job.create({
            data: {
                companyId: event.params.id,
                title: form.data.title,
                hours: form.data.hours
            }
        })

        if (!job) return fail(500, { message: "Failed to create job" })

        return redirect(302, `/company/${event.params.id}`);
    }
}