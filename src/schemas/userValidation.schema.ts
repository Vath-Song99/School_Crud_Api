import { z } from 'zod';

const userSignupValidation = z.object({
    username: z.string().min(3).max(25),
    email: z.string().email().min(1).max(45),
    password: z.string().min(8).max(25)
});

const UsernameOrEmail = z.string().refine((value) => {
    // Regular expression to check if the input is a valid email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Modify the regex as per your username requirements
    
    return emailRegex.test(value) || usernameRegex.test(value);
  }, 'Invalid email or username');

const userLoginValidate = z.object({
    identifier: UsernameOrEmail,
    password: z.string().min(8).max(25)
})

export {userSignupValidation , userLoginValidate}