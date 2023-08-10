/**
 * Author: John Doe
 * Description: This file defines custom types for Express Request objects.
 * The IRequest interface extends the default Request interface provided by Express
 * and adds an optional user property to attach the decoded user ID during authentication.
 */

import { Request } from 'express';

/**
 * Custom Express Request interface
 * Extends the default Request interface provided by Express
 * and adds an optional user property for attaching the decoded user ID during authentication.
 */
export interface IRequest extends Request {
    user?: any;
}
