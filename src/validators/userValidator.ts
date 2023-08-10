/**
 * Author: Amrendra Kumar Singh
 * Description: This file defines the validateUser function which utilizes Joi to validate user input based on the IUser interface.
 * This function can be used in controllers or routes to validate user data before processing it or saving it to the database.
 */

import Joi from 'joi';
import { IUser } from '../models/users';

/**
 * Validate user input based on IUser interface
 * This function takes a user object as input and returns the validation results.
 * @param {IUser} user - The user data to be validated.
 * @returns {Joi.ValidationResult} The results of the validation. If validation is successful, an object with a 'value' key is returned. If validation fails, an object with an 'error' key is returned.
 */

export const validateUser = (user: IUser) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        dateOfBirth: Joi.date().required()
    });

    return schema.validate(user);
};
