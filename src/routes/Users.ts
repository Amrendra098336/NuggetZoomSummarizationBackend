/**
 * Author: Amrendra Kumar Singh
 * Description: This file defines the routes for user-related operations, such as user registration,
 * user login, fetching user information, updating user details, changing password, and deleting a user.
 * These routes are protected by authentication middleware.
 */

import express from 'express';
import controllers from '../controllers/UserController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

/**
 * POST /register
 * Description: Register a new user
 * This route is responsible for creating a new user by handling the registration request.
 * It invokes the createUser method from the User controller to create the user in the database.
 */
router.post('/register', controllers.createUser);

/**
 * POST /login
 * Description: User login
 * This route is responsible for authenticating a user by handling the login request.
 * It invokes the login method from the User controller to validate the credentials and generate an access token.
 */
router.post('/login', controllers.login);

/**
 * GET /get/:userEmail
 * Description: Fetch user information
 * This route is responsible for fetching user information by handling the request with the user's email.
 * It requires authentication, so the authenticateToken middleware is used to verify the access token.
 * It invokes the readUser method from the User controller to retrieve the user information from the database.
 */
router.get('/get/:userEmail', authenticateToken, controllers.readUser);

/**
 * PATCH /update/:userEmail
 * Description: Update user information
 * This route is responsible for updating user information by handling the request with the user's email.
 * It requires authentication, so the authenticateToken middleware is used to verify the access token.
 * It invokes the updateUser method from the User controller to update the user information in the database.
 */
router.patch('/update/:userEmail', authenticateToken, controllers.updateUser);

/**
 * PATCH /changepassword/:userEmail
 * Description: Change user password
 * This route is responsible for changing the user's password by handling the request with the user's email.
 * It requires authentication, so the authenticateToken middleware is used to verify the access token.
 * It invokes the updatePassword method from the User controller to update the user's password in the database.
 */
router.patch('/changepassword/:userEmail', authenticateToken, controllers.updatePassword);

/**
 * DELETE /delete/:userEmail
 * Description: Delete a user
 * This route is responsible for deleting a user by handling the request with the user's email.
 * It requires authentication, so the authenticateToken middleware is used to verify the access token.
 * It invokes the deleteUser method from the User controller to delete the user from the database.
 */
router.delete('/delete/:userEmail', authenticateToken, controllers.deleteUser);

export default router;
