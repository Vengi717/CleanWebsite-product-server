const connection = require("../../../../services/database/connect");
const handler = require("../../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../../accessControls/auth");

module.exports.v3AccessAdminSettingsDepartments = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const deps = await connection.query(
                `
            SELECT * FROM devproduct.company_master_department
            `
            )

            const data = { deps }
            await connection.end();
            return await handler.returner([true, data], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    })
}



module.exports.createDepartment = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        var body = JSON.parse(event.body);
        const id_user = 1; //event.id_user
        const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let {
            department_name,
        } = body;
        try {
            const data = await connection.query(
                `
                INSERT INTO company_master_department (department_name,created_at, created_by, updated_at, updated_by,active)
               VALUES ('${department_name}','${datetime}','${id_user}', '${datetime}','${id_user}',1);
                `
            );
            await connection.end();
            return await handler.returner([true, data], 'Create department', 200);
        } catch (error) {
            await connection.end();
            console.log("error: ", error);
            return handler.returner([false, error], 'Create department', 500);
        }
    })

}

module.exports.updateDepartment = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        var body = JSON.parse(event.body)
        const id_user = event.id_user
        const id_department_master = body.id_department_master
        const department_name = body.department_name
        try {
            var data
            if (body.hasOwnProperty("active")) {
                data = await connection.query(
                    `update company_master_department set 
                    active = ${body.active}, 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_department_master = ${id_department_master}
                `
                );
            }

            else {
                if (department_name == "") {
                    return handler.returner([false, error], 'Create Department', 500)
                }
                data = await connection.query(
                    `update company_master_department set 
                    department_name = '${department_name}', 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_department_master = ${id_department_master}
                `
                );
            }
            await connection.end();
            return await handler.returner([true, data], 'Create Department', 200)
        } catch (error) {
            console.log("error: ", error)
            await connection.end();
            return handler.returner([false, error], 'Create Department', 500)
        }
    })

}

module.exports.deleteDepartment = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        var body = JSON.parse(event.body)
        const id_user = event.id_user
        const id_department_master = body.id_department_master

        const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        try {
            const data = await connection.query(`delete from company_master_department where id_department_master = ${id_department_master}`);
            return await handler.returner([true, data], 'Delete Department', 200)
        } catch (error) {       // if the title cant be deleted due to conflict of FK
            try {
                const data = await connection.query(
                    `update company_master_department set 
                    active = 0, 
                    updated_at = '${date_time}',
                    updated_by = ${id_user} where id_department_master = ${id_department_master}`
                );
                await connection.end();
                return await handler.returner([true, data], 'Deactivate Department', 200)
            } catch (error) {
                console.log(error)
                await connection.end();
                return handler.returner([false, error], 'Deactivate Department', 500)
            }
        }
    })

}