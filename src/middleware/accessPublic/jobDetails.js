const connection = require("../../services/database/connect");
const handler = require("../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../accessControls/auth");

module.exports.v3AccessPublicJobDetails = async (event) => {
    try {
        let { id } = event.pathParameters;
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
            WHERE jp.end_date >= NOW()
            AND jp.id_job_posts = ${id};
                `
        )
        await connection.end();
        return await handler.returner([true,  data[0] ], 'Get company master data successfully!!', 200)
    } catch (errora) {
        console.log("error: ", errora)
        await connection.end();
        return handler.returner([false, errora], 'Get all permissions', 500)
    }
}