const connection = require("../../../../services/database/connect");
const handler = require("../../../../services/middlewareReturn");
const { ensureUserLoggedIn } = require("../../../accessControls/auth");
const db = require("../../../../services/database/query");

module.exports.v3AccessAdminUserProfile = async (event) => {
    const userId = event.pathParameters.id;

    try {
        var body = JSON.parse(event.body);
        const user_profile = await db.custom(
            `SELECT * FROM devproduct.users 
where id_user = ${userId}`
        );

        const family_info = await db.custom(
            `SELECT * FROM devproduct.users_family_info
where id_user = ${userId}`
        );
        const education_info = await db.custom(
            `SELECT * FROM devproduct.users_education
where id_user = ${userId}`
        );
        const experience_info = await db.custom(
            `SELECT * FROM devproduct.users_experience
where id_user = ${userId}`
        );

        const title_info = await db.custom(
            `SELECT * FROM devproduct.company_master_title
where id_master_title = ${await user_profile[0].id_master_title}`
        );
        const department_info = await db.custom(
            `SELECT * FROM devproduct.company_master_department
where id_department_master = ${await title_info[0].id_department_master}`
        );





        const teamMembers = await db.custom(
            `
            -- Team Members
SELECT u.*
FROM devproduct.users u
INNER JOIN devproduct.company_master_title cmt ON u.id_master_title = cmt.id_master_title
WHERE cmt.title_name != 'Job Seeker' AND u.active = true
            `

        );

        const deps = await db.custom(
            `
        SELECT * FROM devproduct.company_master_department
        where active  <> 0`
        )
        var titles = await db.custom(
            `SELECT t1.title_name, t1.id_department_master, t1.id_master_title, t1.active, t1.reportsTo, t2.title_name AS reportsToTitle
         FROM company_master_title t1
         LEFT JOIN company_master_title t2 ON t1.reportsTo = t2.id_master_title 
         where t1.active  <> 0

        `
        );

        const reportsTo_info = await db.custom(
            `SELECT first_name,last_name,id_user FROM devproduct.users 
where id_user = ${user_profile[0].reportsTo}`

        );

        const data = {
            reportsTo_info: reportsTo_info[0],
            teamMembers,
            deps,
            titles,
            user_profile: user_profile[0],
            family_info,
            education_info,
            experience_info,
            documents: await get_docs_by_user_id(event),
            title_info: title_info[0],
            department_info: department_info[0]
        }
        connection.end();
        return handler.returner([true, data], 'Single employee data!!', 200);
    } catch (error) {
        console.log(error);
        connection.end();

        return handler.returner([false, error], 'Internal server errors', 500);
    }


}

module.exports.v3AccessAdminUserProfileUpdateUser = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            var data = JSON.parse(event.body);
            const newData = { ...data };
            delete newData.auth;
            delete newData.id_user;
            newData.updated_by = event.id_user
            const sql = `Update  users SET ? where id_user = ${event.pathParameters.id}`
            const result = await connection.query(sql, newData);
            await connection.end();
            return await handler.returner([true, result], 'Team member updated successfully!', 200);
        } catch (error) {
            console.log("error: ", error);
            await connection.end();
            return handler.returner([false, error], 'Failed to update team member', 500);
        }
    });
}


async function get_docs_by_user_id(event) {
    const id_user = JSON.parse(event.body).id_user
    const only_active = JSON.parse(event.body).only_active ?
        " AND documents_user_uploaded.active_2v_user_uploaded_documents = true" : ""

    const only_doc_type = JSON.parse(event.body).only_doc_type ?
        " AND documents_master_names.document_name = '" + JSON.parse(event.body).only_doc_type + "'" : ""

    var data = await db.custom(`  
        SELECT * from documents_user_uploaded
        LEFT JOIN documents_master_names ON documents_master_names.id_2v_master_document_names = documents_user_uploaded.id_2v_master_document_names 
        where id_user = ${id_user} ${only_active} ${only_doc_type}
        
 `);

    if (only_doc_type && only_active) {
        data = data[0]
    }
    return await data
}