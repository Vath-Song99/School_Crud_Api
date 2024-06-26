import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    isVerified: boolean,
    googleId: string;
    facebookId: string
}

 const usersSchema: Schema<User> = new Schema<User>({
    username: {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true
    },
    email: {
        type: String,
        min: 1,
        max: 45,
        required: true
    },
    password: {
        type: String,
        min: 1,
        max: 25,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId:{
        type: String,
    },
    facebookId:{
        type: String
    }
});
export const userModel = mongoose.model<User>("users", usersSchema)