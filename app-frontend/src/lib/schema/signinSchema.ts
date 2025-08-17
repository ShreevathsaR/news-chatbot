import * as z from "zod"

export const signinSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password",
  }),
});