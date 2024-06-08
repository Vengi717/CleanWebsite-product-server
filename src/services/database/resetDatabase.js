const db = require("./query");
const connection = require("./connect");


async function main() {
    const users_family_info = await db.custom(
        `
        truncate users_family_info;
        INSERT INTO users_family_info (name, relationship, DOB, phone, id_user)
        VALUES ("Bob", "Brother", "10/10/1800", "0450505050", 1);
        INSERT INTO users_family_info (name, relationship, DOB, phone, id_user)
        VALUES ("Jim", "Uncle", "10/10/1900", "04626262645", 1);


truncate users_experience;
INSERT INTO users_experience (name_of_providor, position, start, end, address, id_user)
        VALUES ("Apple", "Intern", "10/10/1900", "7/12/2017", "52 fake street",1);
        INSERT INTO users_experience (name_of_providor, position, start, end, address, id_user)
        VALUES ("Tesla", "Manager", "10/10/1800", "7/12/2019", "21 Fast Car Street",1);







        truncate users_education;
        INSERT INTO users_education (name_of_providor, course, start, end, address, id_user)
                VALUES ("Collage of Australia", "Business", "10/10/1900", "7/12/2017", "123 fake street",1);
          

                /// conflict here
                INSERT INTO users (first_name, last_name,email, password, joining_date, phone, active,roll_id,created_by,updated_by,id_master_title,is_tm,img_url)
                VALUES ("Giovanna","Gambino", "gg@gmail.com","$2a$10$np8IaYu8Xxfw.Xr8V4qsmOfhixeNi4eyXes8e8aZ49/g2I1L2SXfe", "2021-11-12 22:28:48", "0452 525 555",1,1,1,1,1,0,"Giovanna_photo.png?alt=media&token=08167a3a-523d-42e4-bd04-1384a57de59e");



                truncate  company_master_title;
                INSERT INTO company_master_department (title_name, id_department_master,created_at, created_by, updated_at, updated_by, active)
                VALUES ("CEO",1, "1969-12-31 23:00:01",1, "2021-11-12 22:28:48", 1,1);


                truncate  company_master_department;
                INSERT INTO company_master_department (department_name, created_at, created_by, updated_at, updated_by, active)
                VALUES ("C Suite", "1969-12-31 23:00:01",1, "2021-11-12 22:28:48", 1,1);
                INSERT INTO company_master_department (department_name, created_at, created_by, updated_at, updated_by, active)
                VALUES ("Non Team Members", "1969-12-31 23:00:01",1, "2021-11-12 22:28:48", 1,1);

        `
    )
    await connection.end()
    console.log(users_family_info)
}
main()

