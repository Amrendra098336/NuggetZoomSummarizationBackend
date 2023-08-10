import Joi from 'joi';

export const loginRequestBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
