import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Author: Amrendra Kumar Singh
 * Description: This file defines the User model and schema for MongoDB.
 * The IUser interface represents the User document, and the UserSchema defines
 * the structure and behavior of the User document.
 */

/**
 * User document interface
 * Represents the structure of a User document in the MongoDB collection.
 */
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: string;
    recordings: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

/**
 * User schema
 * Defines the structure and behavior of the User document.
 */
const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    recordings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recording'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-save middleware for the User schema
 * Hashes the password before saving the User document.
 */
UserSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

/**
 * Compare password method for the User schema
 * Compares the provided password with the hashed password of the User document.
 * Returns a promise that resolves to a boolean indicating whether the passwords match.
 */
UserSchema.method('comparePassword', async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
});

export default mongoose.model<IUser>('User', UserSchema);
