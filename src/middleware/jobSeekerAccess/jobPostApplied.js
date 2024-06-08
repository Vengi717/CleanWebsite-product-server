const connection = require('../../services/database/connect');
const handler = require("../../services/middlewareReturn");

const { ensureUserLoggedIn } = require("../accessControls/auth");


module.exports.accessJobSeekerjobPostAppliedRetractApplication = async (event) => {//make only admin and the exact users access this
    return await ensureUserLoggedIn(event, async () => {

        try {
            const id_user = event.id_user;
            const applicationId = event.pathParameters.id
            const id_applicantion_statuses = await connection.query(
                `SELECT id_applicantion_statuses FROM devproduct.job_posts_applicantion_statuses where status_name = "Retracted Application";`
            );
            console.log("applicationId: ",applicationId)
            console.log("id_applicantion_statuses: ",id_applicantion_statuses[0].id_applicantion_statuses)

            const data = await connection.query(
                `UPDATE devproduct.job_posts_applications
                SET id_applicantion_statuses = ${id_applicantion_statuses[0].id_applicantion_statuses}
                WHERE id_job_posts_application = ${applicationId};`
            );

            await connection.end();
            return handler.returner([true, data], 'Retract Applicantion', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    })
}



module.exports.getAppliationsViaUserId = async (event) => {//make only admin and the exact users access this
    const id_user = event.pathParameters.id
    try {
        const data = await connection.query(
            `
            SELECT * from job_posts_applications
            INNER JOIN job_posts_applicantion_statuses ON job_posts_applications.id_applicantion_statuses = job_posts_applicantion_statuses.id_applicantion_statuses 
           INNER JOIN job_posts ON job_posts_applications.id_job_posts = job_posts.id_job_posts 
     INNER JOIN company_master_title ON job_posts.id_master_title = company_master_title.id_master_title 
     INNER JOIN company_master_department ON company_master_title.id_department_master = company_master_department.id_department_master 

     INNER JOIN company_master_job_types ON company_master_job_types.id_master_job_types = job_posts.id_master_job_types 

           where id_user = 
            ${event.pathParameters.id}`
        );
        await connection.end();
        return handler.returner([true, data], 'Applicantion data', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}