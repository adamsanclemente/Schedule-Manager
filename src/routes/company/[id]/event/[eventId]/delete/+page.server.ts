import db from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { confirmSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async () => {
    const form = await superValidate({
        confirm: 'Confirm'
    }, zod(confirmSchema));

    return {
        form
    };
}) satisfies PageServerLoad;

export const actions = {
    deleteEvent: async (event) => {
        const form = await superValidate(event.request, zod(confirmSchema));
        if (!form.valid) return setError(form, 'confirm', 'Invalid confirmation');

        const { confirm } = form.data;

        if (confirm !== 'Confirm') {
            return setError(form, 'confirm', 'Invalid confirmation');
        }

        await db.event.delete({
            where: {
                id: event.params.eventId
            }
        })

        return redirect(302, `/company/${event.params.id}`);
    }
}