const handler = require("../../../services/middlewareReturn");
const connection = require('../../../services/database/connect');
const { ensureUserLoggedIn } = require("../../accessControls/auth");
const db = require("../../../services/database/query")



module.exports.accessAdminManageJobs = async (event) => {
    return await ensureUserLoggedIn(event, async () => {

        try {


            const only_active = JSON.parse(event.body).only_active ?
                " where status = 'open' " : ""

            const qty = JSON.parse(event.body).recent_qty ?
                "ORDER BY id_job_posts DESC LIMIT " + JSON.parse(event.body).recent_qty : ""
            const applications           = await db.custom(`  
        SELECT * FROM devproduct.job_posts
        LEFT JOIN company_master_title on company_master_title.id_master_title = job_posts.id_master_title
        LEFT JOIN company_master_department on company_master_department.id_department_master = company_master_title.id_department_master
        LEFT JOIN company_master_job_types on company_master_job_types.id_master_job_types = job_posts.id_master_job_types

        ${only_active}
 ${qty}
 `);

            //this adds the applied to qty to each job post
            const job_posts_applications = await db.custom(`  
 SELECT * FROM devproduct.job_posts_applications
 LEFT JOIN job_posts_applicantion_statuses on job_posts_applicantion_statuses.id_applicantion_statuses = job_posts_applications.id_applicantion_statuses
`);
applications.map((data_ele, index) => {
                job_posts_applications.map((ele, index) => {
                    if (ele.id_job_posts == data_ele.id_job_posts) {
                        if (!data_ele.applied_qty) {
                            data_ele.applied_qty = 1
                        } else {
                            data_ele.applied_qty++
                        }
                    }
                })
            })


            var jobTypes = await db.custom(`  
            SELECT * FROM devproduct.company_master_job_types
              `);

            await connection.end();
            return handler.returner([true, {
                applications,
                jobTypes

            }], 'Get employee qty', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    })
};
