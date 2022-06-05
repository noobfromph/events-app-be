let models = require("../../models");

exports.addUser = (data) => {
    return models.users.create(data);
};

exports.getUsers = () => {
    return models.users.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email', 'address', ['createdAt', 'date_created']]
    });
};