const connection = require("../../services/database/connect");
const handler = require("../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../accessControls/auth");
const db = require("../../services/database/query")
module.exports.v3AccessJobSeekerJobDetails = async (event) => {
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


            await connection.end();
            return await handler.returner([true, {
                hasApplication: existingApplication[0].id_job_posts_application,
                jobPost: data[0]

            }], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    });

}

module.exports.v3AccessJobSeekerCreateApplication = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const id_user = event.id_user;
            const data = JSON.parse(event.body);
            data.id_user = id_user;
            delete data.auth;
            data.id_applicantion_statuses = 1;

            // Check if the combination of user ID and job post ID already exists
            const existingApplication = await connection.query(
                `
                SELECT id_job_posts_application
                FROM job_posts_applications
                WHERE id_user = ? AND id_job_posts = ?
                `,
                [id_user, data.id_job_posts]
            );

            if (existingApplication.length > 0) {
                return handler.returner([false, "Application already exists"], 'Application already exists', 409);
            }

            // Insert the application if it doesn't already exist
            const result = await connection.query(
                `
                INSERT INTO job_posts_applications
                SET ?
                `,
                data
            );

            await connection.end();
            return handler.returner([true, data[0]], 'Application Created', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            return handler.returner([false, error], 'Create Application', 500);
        }
    });
}

module.exports.v2get_job_post_offered_interview_by_idHandler = async (event) => {
    try {
        var body = JSON.parse(event.body);
        var data = body.data


        var result = await db.custom(`  
        SELECT * from job_posts_applications
        INNER JOIN job_posts_applicantion_statuses ON job_posts_applications.id_applicantion_statuses = job_posts_applicantion_statuses.id_applicantion_statuses 
       INNER JOIN job_posts ON job_posts_applications.id_job_posts = job_posts.id_job_posts 
 INNER JOIN company_master_title ON job_posts.id_master_title = company_master_title.id_master_title 
 INNER JOIN company_master_department ON company_master_title.id_department_master = company_master_department.id_department_master 

 INNER JOIN company_master_job_types ON company_master_job_types.id_master_job_types = job_posts.id_master_job_types 

   
    where id_user = 1 AND status_name = 'Offered' 
    OR
      id_user = 1 AND status_name = 'Interview Requested'
        `);
        await connection.end();
        return handler.returner([true, await result], 'Get Offered QTY', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};