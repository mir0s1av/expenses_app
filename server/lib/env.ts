import { z, ZodError } from "zod";

const PinoLEvel = ["fatal", "error", "warn", "info", "debug", "trace"] as const;
const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  LOG_LEVEL: z.enum(PinoLEvel),
  PORT: z.coerce.number().default(9999),
  DATABASE_URL: z.string().url(),
});
export type EnvType = z.infer<typeof EnvSchema>;
let env: EnvType;
try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const e = error as ZodError;
  console.error("Invalid env", e.flatten().fieldErrors);
  process.exit(1);
}

export default env;
