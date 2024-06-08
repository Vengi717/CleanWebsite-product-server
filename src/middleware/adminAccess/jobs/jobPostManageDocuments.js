


const handler = require("../../../services/middlewareReturn");
const connection = require('../../../services/database/connect');
const { ensureUserLoggedIn } = require("../../accessControls/auth");



module.exports.accessAdminjobPostManageDocuments = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            // Query all documents from the database
            const allDocuments = await connection.query(`
                SELECT * FROM documents_master_names;
            `);

            // Separate the documents into company-provided and user-provided
            const companyProvidedDocuments = allDocuments.filter((item) => item.company_provided === 1);
            const userProvidedDocuments = allDocuments.filter((item) => item.company_provided === 0);

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

            return handler.returner([true, {
                documentNames: allDocuments,
                titles,
                deps
            }], 'Get accessAdminjobPostManageDocuments', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    });
};


module.exports.createDocument = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            var data = JSON.parse(event.body)
            delete data.auth
            const documents_company_provided_url = data.documents_company_provided_url
            delete data.documents_company_provided_url
            console.log("requiresSigningrequiresSigning: ", data)
            if (data.requiredFor == "required_for_apply") {
                data.required_for_apply = true;
            }
            if (data.requiredFor == "required_for_onboard") {
                data.required_for_onboard = true;
            }
            if (data.requiredFor == "required_for_post_onboard") {
                data.required_for_post_onboard = true;
            }
            delete data.requiredFor


            sql = `INSERT INTO documents_master_names SET ?`;
            const result = await connection.query(sql, data);

            if (documents_company_provided_url != "" && documents_company_provided_url != undefined) {
                sql = `INSERT INTO documents_company_provided SET ?`;
                await connection.query(sql, {
                    documents_company_provided_url,
                    id_2v_master_documents: result.insertId
                });
            }




            await connection.end();
            return handler.returner([true, {

            }], 'Create Document Type', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    });
};