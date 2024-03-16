import { z } from 'zod';

const userValidation = z.object({
    username: z.string().min(3).max(25),
    age: z.number().min(3).max(23)
});

export {userValidation}