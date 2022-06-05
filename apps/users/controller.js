let service = require('./service');

// Function to add a user
exports.addUser = () => {
    return (req, res) => {
        let userData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            email: req.body.email,
            image: req.body.email
        };

        service.addUser(userData)
            .then(data => {
                res.status(201).json({
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

// Function to retrieve all users
exports.getUsers = () => {
    return (req, res) => {
        service.getUsers()
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
            })
    }
}