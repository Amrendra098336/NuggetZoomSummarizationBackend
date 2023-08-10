import Joi from 'joi';

export const mailRequestBodySchema = Joi.object({
    modifiedFileName: Joi.string().required(),
    message: Joi.string().required()
});
