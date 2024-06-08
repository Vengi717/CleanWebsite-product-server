const connection = require("../../../../services/database/connect");
const handler = require("../../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../../accessControls/auth");
const db = require("../../../../services/database/query");


module.exports.v3accessAdminUsersUsersOther = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const teamMembers = await db.custom(
                `
                -- Team Members
                SELECT u.*
                FROM devproduct.users u
                INNER JOIN devproduct.company_master_title cmt ON u.id_master_title = cmt.id_master_title
                WHERE cmt.title_name != 'Job Seeker'
                
                `
            );
            const nonTeamMembers = await db.custom(
                `
                -- Non-Team Members (Job Seekers)
                SELECT u.*
                FROM devproduct.users u
                INNER JOIN devproduct.company_master_title cmt ON u.id_master_title = cmt.id_master_title
                WHERE cmt.title_name = 'Job Seeker'
                
                `
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
            return handler.returner([true, { teamMembers, deps, titles, nonTeamMembers, defaultPermissions, permissions }], 'Update user', 200);
        } catch (error) {
            console.log(error);
            connection.quit()
            return handler.returner([false, error], 'Internal server errors', 500);
        }



    });
};



