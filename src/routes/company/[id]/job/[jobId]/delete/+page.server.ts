import { setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { confirmSchema } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import db from '$lib/db';

export const load = (async () => {
    const form = await superValidate(zod(confirmSchema));

    return {
        form
    };
}) satisfies PageServerLoad;

export const actions = {
    deleteJob : async (event) => {
        const form = await superValidate(event.request, zod(confirmSchema));
        if (!form.valid) return setError(form, 'confirm', 'Invalid confirmation');

        const { confirm } = form.data;

        if (confirm !== 'Confirm') {
            return setError(form, 'confirm', 'Invalid confirmation');
        }

        await db.event.deleteMany({
            where: {
                jobId: event.params.jobId
            }
        });

        await db.job.delete({
            where: {
                id: event.params.jobId
            }
        });

        return redirect(302, `/company/${event.params.id}`);
    }
}