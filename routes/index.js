const express = require('express');
const routes = express.Router();

const users = require("../apps/users");
routes.use('/api/users', users());

const events = require("../apps/events");
routes.use('/api/events', events());

module.exports = routes;