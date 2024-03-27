import { z } from "zod";
import { userValidation } from "../userValidation.schema";

export type UserType = z.infer<typeof userValidation>
