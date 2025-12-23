import { z } from "zod";
export declare const createEmergencyContactSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phoneNumber: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=emergencyContact.schema.d.ts.map