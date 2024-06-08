


const connection = require("../../services/database/connect");
const handler = require("../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../accessControls/auth");
const db = require("../../services/database/query")

module.exports.accessJobSeekerDashboard = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            const id_user = event.id_user;

            // Retrieve job applications for the logged-in user
            const applications = await connection.query(
                `
                SELECT jpa.*, app_statuses.*, jp.*, cmt.*, cmd.*, cmjt.*
                FROM job_posts_applications AS jpa
                JOIN job_posts_applicantion_statuses AS app_statuses
                ON jpa.id_applicantion_statuses = app_statuses.id_applicantion_statuses
                JOIN job_posts AS jp
                ON jpa.id_job_posts = jp.id_job_posts
                JOIN company_master_title AS cmt
                ON jp.id_master_title = cmt.id_master_title
                JOIN company_master_department AS cmd
                ON cmt.id_department_master = cmd.id_department_master
                JOIN company_master_job_types AS cmjt
                ON jp.id_master_job_types = cmjt.id_master_job_types
                WHERE jpa.id_user = ${id_user} AND (jpa.id_applicantion_statuses = 2 OR jpa.id_applicantion_statuses <> 5)
                `
            );
            const pendingResponse = await connection.query(
                `
                SELECT jpa.*, app_statuses.*, jp.*, cmt.*, cmd.*, cmjt.*
                FROM job_posts_applications AS jpa
                JOIN job_posts_applicantion_statuses AS app_statuses
                ON jpa.id_applicantion_statuses = app_statuses.id_applicantion_statuses
                JOIN job_posts AS jp
                ON jpa.id_job_posts = jp.id_job_posts
                JOIN company_master_title AS cmt
                ON jp.id_master_title = cmt.id_master_title
                JOIN company_master_department AS cmd
                ON cmt.id_department_master = cmd.id_department_master
                JOIN company_master_job_types AS cmjt
                ON jp.id_master_job_types = cmjt.id_master_job_types
                WHERE jpa.id_user = ${id_user} AND (jpa.id_applicantion_statuses = 2 OR jpa.id_applicantion_statuses = 3)
                `
            );

            // Calculate the total number of applications and get the most recent three applications
            const totalApplied = applications.length;
            const recentThreeApplications = applications.slice(0, 3);



            const only_active = JSON.parse(event.body).only_active ?
                " where status = 'open' AND end_date >= NOW()" : ""

            const qty = JSON.parse(event.body).recent_qty ?
                "ORDER BY id_job_posts DESC LIMIT " + JSON.parse(event.body).recent_qty : ""
            const jobPosts = await db.custom(`  
        SELECT * FROM devproduct.job_posts
        LEFT JOIN company_master_title on company_master_title.id_master_title = job_posts.id_master_title
        LEFT JOIN company_master_department on company_master_department.id_department_master = company_master_title.id_department_master
        LEFT JOIN company_master_job_types on company_master_job_types.id_master_job_types = job_posts.id_master_job_types

        ${only_active}
 ${qty}
 `);






            // Close the database connection
            await connection.end();

            // Return the data as a response
            return await handler.returner([true, {
                totalApplied,
                recentThreeApplications,
                pendingResponse,
                jobPosts
                // Add any other data you want to include in the response here
            }], 'Get job seeker dashboard data successfully!', 200);

        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            return handler.returner([false, error], 'Error while accessing the job seeker dashboard', 500);
        }
    });
}