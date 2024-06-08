const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const handler = require("../../services/middlewareReturn");
dotenv.config();
const connection = require('../../services/database/connect');
const { ensureUserLoggedIn } = require("../accessControls/auth");


module.exports.getPermissionsMaster = async (event) => {//should be in shared api folder
    const data = await connection.query(
        `SELECT permissions_master_id, name as module_name,
        type, url
        FROM permissions_master where active = 1`
    );
    connection.quit()

    return handler.returner([true, data], 'Get module master data successfully!!', 200)
};


module.exports.getUserPermission = async (event) => {//should be in shared api folder
    return await ensureUserLoggedIn(event, async () => {
        const id_user = event.id_user;
        try {
            const data = await connection.query(
                `SELECT 
                em.id_user
             FROM users em
             WHERE em.id_user = '${id_user}'`
            );

            for (let ele of data) {
                const permission = await connection.query(`
                SELECT 
                    mm.name,
                    mm.url,
                    mm.type,
                    mpm.*
                FROM permissions_users mpm 
                LEFT JOIN permissions_master mm ON mm.permissions_master_id = mpm.permissions_master_id
                WHERE mpm.id_user =  ${ele.id_user}
            `);

                const roll = await connection.query(`
                SELECT rm.roll_name FROM users_role_master rm, users WHERE users.id_user = '${id_user}';
            `);

                ele.module_permission = permission;
                ele.roll_type = roll;
            }
            connection.quit();
            return handler.returner([true, data[0]], 'Employee permissions data', 200);
        } catch (error) {
            console.log(error);
            connection.quit();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    })

};



async function doesUserEmailExist(email) {
    const users = await connection.query(
        `SELECT * FROM users WHERE email = '${email}' and active = 1;`
    );
    return users[0]
}

async function createJWT({ user, email }) {
    // Define the data you want to include in the JWT.
    const payload = {
        email, // The user's email, which you want to include in the JWT.
    };
    // Define options for the JWT.
    const options = {
        subject: user.id_user.toString(), // The "sub" claim of the JWT, often representing the user ID.
        expiresIn: '1d', // Set the expiration time of the JWT to one day.
    };
    // Create the JWT using the payload, private key, and options.
    const token = jwt.sign(payload, process.env.PRIVATE, options);
    return token
}

module.exports.login = async (event, context) => {
    const { email, password } = JSON.parse(event.body);
    try {
        const user = await doesUserEmailExist(email)
        var validPassword
        if (user) {
            validPassword = await bcrypt.compare(password, user.password);
        } else {
            return handler.returner([false, 'Incorrect email or Password'], 'Incorrect email or Password', 401);//wrong email
        }
        if (validPassword) {
            const token = await createJWT({ user, email })
            return handler.returner([true, { token, id_user: user.id_user }], 'logged-in', 200);
        } else {
            connection.quit();
            return handler.returner([false, 'Incorrect email or Password'], 'Incorrect email or Password', 401); //wrong password
        }
    } catch (error) {
        console.log(error);
        connection.quit();
        return handler.returner([false, 'Unknown Error' + error + process.env.DEV_REMOTE_DB_HOST], 'Unknown Error' + error, 401);
    }
}


