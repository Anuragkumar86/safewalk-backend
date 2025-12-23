import zod from "zod";
export const emailField = zod.string().email();
export const nameField = zod.string().min(2);
export const passwordField = zod.string().min(8, { message: "Password must be of minimum of 8 letters" });
export const phoneField = zod.string().min(8);
//# sourceMappingURL=common.schema.js.map