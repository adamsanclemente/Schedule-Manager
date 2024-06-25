import { z } from 'zod'
import validator from 'validator';

export const loginSchema = z.object({
    login : z.string().min(3).max(255),
})

export const createWorkerSchema = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255),
    dailyHours: z.coerce.number().int().min(1).max(24)
})

export const createJobSchema = z.object({
    title: z.string().min(3).max(255),
    hours: z.coerce.number().int().min(1)
})

export const colors = {
    "#b72205": "Tomato",
    "#cf8074": "Flamingo",
    "#e8c039": "Banana",
    "#6eb47c": "Sage",
    "#477e47": "Basil",
    "#589ae2": "Peacock",
    "#4652b2": "Blueberry",
    "#7286c9": "Lavender",
    "#7c2ca7": "Grape",
    "#616161": "Graphite",
}

type Color = keyof typeof colors;


export const createEventSchema = z.object({
    color: z.enum(Object.keys(colors) as [Color, ...Color[]]),
    job: z.string(),
    worker: z.string(),
    startDate: z.string().refine(validator.isISO8601, "Invalid date"),
})

export const confirmSchema = z.object({
    confirm: z.string().refine(
        (value) => validator.equals("Confirm", value), // Ensure this is a function that returns a boolean
        "Invalid confirmation"
    )
})

export type LoginSchema = typeof loginSchema;
export type CreateWorkerSchema = typeof createWorkerSchema;
export type CreateJobSchema = typeof createJobSchema;
export type CreateEventSchema = typeof createEventSchema;
export type ConfirmSchema = typeof confirmSchema;