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
    "#b72205": "Red",
    "#cf8074": "Orange",
    "#e8c039": "Yellow",
    "#6eb47c": "Light Green",
    "#477e47": "Dark Green",
    "#589ae2": "Light Blue",
    "#4652b2": "Dark Blue",
    "#7286c9": "Light Purple",
    "#7c2ca7": "Purple",
    "#616161": "Gray",
}

export const colorsArray = Object.entries(colors).map(([key, value]) => ({ key, value }));

export type Color = keyof typeof colors;


export const createEventSchema = z.object({
    color: z.enum(Object.keys(colors) as [Color, ...Color[]]),
    job: z.string(),
    worker: z.string(),
    startDate: z.date(),
})

export const editEventSchema = z.object({
    color: z.enum(Object.keys(colors) as [Color, ...Color[]]),
    title: z.string().min(3).max(255),
    start: z.date(),
    end: z.date(),
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
export type EditEventSchema = typeof editEventSchema;
export type ConfirmSchema = typeof confirmSchema;