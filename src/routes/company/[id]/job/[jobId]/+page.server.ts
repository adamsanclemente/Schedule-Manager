import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createJobSchema } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import db from '$lib/db';

export const load = (async ({ params }) => {

    // Get the job from the database
    const job = await db.job.findUnique({
        where: {
            id: params.jobId
        }
    })

    if (!job) {
        return redirect(404, '/404');
    }

    const form = await superValidate(job, zod(createJobSchema));

    return {
        form
    };
}) satisfies PageServerLoad;

export const actions = {
    editJob : async (event) => {
        const form = await superValidate(event.request, zod(createJobSchema));
        if (!form.valid) return { status: 400, body: { form } }

        const { title, hours } = form.data;

        await db.job.update({
            where: {
                id: event.params.jobId
            },
            data: {
                title,
                hours
            }
        });

        return redirect(302, `/company/${event.params.id}`);
    }
}