import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    age: number;
    createdAt: Date;
}

 const usersSchema: Schema<User> = new Schema<User>({
    username: {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true
    },
    age: {
        type: Number,
        min: 5,
        max: 23,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model<User>("users", usersSchema)