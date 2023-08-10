import Joi from 'joi';

export const mailRequestBodySchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    message: Joi.string().required()
});
