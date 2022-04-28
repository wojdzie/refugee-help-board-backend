const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/login', login);
router.post('/signup', signUp);
router.get('/', findUsers);
router.get('/:id', findUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

function login(req, res, next) {
    userService.authenticate(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function findUser(req, res) {
    const id = req.params.id;
    userService.findUserById(id)
        .then(data => res.send(data))
        .catch(err => res.status(404).send({ message: `Cannot find User with id = ${id}` }));
}

function findUsers(req, res) {
    userService.findUsers()
        .then(data => res.send(data))
        .catch(err => res.status(404).send({ message: 'Cannot find Users' }));
}

function signUp(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    userService.createUser(req.body)
        .then(data => res.send(data))
        .catch(err => res.status(400).send({ message: 'Some error occurred while creating the User' }));
}

function updateUser(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const id = req.params.id;
    userService.updateUser(id, req.body)
        .then(data => res.send({ message: `User with id = ${id} was updated successfully`}))
        .catch(err => res.status(400).send({ message: `Error updating User with id = ${id}` }));
}

function deleteUser(req, res) {
    const id = req.params.id;
    userService.deleteUser(id)
        .then(data => res.send({ message: `User with id = ${id} was deleted successfully` }))
        .catch(err => res.status(400).send({ message: `Error deleting User with id = ${id}` }));
}

