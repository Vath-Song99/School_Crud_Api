import { TypeOf, z } from 'zod';

const userValidation = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(8).max(25),
    age: z.number().min(3).max(23)
});

export type UserType = z.infer<typeof userValidation>


export {userValidation}