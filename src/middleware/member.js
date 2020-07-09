const client = require('../config/redis')
const helper = require('../helpers')

const authenticateJWT = async (req, res, next) => {
    if (req.user.role == 0) {
        client.flushdb(function(err,success){
            console.log(success)
        })
        next()
    } else {
        return helper.response(res, 403, {message: "Access Denied"})
    }
};

module.exports = authenticateJWT
    