let models = require("../../models");
let { QueryTypes, Op } = require("sequelize");

exports.addEvent = async (eventData, eventUsers) => {
    // check if the user ids are valid/existing users
    // one way of doing this is to query all users and compare the length
    let users = await models.users.findAll({
        where: {
            id: {
                [Op.in]: eventUsers
            }
        },
        raw: true
    });

    // if same length, means, all user ids are valid/existing
    // otherwise, return an error
    if (users.length !== eventUsers.length) {
        return Promise.reject("Invalid event users/participants!");
    }

    // save the event
    let savedEvent = await models.events.create(eventData)
                        .then(resultEntity => resultEntity.get({plain:true})); // we use get function to retrieve raw data
    
    // create a holder for the event users
    // we will use to bulk create event_users
    let eventUsersData = [];
    for (let userId of eventUsers) {
        // we will push an event_user object
        eventUsersData.push({
            event_id: savedEvent.id,
            user_id: userId
        });
    }

    // save event users at once
    await models.event_users.bulkCreate(eventUsersData);

    // return the saved event and event users
    return this.getEventById(savedEvent.id);
};

// Function to retrieve events
exports.getEvents = () => {
    let eventSelectStatement = `
        select
            e.id,
            e.name,
            e.description,
            e.venue,
            e.start_time,
            e.end_time,
            e."createdAt" "date_created",
            e."updatedAt" "date_updated",
            (
                select array_agg(temp.users)
                from ( 
                    select 
                        jsonb_build_object(
                            'id', u.id,
                            'firstname' , u.firstname,
                            'lastname' , u.lastname,
                            'email', u.email, 
                            'address', u.address, 
                            'date_created', u."createdAt"
                        ) "users"
                        from users u where u.id in (
                            select user_id from event_users where event_id = e.id
                        )
                ) temp
            ) "users"
        from events e
        where  e.is_active = true
        group by e.id;
    `;

    return models.sequelize.query(
        eventSelectStatement, 
        { 
            type: QueryTypes.SELECT,
            raw: true
        }); 
};

// Function to get a particular event using event id
exports.getEventById = (eventId) => {
    let eventSelectStatement = `
        select
            e.id,
            e.name,
            e.description,
            e.venue,
            e.start_time,
            e.end_time,
            e."createdAt" "date_created",
            e."updatedAt" "date_updated",
            (
                select array_agg(temp.users)
                from ( 
                    select 
                        jsonb_build_object(
                            'id', u.id,
                            'fistname' , u.firstname,
                            'lastname' , u.lastname,
                            'email', u.email, 
                            'address', u.address, 
                            'date_created', u."createdAt"
                        ) "users"
                        from users u where u.id in (
                            select user_id from event_users where event_id = e.id
                        )
                ) temp
            ) "users"
        from events e
        where e.id = :event_id and e.is_active = true;
    `;

    return models.sequelize.query(
        eventSelectStatement, 
        { 
            type: QueryTypes.SELECT,
            replacements: {
                event_id: eventId
            },
            raw: true
        }); 
};

// Function to delete an event by event id
exports.deleteEventById = async (eventId) => {
    let eventData = await models.events.findOne({
        where: {
            id: eventId,
            is_active: true
        }
    });

    // not found
    if (!eventData) {
        return Promise.reject("Attempting to delete a non-existing event!");
    }

    // setting is active to false
    eventData.set({
        is_active: false
    });

    // save changes
    return eventData.save();
};

exports.updateEventById = async (eventId, data) => {
    let eventData = await models.events.findOne({
        where: {
            id: eventId,
            is_active: true
        }
    });

    // not found
    if (!eventData) {
        return Promise.reject("Attempting to update a non-existing event!");
    }

    let eventNewInfo = data.event_data;
    let newEventUsers = data.event_users;

    // check if the user ids are valid/existing users
    // one way of doing this is to query all users and compare the length
    let users = await models.users.findAll({
        where: {
            id: {
                [Op.in]: newEventUsers
            }
        },
        raw: true
    });

    // check the length
    // if same length, means, all user ids are valid/existing
    // otherwise, return an error
    if (users.length !== newEventUsers.length) {
        return Promise.reject("Invalid event users/participants!");
    }

    // updating event row
    eventData.set(eventNewInfo);
    await eventData.save();

    // not a practical way XD
    // delete the event_users of this event
    // we then insert the new event_users XD
    await models.event_users.destroy({
        where: {
            event_id: eventId
        }
    });

    // then insert the updated one XD
    // create a holder for the event users
    // we will use to bulk create event_users
    let eventUsersData = [];
    for (let userId of newEventUsers) {
        // we will push an event_user object
        eventUsersData.push({
            event_id: eventId,
            user_id: userId
        });
    }

    // save event users at once
    await models.event_users.bulkCreate(eventUsersData);

    return this.getEventById(eventId);
};