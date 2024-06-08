const connection = require("../../../services/database/connect");
const handler = require("../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../accessControls/auth");
module.exports.accessAdminJobDetailsEdit = async (event) => {
    return await ensureUserLoggedIn(event, async () => {

        try {
            let { id } = event.pathParameters;
            const id_user = event.id_user;
            const data = await connection.query(
                `
                SELECT 
                jp.*,
                cmt.title_name AS company_title_name,
                cmjt.master_job_type_name AS job_type_name,
                cmd.department_name AS department_name
            FROM devproduct.job_posts jp
            LEFT JOIN devproduct.company_master_title cmt ON jp.id_master_title = cmt.id_master_title
            LEFT JOIN devproduct.company_master_job_types cmjt ON jp.id_master_job_types = cmjt.id_master_job_types
            LEFT JOIN devproduct.company_master_department cmd ON cmt.id_department_master = cmd.id_department_master
            WHERE jp.id_job_posts = ${id};
                `
            )


            // Check if the combination of user ID and job post ID already exists
            const existingApplication = await connection.query(
                `
    SELECT id_job_posts_application
    FROM job_posts_applications
    WHERE id_user = ? AND id_job_posts = ?
    `,
                [id_user, id]
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




            await connection.end();
            return await handler.returner([true, {
                hasApplication: existingApplication[0].id_job_posts_application,
                jobPost: data[0],
                deps,
                titles

            }], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    });

}