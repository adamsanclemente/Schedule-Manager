import type { PageServerLoad } from './$types';
import db from "$lib/db";
import { redirect } from '@sveltejs/kit';

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


    return {
        company
    };
}) satisfies PageServerLoad;