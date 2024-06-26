import db from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { confirmSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async () => {
    const editWorkerForm = await superValidate({
        confirm: 'Confirm'
    },zod(confirmSchema));

    return {
        form: editWorkerForm
    };
}) satisfies PageServerLoad;

export const actions = {
    deleteWorker: async (event) => {
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
                employeeId: event.params.workerId
            }
        });

        await db.employee.delete({
            where: {
                id: event.params.workerId
            }
        });

        setFlash({ message: 'Worker deleted', type: 'success' }, event)
        return redirect(302, `/company/${event.params.id}`);
    }
}