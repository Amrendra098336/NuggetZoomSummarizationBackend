import Recording, { IRecording } from '../models/Recordings';
import User, { IUser } from '../models/users';

/**
 * Save recording data to the MongoDB database.
 *
 * @param email - Email associated with the User.
 * @param meetingTitle - Title of the meeting.
 * @param originalFileName - Original file name as uploaded by the user.
 * @param modifiedFileName - Modified file name, possibly to ensure uniqueness or add metadata.
 * @returns Promise<IRecording> - Returns a promise that resolves to the saved recording document.
 */
export const saveRecordingToDB = async (email: string, meetingTitle: string, originalFileName: string, modifiedFileName: string): Promise<IRecording | null> => {
    // Create a new recording document
    const newRecording: IRecording = new Recording({
        email,
        meetingTitle,
        originalFileName,
        modifiedFileName
    });

    // Save the recording to the database
    const savedRecording = await newRecording.save();

    if (!savedRecording) {
        throw new Error('Failed to save recording to database.');
    }

    // Add the recording to the user's recordings array and save the updated user document
    const updatedUser = await User.findOneAndUpdate({ email: new RegExp('^' + email + '$', 'i') }, { $push: { recordings: savedRecording._id } }, { new: true, upsert: false });

    if (!updatedUser) {
        throw new Error('Failed to update user with new recording.');
    }

    return savedRecording;
};
