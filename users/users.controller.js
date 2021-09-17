const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);



router.get('/api/logout', _logout);
router.get('/api/generatesusers',usersGenerate)
router.get('/api/getlogins',getLogins)

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body,req)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then((resp) => res.json(resp))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll(pagination(req))
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _logout(req,res,next)
{
    userService.logout(req.user)
    .then((resp) => res.json(resp))
    .catch(err => next(err)); 
}


function usersGenerate(req,res,next)
{
    userService.usersGenerate()
    .then((resp) => res.json(resp))
    .catch(err => next(err));  
}

function getLogins (req,res,next)
{
    userService.getLogins(req.user.sub)
    .then((resp) => res.json(resp))
    .catch(err => next(err));  
}



const pagination = (req) => {
    try {

        var current = req.body.page || req.query.page || 0;
        var limit = req.body.limit || req.query.limit || 10;
        if (current) {
            current = current - 1;
        }
        if (limit) {
            limit = Number(limit)
        }

        return { skip: (current * limit), limit: limit }
    }
    catch (err) {
        return { skip: 0, limit: 10 }
    }

}