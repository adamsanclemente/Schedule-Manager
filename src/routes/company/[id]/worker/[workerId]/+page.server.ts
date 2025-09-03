import db from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createWorkerSchema } from '$lib/zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async ({ params }) => {
	// get the worker from the database

	const worker = await db.employee.findUnique({
		where: {
			id: params.workerId
		}
	});

	if (!worker) {
		return redirect(404, '/404');
	}

	const filteredWorker = {
		id: worker.id,
		firstName: worker.firstName,
		lastName: worker.lastName,
		dailyHours: worker.maxHours
	};

	const editWorkerForm = await superValidate(filteredWorker, zod(createWorkerSchema));

	return {
		form: editWorkerForm
	};
}) satisfies PageServerLoad;

export const actions = {
	editWorker: async (event) => {
		const form = await superValidate(event.request, zod(createWorkerSchema));
		if (!form.valid) return { status: 400, body: { form } };

		const { firstName, lastName, dailyHours } = form.data;

		await db.employee.update({
			where: {
				id: event.params.workerId
			},
			data: {
				firstName,
				lastName,
				maxHours: dailyHours
			}
		});

		setFlash({ message: 'Worker updated', type: 'success' }, event);
		return redirect(302, `/company/${event.params.id}`);
	}
};
