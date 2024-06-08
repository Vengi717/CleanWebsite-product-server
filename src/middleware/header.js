const connection = require("../services/database/connect");
const handler = require("../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../middleware/accessControls/auth");
module.exports.getUser = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const id_user = event.id_user
            const data = await connection.query(
                `
                select * from users where id_user
                = ${id_user};
                `
            )

            await connection.end();
            return await handler.returner([true,
                data[0]
            ], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    });

}
