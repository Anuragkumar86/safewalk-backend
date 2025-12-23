import { z } from "zod";
import { nameField, emailField, phoneField } from "./common.schema.js";
export const createEmergencyContactSchema = z.object({
    body: z.object({
        name: nameField,
        email: emailField.optional(),
        phoneNumber: phoneField
    })
});
//# sourceMappingURL=emergencyContact.schema.js.map