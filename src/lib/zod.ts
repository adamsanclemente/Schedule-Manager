import { z } from 'zod'

export const loginSchema = z.object({
    login : z.string().min(3).max(255),
})

export type LoginSchema = typeof loginSchema;