// place files you want to import through the `$lib` alias in this folder.

import { writable } from "svelte/store";
import type { Color } from "./zod";

    // Stores
    export const formdata = writable({
        color: "#b72205" as Color,
        job: '',
        worker: '',
        startDate: new Date(),
    })