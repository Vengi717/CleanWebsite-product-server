const handler = require("../../../services/middlewareReturn");
const connection = require('../../../services/database/connect');



module.exports.adminAccessJobsDashboard = async (event) => {

    try {

        /* const vacancies = await connection.query(`
         SELECT *
         FROM devproduct.job_posts
         WHERE end_date >= CURDATE() AND status = 'open';
         `)*/

        const vacancies = await connection.query(`

        SELECT jp.*, cmt.title_name, cmd.department_name
         FROM devproduct.job_posts AS jp
     INNER JOIN devproduct.company_master_title AS cmt
     ON jp.id_master_title = cmt.id_master_title
     INNER JOIN devproduct.company_master_department AS cmd
      ON cmt.id_department_master = cmd.id_department_master
      WHERE jp.end_date >= CURDATE() AND jp.status = 'open';
        `)
        const vacancyQTY = vacancies.length

        const jobSeekers = await connection.query(`
        SELECT *
        FROM devproduct.users AS u
        INNER JOIN devproduct.company_master_title AS cmt
        ON u.id_master_title = cmt.id_master_title
        WHERE cmt.title_name = 'Job Seeker' AND u.active = 1;
        `)

        const jobSeekerQTY = jobSeekers.length

        const activeApplications = await connection.query(`
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
        ON jpa.id_user = u.id_user
        WHERE app_statuses.status_name <> 'Rejected' AND app_statuses.status_name <> 'Onboarded'  AND jp.status = 'Open' AND jp.end_date >= CURDATE();
    `);

        const actvieApplicationsQTY = activeApplications.length

        const teamMembers = await connection.query(`
        SELECT *
        FROM devproduct.users AS u
        INNER JOIN devproduct.company_master_title AS cmt
        ON u.id_master_title = cmt.id_master_title
        WHERE cmt.title_name <> 'Job Seeker' AND u.active = 1;
        `)

        const teamMembersQTY = teamMembers.length




        await connection.end();
        return handler.returner([true, { teamMembersQTY, vacancies, vacancyQTY, jobSeekerQTY, activeApplications, actvieApplicationsQTY }], 'Get employee qty', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }

};


/*
    const teamMembers =
    const openApplications =
    const latestVacancies =
    const applications =

*/
