const connection = require("../../../../services/database/connect");
const handler = require("../../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../../accessControls/auth");
const db = require("../../../../services/database/query");

const bcrypt = require("bcryptjs")

async function CreateTeamMemberPermissions({ permissions, id_user }) {
    console.log("permissions: ", permissions);
    console.log("id_user: ", id_user);

    for (const permission of permissions) {
        try {
            // Add the id_user property to the permission object
            permission.id_user = id_user;

            // Assuming you have a database connection named "connection"
            const result = await connection.query('INSERT INTO permissions_users SET ?', permission);
            console.log(`Permission inserted successfully for id_user ${id_user}`);
        } catch (error) {
            console.error(`Error inserting permission for id_user ${id_user}:`, error);
        }
    }
}

module.exports.v3AccessAdminUsersCreateTeamMember = async (event) => {
    var data = JSON.parse(event.body);
    if (data.nonTeamMember) {
        try {
            console.log("ffffff: ",data.nonTeamMember)
            const newData = { ...data.nonTeamMember };
            delete newData.auth;
            delete newData.nonTeamMember
            newData.is_tm = false

            newData.id_master_title = 2


            const salt = await bcrypt.genSalt(10);
            newData.password = await bcrypt.hash(newData.password, salt);
            newData.created_by = event.id_user
            newData.updated_by = event.id_user
            const result = await connection.query('INSERT INTO users SET ?', newData);

          //  await CreateTeamMemberPermissions({ id_user: result.insertId, permissions: data.permissions })

            await connection.end();
            return await handler.returner([true, result], 'Team member created successfully!', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            if (error.code == "ER_DUP_ENTRY") {
                return handler.returner([false, error], 'Failed to create team member. Existing Email', 500);
            }
            return handler.returner([false, error], 'Failed to create team member', 500);
        }
    }


    return await ensureUserLoggedIn(event, async () => {
        try {
            const newData = { ...data.teamMember };
            delete newData.auth;
            newData.is_tm = true
            if (newData.nonTeamMember) {
                delete newData.nonTeamMember
                newData.is_tm = false
            }

            const salt = await bcrypt.genSalt(10);
            newData.password = await bcrypt.hash(newData.password, salt);
            newData.created_by = event.id_user
            newData.updated_by = event.id_user
            const result = await connection.query('INSERT INTO users SET ?', newData);

            await CreateTeamMemberPermissions({ id_user: result.insertId, permissions: data.permissions })

            await connection.end();
            return await handler.returner([true, result], 'Team member created successfully!', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            if (error.code == "ER_DUP_ENTRY") {
                return handler.returner([false, error], 'Failed to create team member. Existing Email', 500);
            }
            return handler.returner([false, error], 'Failed to create team member', 500);
        }
    });
};


module.exports.v3AccessAdminUsersUpdateTeamMember = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            var data = JSON.parse(event.body);
            data = data.teamMember
            const newData = { ...data };
            delete newData.auth;
            newData.updated_by = event.id_user
            const updatingUserId = newData.id_user
            delete newData.id_user;
            const sql = `Update  users SET ? where id_user = ${updatingUserId}`
            const result = await connection.query(sql, newData);
            await connection.end();
            return await handler.returner([true, result], 'Team member updated successfully!', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            return handler.returner([false, error], 'Failed to update team member', 500);
        }
    });
};



module.exports.AccessAdminUsersTeamMembers = async (event) => {
    try {
        const requestBody = JSON.parse(event.body || '{}');
        const activeOnly = requestBody.only_active;
        var string
        if (activeOnly) {
            string =
                `
            -- Team Members
SELECT u.*
FROM devproduct.users u
INNER JOIN devproduct.company_master_title cmt ON u.id_master_title = cmt.id_master_title
WHERE cmt.title_name != 'Job Seeker' AND u.active = true
            `
        }
        else {
            string = `
            -- Team Members
            SELECT u.*
            FROM devproduct.users u
            INNER JOIN devproduct.company_master_title cmt ON u.id_master_title = cmt.id_master_title
            WHERE cmt.title_name != 'Job Seeker' 
            `
        }


        const teamMembers = await db.custom(
            string
        );

        const deps = await connection.query(
            `
        SELECT * FROM devproduct.company_master_department
        where active  <> 0`
        )
        var titles = await connection.query(
            `SELECT t1.title_name, t1.id_department_master, t1.id_master_title, t1.active, t1.reportsTo, t2.title_name AS reportsToTitle
         FROM company_master_title t1
         LEFT JOIN company_master_title t2 ON t1.reportsTo = t2.id_master_title 
         where t1.active  <> 0

        `
        );

        const defaultPermissions = await db.custom(
            `
            SELECT
            pd.read,id_master_title,pm.type,pm.name,pm.url,pm.permissions_master_id
         FROM
         devproduct.permissions_master AS pm
         JOIN
             devproduct.permissions_default AS pd
         ON
             pd.permissions_master_id = pm.permissions_master_id;

            `
        );

        const permissions = await db.custom(
            `
            SELECT
            pm.type,pm.name,pm.url,pm.permissions_master_id
         FROM
         devproduct.permissions_master AS pm
            `
        );


        connection.quit();
        return handler.returner([true, { teamMembers, deps, titles, defaultPermissions, permissions }], 'Update user', 200);
    } catch (error) {
        console.log(error);
        connection.quit()
        return handler.returner([false, error], 'Internal server errors', 500);
    }
}