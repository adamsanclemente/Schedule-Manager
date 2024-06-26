import { setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { confirmSchema } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import db from '$lib/db';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async () => {
    const form = await superValidate({
        confirm: 'Confirm'
    }, zod(confirmSchema));

    return {
        form
    };
}) satisfies PageServerLoad;

export const actions = {
    deleteJob : async (event) => {
        const form = await superValidate(event.request, zod(confirmSchema));
        if (!form.valid) {
            setFlash({ message: 'Invalid confirmation', type: 'error' }, event)
            return setError(form, 'confirm', 'Invalid confirmation');
        }

        const { confirm } = form.data;

        if (confirm !== 'Confirm') {
            setFlash({ message: 'Invalid confirmation', type: 'error' }, event)
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

        setFlash({ message: 'Job deleted', type: 'success' }, event)
        return redirect(302, `/company/${event.params.id}`);
    }
}