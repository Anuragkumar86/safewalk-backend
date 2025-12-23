import { ZodError } from "zod";
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.flatten().fieldErrors
            });
        }
        next(error);
    }
};
//# sourceMappingURL=validate.js.map