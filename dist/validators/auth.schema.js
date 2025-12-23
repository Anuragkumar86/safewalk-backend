import z from "zod";
import { emailField, nameField, passwordField } from "./common.schema.js";
export const registerSchema = z.object({
    body: z.object({
        name: nameField,
        email: emailField,
        password: passwordField
    })
});
export const loginSchema = z.object({
    body: z.object({
        email: emailField,
        password: passwordField
    })
});
//# sourceMappingURL=auth.schema.js.map