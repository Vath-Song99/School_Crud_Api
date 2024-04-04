import { z } from "zod";
import { userSignupValidation } from "../userValidation.schema";

export type UserType = z.infer<typeof userSignupValidation>
