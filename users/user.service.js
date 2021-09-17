const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const shortid = require('shortid');
const User = db.User;
const login = db.Login;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    logout,
    usersGenerate,
    getLogins,
    delete: _delete
};

async function authenticate({ username, password }, ip) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const unique = shortid.generate();
        const { role, lastName, firstName, username } = user;
        const token = jwt.sign({ sub: user.id, unique, role, lastName, firstName, username }, config.secret);
        const userlogin = {
            userId: user._id,
            UserName: user.username,
            loginIp: ip.connectedIP,
            token: token,
            unique: unique
        }

        loginhistoryCreate(userlogin)

        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll({skip,limit}) {

    return {data:await User.find().select('-hash').skip(skip).limit(limit),totalRecords:await User.count()};
}


async function getLogins(id) {

    return await login.find({userId:id}).select('-token').sort({_id:-1});
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function loginhistoryCreate(user) {
    return await login.create(user);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw `Username ${userParam.username} is already taken`;
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
    return { message: "account successfully created" }
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();

}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function logout(user) {
    const resp = await login.findOne({ unique: user.unique, isActive: true }).select('-token')
    if (!resp) throw 'token not found';
    const update = await login.updateOne({ _id: resp._id }, { $set: { isActive: false, loginEndTime: new Date() } });
    return await login.findById(resp._id).select('-token');
}

async function usersGenerate() {
    let users = [];
    var x = Math.floor(Math.random() * 999);
    const roles = ['AUDITOR','NORMAL'];
    for (var i = 0; i < 40; i++) {
        users.push({
            "lastName": "byte-"+(x+i),
            "firstName": "P",
            "hash": bcrypt.hashSync("Byte@123", 10),// "Byte@123",
            "username": "byte-"+(x+i),
            "role":roles[Math.floor(Math.random() * 2)]
        })
    }

    // console.log(users)

    return await User.create(users)
}