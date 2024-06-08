

const handler = require("../../../services/middlewareReturn");
const connection = require('../../../services/database/connect');
const { ensureUserLoggedIn } = require("../../accessControls/auth");

module.exports.accessAdminjobPostManageDocument = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {
            let { id } = event.pathParameters;

            const documentType = await connection.query(`
            SELECT dmn.*,
            dcp.*,
            cmt.*,
            cmd.*
               FROM devproduct.documents_master_names AS dmn
            LEFT  JOIN devproduct.documents_company_provided AS dcp
              ON dmn.id_2v_master_document_names = dcp.id_2v_master_documents
               -- Left join with the company_master_title table
              LEFT JOIN devproduct.company_master_title AS cmt
              ON dmn.requiredForTitle = cmt.id_master_title
              -- Left join with the company_master_department table
              LEFT JOIN devproduct.company_master_department AS cmd
              ON cmt.id_department_master = cmd.id_department_master
              WHERE dmn.id_2v_master_document_names = ${id} AND dcp.active = 1 OR dcp.active IS NULL and dmn.id_2v_master_document_names = ${id}
               `);

            /* const documentType = await connection.query(`
            SELECT *
            FROM devproduct.documents_master_names AS dmn
            JOIN devproduct.documents_company_provided AS dcp
            ON dmn.id_2v_master_document_names = dcp.id_2v_master_documents
            where dmn.id_2v_master_document_names = ${id} And dcp.active = 1
            `);*/


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
                documentType: documentType[0],
                titles,
                deps
            }], 'Get accessAdminjobPostEditDocument', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    });
};



module.exports.accessAdminjobPostEditDocument = async (event) => {
    return await ensureUserLoggedIn(event, async () => {
        try {

            let { id } = event.pathParameters;
            
            const data = JSON.parse(event.body)
            console.log("FFFFFFFFFFFFFf",data)
            const pdfFile = data.pdfFile
            delete data.pdfFile
            delete data.auth



            if (data.requiredFor == "required_for_apply") {
                data.required_for_apply = true;
                data.required_for_onboard = false;
                data.required_for_post_onboard = false;
            }
            if (data.requiredFor == "required_for_onboard") {
                data.required_for_apply = false;

                data.required_for_onboard = true;
                data.required_for_post_onboard = false;

            }
            if (data.requiredFor == "required_for_post_onboard") {
                data.required_for_apply = false;

                data.required_for_onboard = false;

                data.required_for_post_onboard = true;
            }
            delete data.requiredFor

            if (data.requiredForTitle == '' || !data.requiredForTitle) {
                data.requiredForTitle = null
            }


            if (data.company_provided == 0) {
                data.requiresSigning = 0
            }

            //console.log("result: ", data)


            sql = `update  documents_master_names SET ? where id_2v_master_document_names = ${id}`;
            const result = await connection.query(sql, data);
            /* if (documents_company_provided_url != "" && documents_company_provided_url != undefined) {
                 sql = `INSERT INTO documents_company_provided SET ?`;
                 await connection.query(sql, {
                     documents_company_provided_url,
                     id_2v_master_documents: result.insertId
                 });
             }*/


            //   const sql = `Update  users SET ? where id_user = ${updatingUserId}`
            //  const result = await connection.query(sql, newData);

            await connection.end();

            return handler.returner([true, {

            }], 'Get accessAdminjobPostEditDocument', 200);
        } catch (error) {
            console.log(error);
            await connection.end();
            return handler.returner([false, ''], 'Internal server error.', 500);
        }
    });
};