const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const _ = require('lodash');

router.post('/authenticate', authenticate);
router.get('/', findUsers);
router.post('/register', createUser);
router.post('/login', login);
router.get('/:id', findUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Login or password is incorrect' }))
        .catch(err => next(err));
}

function findUser(req, res) {
    const id = req.params.id;
    userService.findUserById(id)
        .then(data => res.send(data))
        .catch(err => res.status(404).send({ message: `Cannot find User with id = ${id}` }));
}

function findUsers(req, res) {
    let filter = req.body;
    if (!req.body) {
        filter = {};
    }
    userService.findUsers(filter)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: `Error fetching the users` }));
}

function createUser(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    userService.createUser(req.body)
        .then(data => res.send(data))
        .catch(err => {
            switch (_.get(err, "type")) {
                case "login-exists":
                    res.status(400).send({message: "A user with the provided login already exists"});
                    break;
                case "incomplete-data":
                    res.status(400).send({message: "Provided data is incomplete, check the required fields"});
                    break;
                default:
                    res.status(500).send({ message: 'Some error occurred while creating the User' });
            }
        });
}

function updateUser(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const id = req.params.id;
    userService.updateUser(id, req.body)
        .then(data => res.send({ message: `User with id = ${id} was updated successfully`}))
        .catch(err => res.status(500).send({ message: `Error updating User with id = ${id}` }));
}

function deleteUser(req, res) {
    const id = req.params.id;
    userService.deleteUser(id)
        .then(data => res.send({ message: `User with id = ${id} was deleted successfully` }))
        .catch(err => res.status(500).send({ message: `Error deleting User with id = ${id}` }));
}

function login(req, res, next) {
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Login or password is incorrect' }))
        .catch(err => next(err));
}

