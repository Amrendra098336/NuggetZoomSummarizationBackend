/**
 * Upload Routes Module
 *
 * Provides routes for handling file uploads to AWS S3.
 *
 * @author Amrendra Kumar Singh
 * @module routes/upload
 */

// Imports: External Modules
import express from 'express';

// Imports: Internal Modules
import { uploadToS3 } from '../controllers/uploadController'; // Controller handling S3 upload logic
import upload from '../middleware/upload'; // Middleware for handling file uploads using Multer

// Initialize the express router
const router = express.Router();

/**
 * POST route to handle file uploads.
 *
 * 1. The `upload.single('file')` middleware intercepts and processes a file upload from the client.
 *    - It expects a single file with the field name 'file'.
 *    - The file is temporarily stored in memory (due to the configuration of Multer's memoryStorage in the middleware).
 *
 * 2. The `uploadToS3` controller is then invoked to handle the upload of the file to AWS S3.
 *
 * @path {POST} /upload
 * @middleware upload.single() - Processes the file upload.
 * @controller uploadToS3 - Handles the logic for uploading the file to AWS S3.
 */
router.post('/upload', upload.single('file'), uploadToS3);

// Export the router to be used in the main server setup
export default router;
