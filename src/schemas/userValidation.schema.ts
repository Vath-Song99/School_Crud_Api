import { TypeOf, z } from 'zod';

const userValidation = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(8).max(25),
    email: z.string().email().min(1).max(45)
});

export type UserType = z.infer<typeof userValidation>


export {userValidation}