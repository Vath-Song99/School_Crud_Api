import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

interface User extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
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
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
usersSchema.plugin(mongoosePaginate)


module.exports = mongoose.model<User>("users", usersSchema)