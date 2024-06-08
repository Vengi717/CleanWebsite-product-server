const connection = require("../../../../services/database/connect");
const handler = require("../../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../../accessControls/auth");

module.exports.v3AccessAdminSettingsTitles = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const deps = await connection.query(
                `
            SELECT * FROM devproduct.company_master_department
            where active  <> 0`
            )
            var titles = await connection.query(
                `SELECT t1.title_name, t1.id_department_master, t1.id_master_title, t1.active, t1.reportsTo, t2.title_name AS reportsToTitle
             FROM company_master_title t1
             LEFT JOIN company_master_title t2 ON t1.reportsTo = t2.id_master_title
            `
            );
            const data = { deps, titles }
            await connection.end();
            return await handler.returner([true, data], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    })
}

module.exports.createTitle = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        const body = JSON.parse(event.body)
        const id_user = event.id_user
        const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        let { title_name,
            id_department_master, reportsTo
        } = body
        try {

            const data = await connection.query(
                `INSERT INTO company_master_title (
                title_name,
                reportsTo,
                id_department_master,
                created_at, 
                created_by, 
                updated_at, 
                updated_by,
                active
            )
            VALUES (
                '${title_name}',
                ${reportsTo != '' ? `'${reportsTo}'` : null},
                '${body.id_department_master}',
                '${date_time}',
                '${id_user}', 
                '${date_time}',
                '${id_user}',
                1
            );
            `
            );
            await connection.end();
            return await handler.returner([true, "data"], 'Create Title', 200)
        } catch (error) {
            console.log("error: ", error)
            await connection.end();
            return handler.returner([false, error], 'Create Title', 500)
        }
    })

}

module.exports.updateTitle = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        var body = JSON.parse(event.body)
        const id_user = event.id_user
        const id_master_title = body.id_master_title
        const title_name = body.title_name
        try {
            var data
            if (body.reportsToTitle) {
                var reportsToId = await connection.query(
                    `select * from company_master_title where title_name= "${body.reportsToTitle}"
                 `
                );

                if (reportsToId.length == 0) {
                    return handler.returner([false, error], 'Create Title', 500)
                }

                data = await connection.query(
                    `update company_master_title set 
                    reportsTo = '${reportsToId[0].id_master_title}', 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_master_title = ${id_master_title}
                `
                );
            }
            else if (body.reportsToTitle == "") {
                data = await connection.query(
                    `update company_master_title set 
                    reportsTo = null, 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_master_title = ${id_master_title}
                `
                );
            }

            else if (body.hasOwnProperty("active")) {
                data = await connection.query(
                    `update company_master_title set 
                    active = ${body.active}, 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_master_title = ${id_master_title}
                `
                );
            }

            else {
                if (title_name == "") {
                    return handler.returner([false, error], 'Create Title', 500)
                }
                data = await connection.query(
                    `update company_master_title set 
                    title_name = '${title_name}', 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_master_title = ${id_master_title}
                `
                );
            }
            await connection.end();
            return await handler.returner([true, data], 'Create Title', 200)
        } catch (error) {
            console.log("error: ", error)
            await connection.end();
            return handler.returner([false, error], 'Create Title', 500)
        }
    })

}

module.exports.deleteTitle = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        var body = JSON.parse(event.body)
        const id_user = event.id_user
        const id_master_title = body.id_master_title

        const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        try {
            const data = await connection.query(`delete from company_master_title where id_master_title = ${id_master_title}`);
            return await handler.returner([true, data], 'Delete Title', 200)
        } catch (error) {       // if the title cant be deleted due to conflict of FK
            try {
                const data = await connection.query(
                    `update company_master_title set 
                    active = 0, 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_master_title = ${id_master_title}`
                );
                await connection.end();
                return await handler.returner([true, data], 'Deactivate Title', 200)
            } catch (error) {
                console.log(error)
                await connection.end();
                return handler.returner([false, error], 'Deactivate Title', 500)
            }
        }
    })

}