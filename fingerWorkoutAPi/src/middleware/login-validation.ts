import { Request, Response, NextFunction } from 'express'
import { z } from "zod";

// zod Validations
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
}).strict();

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        res.status(400).json(parsed.error.flatten())
    else
        next();
}