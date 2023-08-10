import mongoose, { Document, Schema } from 'mongoose';

/**
 * Description: Defines the Recording model and schema for MongoDB.
 * @author: Amrendra Kumar Singh
 */

/**
 * Recording document interface
 * Represents the structure of a Recording document in the MongoDB collection.
 */
export interface IRecording extends Document {
    email: string;
    meetingTitle: string;
    originalFileName: string;
    modifiedFileName: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Recording schema
 * Defines the structure and behavior of the Recording document.
 */
const RecordingSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    meetingTitle: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    modifiedFileName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IRecording>('Recording', RecordingSchema);
