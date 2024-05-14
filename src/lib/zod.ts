import { z } from 'zod'

export const loginSchema = z.object({
    login : z.string().min(3),
})

export type LoginSchema = typeof loginSchema;