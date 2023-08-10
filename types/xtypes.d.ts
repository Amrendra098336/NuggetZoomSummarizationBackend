/**
 * Author: John Doe
 * Description: This file declares a namespace in the Express module to extend the Request interface.
 * It adds an optional user property to attach the decoded user ID during authentication.
 */

declare namespace Express {
    export interface Request {
        user?: any;
    }
}
