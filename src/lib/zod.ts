import { z } from 'zod'

export const loginSchema = z.object({
    login : z.string().min(3).max(255),
})

export const createWorkerSchema = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255),
    dailyHours: z.number().int().min(1).max(24)
})

export const createJobSchema = z.object({
    title: z.string().min(3).max(255),
    hours: z.number().int().min(1)
})

export type LoginSchema = typeof loginSchema;
export type CreateWorkerSchema = typeof createWorkerSchema;
export type CreateJobSchema = typeof createJobSchema;