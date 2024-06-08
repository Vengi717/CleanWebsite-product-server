const jwt = require('jsonwebtoken');
const handle = require('../../services/middlewareReturn');
const bcrypt = require("bcryptjs")

const PRIVATE = "4f93ac9d10cb751b8c9c646bc9dbccb9";

const encryptString = async (string) => {
    const salt = await bcrypt.genSalt(10)
    const encryptedString = await bcrypt.hash(string, salt)
    return encryptedString
}



async function decode(token) {
    try {
        return jwt.verify(token, PRIVATE);
    } catch (error) {
        return error
    }
}

async function isTokenUnexpired(decoded) {
    if (decoded) {
        // Check if the token has expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && currentTimestamp > decoded.exp) {
            return { success: false, data: "Token has expired" };
        }

        // Add your custom validation logic here
        return { success: true, data: "Token is valid" };
    } else {
        return { success: false, data: "Token is not valid" };
    }
}








module.exports.ensureUserLoggedIn = async (event, next) => {//TODO: this should compare the jwt with the ones in the db
    const body = JSON.parse(event.body)
    var token = body.auth

    if (!token) {
        console.log("---- No JWT")
        return handle.returner([false, ''], 'Custom Unauthorized', 401);
    }
    try {
        var decodedToken = await decode(token)
        if (decodedToken) {
            const unexpiredToken = await isTokenUnexpired(decodedToken)
            if (unexpiredToken) {
                event.id_user = decodedToken.sub;
                return await next(event);
            }
            else {
                return handle.returner([false, ''], 'JWT expired', 401);
            }
        }
        else {
            return handle.returner([false, ''], 'JWT Malformed', 401);
        }
    } catch (err) {
        console.log("-- Unauthorized")
        console.log("err", err)
        return handle.returner([false, ''], 'Unauthorized', 401);
    }
}

module.exports.getuser_id = async (event) => {
    return await this.ensureUserLoggedIn(event, () => {
        return handle.returner([true, event.id_user], 'users Id returned', 200);
    });
}