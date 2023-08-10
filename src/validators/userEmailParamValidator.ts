import Joi from 'joi';

export const userEmailParamSchema = Joi.object({
    userEmail: Joi.string().email().required()
});
