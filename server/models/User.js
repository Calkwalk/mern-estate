import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            min: 3,
            max: 128,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
            max: 64,
        },

    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;