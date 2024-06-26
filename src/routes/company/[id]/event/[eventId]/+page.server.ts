import { setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { editEventSchema } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import db from '$lib/db';
import { colorsArray, type Color } from '$lib/zod';
import { setFlash } from 'sveltekit-flash-message/server';


export const load = (async ({ params }) => {

    // Get the job from the database
    const event = await db.event.findUnique({
        where: {
            id: params.eventId
        }
    })

    if (!event) {
        return redirect(404, '/404');
    }

    const filteredEvent = {
        title: event.title,
        start: event.start,
        end: event.end,
        color: (event.color && colorsArray.find(item => item.value === event.color) ? event.color : '#b72205') as Color
    }

    const form = await superValidate(filteredEvent, zod(editEventSchema));

    return {
        form
    };
}) satisfies PageServerLoad;

export const actions = {
    editEvent: async (event) => {
        const form = await superValidate(event.request, zod(editEventSchema));
        if (!form.valid) {
            setFlash({ message: 'Form Invalid.', type: 'error' }, event)
            return setError(form, 'Invalid form');
        }

        const { color, title, start, end } = form.data;

        const updatedStart = new Date(start);
        updatedStart.setHours(updatedStart.getHours() + 4);

        const updatedEnd = new Date(end);
        updatedEnd.setHours(updatedEnd.getHours() + 4);

        const eventtoedit = await db.event.findUnique({
            where: {
                id: event.params.eventId
            }
        })

        if (!eventtoedit) {
            setFlash({ message: 'Event not found', type: 'error' }, event)
            return setError(form, 'Event not found');
        }

        await db.event.updateMany({
            where: {
                signature: eventtoedit.signature
            },
            data: {
                color,
                title
            }
        });

        await db.event.update({
            where: {
                id: event.params.eventId
            },
            data: {
                start: updatedStart,
                end: updatedEnd
            }
        });

        setFlash({ message: 'Event updated', type: 'success' }, event)
        return redirect(302, `/company/${event.params.id}`);
    }
}