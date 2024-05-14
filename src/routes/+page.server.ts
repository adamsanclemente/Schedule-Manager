import type { PageServerLoad, Actions } from './$types';
import { loginSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from "@sveltejs/kit";
import db from "$lib/db";

export const load = (async () => {
    // Initialize the form with the schema
    const form = await superValidate(zod(loginSchema))

    return {
        form
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(loginSchema))

        if (form.valid) {

            // Check to see if company exists
            const company = await db.company.findUnique({
                where: {
                    login: form.data.login
                }
            })

            if (!company) {
                return setError(form, 'login', 'Company not found')
            }

            // If successful, redirect to the company page
            return redirect(300, `/company/${company.id}`)
            
        } else {
            return fail(400, {
                form,
                message: 'Invalid form data'
            })
        }
    }
}