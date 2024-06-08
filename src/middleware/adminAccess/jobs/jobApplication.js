
//TODO: this is not used yet. it was copied from other file
const connection = require("../../../services/database/connect");
const handler = require("../../../middlewareReturn");
const { ensureUserLoggedIn } = require("../accessControls/auth");

module.exports.v3AccessAdminJobApplication = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            let { applicationId, jobPostId } = event.pathParameters;
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
            WHERE jp.id_job_posts = ${jobPostId};
                `
            )

            // Check if the combination of user ID and job post ID already exists
            const existingApplication = await connection.query(
                `
                SELECT
                jpa.*,
                jpas.status_name AS application_status
            FROM
                job_posts_applications AS jpa
            JOIN
                job_posts_applicantion_statuses AS jpas
            ON
                jpa.id_applicantion_statuses = jpas.id_applicantion_statuses
            WHERE
                jpa.id_job_posts_application = ?;
            
    `,
                [applicationId]
            );

         //   console.log("application: ",existingApplication[0])
          //  console.log("jobPost: ",data[0])

            await connection.end();
            return await handler.returner([true, {
                application: existingApplication[0],
                jobPost: data[0]

            }], 'Get company master data successfully!!', 200)
        } catch (errora) {
            console.log("error: ", errora)
            await connection.end();
            return handler.returner([false, errora], 'Get all permissions', 500)
        }
    });

}
