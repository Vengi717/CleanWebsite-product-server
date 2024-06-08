const connection = require("../../../services/database/connect");
const handler = require("../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../accessControls/auth");
const db = require("../../../services/database/query");
module.exports.v3AccessAdminSettingsUpdateDefaults = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {


            var data = JSON.parse(event.body);
            console.log("predata: ", data)


            data.read = data.state
            delete data.state;
            delete data.auth;

            const dataInsert = {...data}
            const dataUpdate = {...data}
            delete dataUpdate.permissions_master_id;
            delete dataUpdate.id_master_title;
            var sql = `Update  permissions_default SET ? 
            where permissions_master_id = ${dataInsert.permissions_master_id} AND
            id_master_title = ${dataInsert.id_master_title} `
            const result = await connection.query(sql, dataUpdate);
            if (result.affectedRows == 0) {
                sql = `INSERT INTO permissions_default SET ?`;
                const result = await connection.query(sql, dataInsert);
                console.log("result: ", result)
            }


            await connection.end();
            return await handler.returner([true, result], 'Team member updated successfully!', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            return handler.returner([false, error], 'Failed to update team member', 500);
        }
    });
};

module.exports.v3AccessAdminSettingsCreatePermission = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            var body = JSON.parse(event.body)
            const auth = body.auth; // Store the "auth" key separately
            delete body.auth; // Remove the "auth" key from the body
            const result = await connection.query('INSERT INTO permissions_master SET ?', body);
            const permissions_master_id = result.insertId
            const id_user = event.id_user

            body = {
                ...body,
                permissions_master_id,
                id_user: id_user
            }



            //  console.log("------------result", result)

            await add_prem_to_tm(body)

            await connection.end();
            //  await ensureUserLoggedIn(event, add_prem_to_tm) TODO: is this still needed?
            return await handler.returner([true, result], 'Permission Create', 200)
        } catch (error) {
            console.log("error: ", error)
            return handler.returner([false, error], 'Permission Create', 500)
        }
    })
}

async function add_prem_to_tm(body) {
    console.log(body)
    let permissonObject = {}
    permissonObject.permissions_master_id = body.permissions_master_id
    permissonObject.id_user = body.id_user
    permissonObject.create = 1
    permissonObject.read = 1
    permissonObject.write = 1
    permissonObject.delete = 1
    permissonObject.import = 1
    permissonObject.export = 1
    permissonObject.is_active = 1
    permissonObject.created_by = body.id_user
    permissonObject.updated_by = body.id_user
    const a = await db.insert_new(permissonObject, "permissions_users")
}

module.exports.AccessAdminSettingsPermissions_and_defaults = async (event) => {
    try {
        const deps = await connection.query(
            `
            SELECT * FROM devproduct.company_master_department
            where active  <> 0`
        )
        /*    var titles = await connection.query(
                `SELECT title_name,id_department_master,id_master_title,active,reportsTo
                FROM company_master_title  where active  <> 0`
            )*/


        var titles = await connection.query(
            `SELECT t1.title_name, t1.id_department_master, t1.id_master_title, t1.active, t1.reportsTo, t2.title_name AS reportsToTitle
             FROM company_master_title t1
             LEFT JOIN company_master_title t2 ON t1.reportsTo = t2.id_master_title
             WHERE t1.active <> 0`
        );


        var inactive_titles = []
        var temp_titles = []
        for (let index = 0; index < titles.length; index++) {
            const element = titles[index];
            if (element.active == '0') {
                inactive_titles.push(element)
            }
            else {
                temp_titles.push(element)
            }
        }
        titles = temp_titles
        const permissions = await connection.query(`select * from permissions_master  where active <> 0`)

        const defaults = await db.select_all("permissions_default");

        //companys,
        const data = { deps, titles, permissions, defaults, inactive_titles }
        await connection.end();

        return await handler.returner([true, data], 'Get company master data successfully!!', 200)
    } catch (errora) {
        console.log("error: ", errora)
        await connection.end();
        return handler.returner([false, errora], 'Get all permissions', 500)

    }

}
