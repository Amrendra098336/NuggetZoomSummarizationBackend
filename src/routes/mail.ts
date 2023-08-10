/**
 * Author: Amrendra Kumar Singh
 * Description: This file defines the routes for user-related operations, such as user registration,
 * user login, fetching user information, updating user details, changing password, and deleting a user.
 * These routes are protected by authentication middleware.
 */

import express from 'express';
import controllers from '../controllers/MailController';
const router = express.Router();

router.post('/sendmail', controllers.sendMail);

export default router;
