const jwt = require('jsonwebtoken');

const handle = require('../../services/middlewareReturn');
const connection = require('../../services/database/connect');
const bcrypt = require("bcryptjs")

const PRIVATE = "4f93ac9d10cb751b8c9c646bc9dbccb9";

const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
}

module.exports.login = async (event, context) => {
    const { email, password } = JSON.parse(event.body);
    /*
        const user_exist = (await db.search_one("users", "email", email))[0]
        console.log("users exists: ", user_exist)
        const pass_valid = await bcrypt.compare(password, user_exist.user_password)
        console.log("users exists: ", user_exist)
    */ 

    console.log("-------email: ", email)
    console.log("-------password: ", password)


    try {
        //  console.log("pass: ",password)
        // console.log("email: ",email)
        const employee = await connection.query(
            `SELECT * FROM users WHERE email = '${email}' and active = 1;`
        );
        console.log("-------employee: ", employee)

        var validPassword


        if (employee[0]) {
            validPassword = await bcrypt.compare(password, employee[0].password);
        } else {
            return handle.returner([false, 'Incorrect email or Password'], 'Incorrect email or Password', 401);
        }



        if (validPassword) {
            const token = jwt.sign({
                email,
            }, PRIVATE, {
                subject: employee[0].id_user.toString(),
                expiresIn: '1d',
            });


            console.log("ffffsdfs____ ", token)


            connection.quit()
            return handle.returner([true, { token, id_user: employee[0].id_user }], 'logged-in', 200);
        } else {
            connection.quit();
            return handle.returner([false, 'Password incorrect'], 'Password incorrect', 401);
        }
    } catch (error) {
        console.log(error);
        connection.quit();
        return handle.returner([false, 'Unknown Error'+error+process.env.DEV_REMOTE_DB_HOST], 'Unknown Error'+error, 401);
    }
}

module.exports.ensure_access_Authorized = async (event, next, requried_access_types) => {

}

module.exports.ensureUserLoggedIn = async (event, next) => {//TODO: this should compare the jwt with the ones in the db. currently and non expired jwt will work
    const body = JSON.parse(event.body)
    var auth = JSON.stringify(body.auth);

    if (!auth) {
        console.log("---- Unauthorized")
        console.log("handled error: ", auth)
        return handle.returner([false, ''], 'Custom Unauthorized', 401);
    }

    try {
        auth = JSON.parse(auth)
        token = auth.split(' ')
        var tok = jwt.verify(token[0], PRIVATE);
        event.id_user = tok.sub;
        return await next(event);
    } catch (err) {
        console.log("-- Unauthorized")
        console.log("next event: ", event.path)
        console.log("BODY", JSON.parse(event.body))
        console.log("old body", JSON.stringify(event.headers.Authorization))
        console.log("err", err)
        return handle.returner([false, ''], 'Unauthorized', 401);
    }
}

module.exports.getuser_id = async (event) => {
    return await this.ensureUserLoggedIn(event, () => {
        return handle.returner([true, event.id_user], 'users Id returned', 200);
    });
}