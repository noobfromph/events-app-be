const express = require('express');
const router = express.Router();
const controller = require('./controller');

const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

// user schema
const userSchema = Joi.object({
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    address: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, '')
});

function routes() {
    router.post('/', validator.body(userSchema), controller.addUser());
    router.get('/', controller.getUsers());
    return router;
}

  
module.exports = routes;