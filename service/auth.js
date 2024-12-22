/* WHEN USING COOKIES

const sessionIdUserMap = new Map();

function setUser(id, user) {
    sessionIdUserMap.set(id, user);
}
function getUser(id) {
    return sessionIdUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
}

*/

const jwt = require('jsonwebtoken');
const secret = "Jayrathod19";

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email:user.email,
    }, secret);
}
function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    }
    catch (error) {
        return null;
    }
}

module.exports = {
	setUser,
	getUser,
};