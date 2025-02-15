import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number()
})

const checkEnvironmentVariables = envSchema.safeParse(process.env)

if (checkEnvironmentVariables.success === false) {
  console.error('Invalid environment variables', checkEnvironmentVariables.error.format())

  throw new Error('Invalid environment variables')
}

export const env = checkEnvironmentVariables.data

