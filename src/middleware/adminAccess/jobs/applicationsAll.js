const handler = require("../../../services/middlewareReturn");
const connection = require('../../../services/database/connect');



module.exports.adminAccessApplicationsAll = async (event) => {

    try {

        const applications = await connection.query(`
        SELECT jpa.*, app_statuses.*, jp.*, cmt.title_name, cmd.department_name, u.*
        FROM devproduct.job_posts_applications AS jpa
        INNER JOIN devproduct.job_posts_applicantion_statuses AS app_statuses
        ON jpa.id_applicantion_statuses = app_statuses.id_applicantion_statuses
        INNER JOIN devproduct.job_posts AS jp
        ON jpa.id_job_posts = jp.id_job_posts
        INNER JOIN devproduct.company_master_title AS cmt
        ON jp.id_master_title = cmt.id_master_title
        INNER JOIN devproduct.company_master_department AS cmd
        ON cmt.id_department_master = cmd.id_department_master
        INNER JOIN devproduct.users AS u
        ON jpa.id_user = u.id_user ;
    `);





        await connection.end();
        return handler.returner([true, { applications }], 'Get employee qty', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }

};