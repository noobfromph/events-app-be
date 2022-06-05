const express = require('express');
const router = express.Router();

const controller = require('./controller');

const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

// schema for adding or updating an event
const eventSchema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().optional().allow(null),
    venue: Joi.string().min(2).required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    event_users: Joi.array().items(Joi.number().integer()).required()
});

// id schema for params
const idSchema = Joi.object({
    id: Joi.number().integer().required()
});

// routes
function routes() {
    router.post('/', validator.body(eventSchema), controller.addOrUpdateEvent());
    router.get('/', controller.getEvents());
    router.get('/:id', validator.params(idSchema), controller.getEventsById());
    router.delete('/:id', validator.params(idSchema), controller.deleteEventsById());
    router.put('/:id', validator.params(idSchema), validator.body(eventSchema), controller.addOrUpdateEvent());
    return router;
}

module.exports = routes;