let moment = require('moment');
let service = require('./service');

let utils = require('../../helpers/utils')

// Controller for adding users
exports.addOrUpdateEvent = () => {
    return (req, res) => {
        // get http method
        const method = req.method;
        // payloads
        let eventData = {
            name: req.body.name,
            description: req.body.description,
            venue: req.body.venue,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            is_active: true
        };

        /** Rule A: You can tag maximum 10 users and minimum 1 user per event */
        // can be illustrate as 1 <= users <= 10
        // filter unique participants
        let set = new Set(req.body.event_users); // Set to remove duplicates
        let eventUsers = [...set]; // convert back to arr
        if (eventUsers.length < 1) {
            return res.status(400).json({
                status: false,
                message: "Event must have at least 1 participant!"
            });
        }
        // max users per event is 10
        if (eventUsers.length > 10) {
            return res.status(400).json({
                status: false,
                message: "Max participant per event is 10!"
            });
        }
        /** end: Rule A */

        // Declarations
        // create a moment object of start_time payload
        let startTime = utils.parseDate(eventData.start_time);
        // create a moment object of end_time payload
        let endTime = utils.parseDate(eventData.end_time);

        /** Rule B: There should be no overlapping time of events. */
        if (startTime >= endTime) {
            return res.status(400).json({
                status: false,
                message: "There should be no overlapping time of events!"
            });
        }
        /** end: Rule B */

        // Declarations
        // create a date from the startTime and set hour to 8AM
        let minTime = utils.getMinTime(startTime.toDate());
        // create a date from the startTime and set hour to 8PM
        let maxTime = utils.getMaxTime(endTime.toDate());

        /** Rule C: Events to be set are only between 8AM-8PM in the evening. No events allowed outside these hours. */
        // check start time payload by comparing it to the minimum time we set above
        if (startTime < minTime) {
            return res.status(400).json({
                status: false,
                message: "Events to be set are only between 8AM-8PM in the evening. No events allowed outside these hours!"
            });
        }
        // check the start time payload comparing it to the maximum time we set above
        if (endTime > maxTime) {
            return res.status(400).json({
                status: false,
                message: "Events to be set are only between 8AM-8PM in the evening. No events allowed outside these hours!"
            });
        }
        /** end: Rule C */

        /** Rule D: You cannot create an event that already past the current time. */
        // Declaration
        // get current time
        let currentTime = utils.getCurrentTime();
        // check if start time is less than current time
        if (startTime < currentTime) {
            return res.status(400).json({
                status: false,
                message: "You cannot create an event that already past the current time!"
            });
        }
        /** end: Rule D */

        /** this function will handle both add ang update functionalities
            the task variable is use to store a task
            a task can be Adding new event or Updating an existing event
           we can determine if the operation is an update if an id param is provided, which we have declared in index.js
        */
        // set default task as add event
        let task = null;
        if (method === 'POST') task = service.addEvent(eventData, eventUsers); // add event
        else {
            // update
            // id is when updating
            let id = req.params.id;
            let updateData = {
                event_data: eventData,
                event_users: eventUsers
            };

            task = service.updateEventById(id, updateData);
        }
    
        // execute the task
        // exec task
        task
            .then(data => {
                res.status(method === 'POST' ? 201 : 200).json({
                    status: true,
                    message: "Success",
                    data: data
                });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    status: false,
                    message: err
                });
            });
    }
};

// Controller for listing events
exports.getEvents = () => {
    return (req, res) => {
        service.getEvents()
            .then(data => {
                res.status(200).json({
                    status: true,
                    message: "Success",
                    data: data
                });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    status: false,
                    message: err
                });
            });
    }
};

// Controller for getting an event by id
exports.getEventsById = () => {
    return (req, res) => {
        service.getEventById(req.params.id)
            .then(data => {
                res.status(200).json({
                    status: true,
                    message: "Success",
                    data: data && data.length > 0 ? data[0] : null
                });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    status: false,
                    message: err
                });
            });
    }
};

// Controller deleting an event by id
exports.deleteEventsById = () => {
    return (req, res) => {
        service.deleteEventById(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    status: false,
                    message: err
                });
            });
    }
};