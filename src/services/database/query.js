const connection = require("./connect");

async function reset_increment_by_table_name(table, console_log_query, console_log_result) {
    const query = `ALTER TABLE ${table} AUTO_INCREMENT = 1 ;`
    const result = await new Promise(function (resolve, reject) {
        connection.query(
            query,
            function (err, rows) {
                if (err) {
                    console.log("${}db error: ", err)
                }
                if (rows === undefined) {
                    reject("Custom Server Error");
                } else {
                    resolve(rows);
                }
            }
        )
    })
    if (console_log_query) {
        console.log("query: ", await query)
    }
    if (console_log_result) {
        console.log("result: ", await result)
    }
    await connection.end();
    return await result
}

module.exports = {


    /*  reset_increment_by_table_name: async (table) => {
          this.custom(`  
          ALTER TABLE ${table} AUTO_INCREMENT = 1 ;
  `);
      },*/



    custom: async (query, console_log_query, console_log_result) => {
        //await reset_increment_by_table_name(table)// need to implement this


        const result = await new Promise(function (resolve, reject) {
            connection.query(
                query,
                function (err, rows) {
                    if (err) {
                        console.log("db error: ", err)
                    }
                    if (rows === undefined) {
                        reject("Custom Server Error");
                    } else {
                        resolve(rows);
                    }
                }
            )
        })



        if (console_log_query) {
            console.log("query: ", await query)
        }
        if (console_log_result) {
            console.log("result: ", await result)
        }
        await connection.end();
        /*
                const result = await connection.query(query, function (err, rows) {
                    if (err) {
                        console.log('this.sql', this.sql); //command/query
                        console.log(command);
                        console.log("ERROR");
                        console.log(err);
                        return;
                    }
                    console.log("good")
                    return rows
                    console.log("good", this.sql);
                    //      console.log("rows: ",rows)
                });
        console.log("gggggggggggggggg")
                console.log("fffffffffff", await result)
                await connection.end();
        */
        /*  let result = await connection.query(query);
          await connection.end();
          return result;
  */
        return await result

    },

    search_one: async (table, column, data) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [data]);
        await connection.end();
        return result;
    },

    select_columns_with_condictions: async (columns, table, column, data) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} = ?`,
            [data]
        );
        await connection.end();
        return result;
    },

    /**
     * @desc Returns one record from a table by condition
     * @query SELECT * FROM table WHERE condition
     */
    select_one: async (table, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT * FROM ${table} WHERE ?`, [condition]);
        await connection.end();
        return result;
    },

    select_one_with_2conditions: async (table, condition1, condition2) => {
        await reset_increment_by_table_name(table)//TODO: change this to accept con1 and con2 in a sible object
        let result = await connection.query(`SELECT * FROM ${table} WHERE ? AND ?`, [
            condition1,
            condition2,
        ]);
        await connection.end();
        return result;
    },

    select_all_from_join2_with_2conditions: async (
        table1,
        table2,
        joint1,
        condition1,
        condition2
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ? OR ?`,
            [condition1, condition2]
        );
        await connection.end();
        return result;
    },
    select_all_from_join_with_2conditions: async (
        table1,
        table2,
        joint1,
        condition1,
        condition2
    ) => {
        await reset_increment_by_table_name(table)


        console.log("quuu: ", `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ? AND ?`,
            [condition1, condition2])
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ? AND ?`,
            [condition1, condition2]
        );
        await connection.end();
        return result;
    },

    select_one_from_join3_with_2conditions: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        condition1
        // condition2
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2}=${table3}.${joint2} WHERE ${table1}.${joint1}=${condition1}`
        );
        await connection.end();
        return result;
    },

    select_all: async (table) => {
        await reset_increment_by_table_name(table)
        //  console.log("fffffffdddddddddd",await connection.getClient())
        let result = await connection.query(`SELECT * FROM ${table}`);
        await connection.end();
        return result;
    },

    select_many: async (table, columns) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT ${columns.join(", ")} FROM ${table}`);
        await connection.end();
        return result;
    },

    select_many_from_join_with_condition: async (table1, table2, joint, columns, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(
                ", "
            )} FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_from_join_custom_joint: async (table1, table2, joint) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${joint}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join: async (table1, table2, joint) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join3: async (table1, table2, table3, joint1, joint2) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join_with_condition: async (table1, table2, joint, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },
    aaron_select_all_from_join_with_condition: async (
        table1,
        table2,
        joint,
        condition1,
        condition2
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ${condition1} = ${condition2}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join3_with_condition: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        condition
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join3_with_2condition: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        condition1,
        condition2
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table2}.${joint2} = ${table3}.${joint2} WHERE ? AND ?`,
            [condition1, condition2]
        );
        await connection.end();
        return result;
    },

    select_all_from_join2_with_condition: async (table1, table2, joint1, condition, order_by) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ${table2}.${joint1} < ? ORDER BY ${order_by}`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join2_with_condition_order: async (table1, table2, joint1, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_from_join3_with_condition_and_order: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        condition,
        order_by
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} WHERE ? ORDER BY ${order_by} DESC`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_from_join4: async (table1, table2, table3, table4, joint1, joint2, joint3) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join4_with_conditions: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition1,
        condition2
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3} WHERE ${condition1} AND ${condition2}`
        );
        await connection.end();
        return result;
    },
    select_all_from_join4_with_condition: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join4_with_conditionB: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table3}.${joint3} = ${table4}.${joint3} WHERE ?`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join4_with_conditionB_and_order: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition,
        order_by,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table3}.${joint3} = ${table4}.${joint3} WHERE ? ORDER BY ${order_by} ${dir}`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join5_with_conditionB_and_order: async (
        table1,
        table2,
        table3,
        table4,
        table5,
        joint1,
        joint2,
        joint3,
        joint4,
        condition,
        order_by,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table3}.${joint3} = ${table4}.${joint3} JOIN ${table5} ON ${table2}.${joint4} = ${table5}.${joint4} WHERE ? ORDER BY ${order_by} ${dir}`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_from_join4_with_conditions_and_order: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition1,
        condition2,
        order_by,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3} WHERE ${condition1} AND ${condition2} ORDER BY ${order_by} ${dir}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join4_with_condition_order_and_limit: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition1,
        condition2,
        order_by,
        lim,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3} WHERE ${condition1} AND ${condition2} ORDER BY ${order_by} ${dir} LIMIT ${lim}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join4_with_condition_and_orderB: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition,
        order_by,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table3}.${joint3} = ${table4}.${joint3} WHERE ? ORDER BY ${table2}.${order_by} ${dir}`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_from_join4_with_conditions_and_order_and_limit: async (
        table1,
        table2,
        table3,
        table4,
        joint1,
        joint2,
        joint3,
        condition1,
        condition2,
        order_by,
        lim,
        dir
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} JOIN ${table4} ON ${table2}.${joint3} = ${table4}.${joint3} WHERE ${condition1} AND ${condition2} ORDER BY ${order_by} ${dir} LIMIT ${lim}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join3: async (table1, table2, table3, joint1, joint2) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2}`
        );
        await connection.end();
        return result;
    },

    select_all_from_join_with_regex: async (table1, table2, joint, target, regex) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ${target} REGEXP ?`,
            [regex]
        );
        await connection.end();
        return result;
    },

    select_all_from_join3_with_regex: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        target,
        regex
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} WHERE ${target} REGEXP ?`,
            [regex]
        );
        await connection.end();
        return result;
    },

    select_all_from_join_with_condition_and_regex: async (
        table1,
        table2,
        joint,
        condition,
        target,
        regex
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ? AND ${target} REGEXP ?`,
            [condition, regex]
        );
        await connection.end();
        return result;
    },

    select_all_from_join3_with_condition_and_regex: async (
        table1,
        table2,
        table3,
        joint1,
        joint2,
        condition,
        target,
        regex
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} WHERE ? AND ${target} REGEXP ?`,
            [condition, regex]
        );
        await connection.end();
        return result;
    },

    select_many_from_join_with_condition_and_regex: async (
        table1,
        table2,
        joint,
        columns,
        condition,
        target,
        regex
    ) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(
                ", "
            )} FROM ${table1} JOIN ${table2} ON ${table1}.${joint} = ${table2}.${joint} WHERE ? AND ${target} REGEXP ?`,
            [condition, regex]
        );
        await connection.end();
        return result;
    },

    select_all_with_condition: async (table, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT * FROM ${table} WHERE ?`, [condition]);
        await connection.end();
        return result;
    },

    aaron_select_all_with_condition: async (table, condition) => {
        await reset_increment_by_table_name(table)
        console.log("a string: ", `SELECT * FROM ${table} WHERE `, condition);
        const a = `SELECT * FROM ${table} WHERE ` + condition;
        let result = await connection.query(a);
        await connection.end();
        return result;
    },

    select_one_with_condition: async (table, column, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${column} FROM ${table} WHERE ? ORDER BY ${column}`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_many_with_condition: async (table, columns, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(", ")} FROM ${table} WHERE ? ORDER BY ${columns[0]}`,
            [condition]
        );
        await connection.end();
        return result;
    },

    /**
     * @desc Returns one column from a table with condition and orders
     * @query SELECT target FROM table WHERE condition ORDER BY order_by dir
     */
    select_one_with_condition_and_order: async (table, target, condition, order_by, dir) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${target} FROM ${table} WHERE ? ORDER BY ${order_by} ${dir}`,
            [condition]
        );
        await connection.end();
        return result;
    },
    select_all_with_condition_and_order: async (table, column, condition, dir) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ? ORDER BY ${column} ${dir}`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_with_condition_order_and_limit: async (table, column, condition, lim, dir) => {
        await reset_increment_by_table_name(table)
        console.log(table, column, dir, lim, condition);
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ? ORDER BY ${column} ${dir} LIMIT ${lim}`,
            [condition]
        );
        await connection.end();
        return result;
    },

    select_all_and_order: async (table, column, dir) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT * FROM ${table} ORDER BY ${column} ${dir}`);
        await connection.end();
        return result;
    },

    select_and_limit: async (table, column, index, lim) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ${column} > ${index} ORDER BY ${column} LIMIT ${lim}`
        );
        await connection.end();
        return result;
    },

    select_with_condition_and_limit: async (table, column, condition, index, lim) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ? AND ${column} > ? ORDER BY ${column} LIMIT ?`,
            [condition, index, lim]
        );
        await connection.end();
        return result;
    },

    select_one_with_condition_and_limit: async (table, column, condition, index, lim) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${column} FROM ${table} WHERE ? AND ${column} > ? ORDER BY ${column} LIMIT ?`,
            [condition, index, lim]
        );
        await connection.end();
        return result;
    },

    select_many_with_condition_and_limit: async (table, columns, condition, index, lim) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(", ")} FROM ${table} WHERE ? AND ${columns[0]} > ? ORDER BY ${columns[1]
            } LIMIT ?`,
            [condition, index, lim]
        );
        await connection.end();
        return result;
    },

    search_get_one_column: async (table, column) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT ${column} FROM ${table}`);
        await connection.end();
        return result;
    },
    search_two: async (table, column_one, column_two, data1, data2) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ${column_one} = ? AND ${column_two} = ?`,
            [data1, data2]
        );
        await connection.end();
        return result;
    },

    search_two_Or: async (table, column_one, column_two, data1, data2) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ${column_one} = ? OR ${column_two} = ?`,

            [data1, data2]
        );
        await connection.end();
        return result;
    },

    select_oneColumn: async (table, column1, column2, data) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${column1} FROM ${table} WHERE ${column2} = ?`,
            [data]
        );

        await connection.end();
        return result;
    },

    select_with_regex: async (table, column, data) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT * FROM ${table} WHERE ${column} REGEXP ?`, [
            data,
        ]);
        await connection.end();
        return result;
    },

    select_with_regex_and_limit: async (table, sort, target, regex, limit) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT * FROM ${table} WHERE ${target} REGEXP ? AND ${sort} > ? LIMIT ?`,
            [regex, sort, limit]
        );
        await connection.end();
        return result;
    },

    select_many_with_regex_and_limit: async (table, columns, target, regex, limit) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${columns.join(", ")} FROM ${table} WHERE ${target} REGEXP ? AND ${columns[0]
            } > ? LIMIT ?`,
            [regex, limit]
        );
        await connection.end();
        return result;
    },

    select_one_with_condition_regex_and_limit: async (
        table,
        target,
        condition,
        column,
        regex,
        index,
        lim
    ) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(
            `SELECT ${target} FROM ${table} WHERE ? AND ${column} REGEXP ? AND ${target} > ? ORDER BY ${target} LIMIT ?`,
            [condition, regex, index, lim]
        );

        await connection.end();
        return result;
    },

    select_one_with_regex_and_limit: async (table, target, column, regex) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(
            `SELECT ${target} FROM ${table} WHERE ${column} REGEXP ?`,
            [regex]
        );

        await connection.end();
        return result;
    },

    select_sum_of_1column_1condition: async (table, column, condition) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(`SELECT sum(${column}) AS total FROM ${table} WHERE?`, [
            condition,
        ]);
        await connection.end();
        return result;
    },

    insert_new: async (data, table) => {

        await reset_increment_by_table_name(table)
        const result = await connection.query(`INSERT INTO ${table} SET ?`, data);
        await connection.end();
        return result;
    },

    search_get_one_column_oncondition: async (table, column1, column2, data) => {
        await reset_increment_by_table_name(table)
        let result = await connection.query(
            `SELECT ${column1} FROM ${table} WHERE ${column2} = ?`,
            [data]
        );
        await connection.end();
        return result;
    },

    delete_all: async (table) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`DELETE FROM ${table}`);
        await connection.end();
        return result;
    },
    delete_one: async (table, column, data) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`DELETE FROM ${table} WHERE ${column} = ?`, data);
        await connection.end();
        return result;
    },

    delete_with_condition: async (table, condition) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`DELETE FROM ${table} WHERE ?`, condition);
        await connection.end();
        return result;
    },

    update_one: async (table, updated_data, column, condition) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`UPDATE ${table} SET ? WHERE ${column} = ?`, [
            updated_data,
            condition,
        ]);
        await connection.end();
        return result;
    },

    /**
     * @desc Updates one record in a table by condition
     * @query UPDATE table SET update WHERE condition
     * @usage await db.update_with_condition(table: string, update: object, condition: object)
     */
    update_with_condition: async (table, update, condition) => {
        await reset_increment_by_table_name(table)
        // const result = await connection.query(`UPDATE products_m2m_vendors SET p2v_price= '99' WHERE id_product_m2m_vendor = 302`)
        const result = await connection.query(`UPDATE ${table} SET ? WHERE ?`, [update, condition]);
        await connection.end();
        return result;
    },

    insert_many: async (values, columns, table) => {
        await reset_increment_by_table_name(table)
        let attr;
        if (columns.length === 1) {
            attr = columns.join();
        }
        if (columns.length > 1) {
            attr = columns.join(", ");
        }
        const result = await connection.query(`INSERT INTO ${table} (${attr}) VALUES ?`, [values]);
        await connection.end();
        return result;
    },

    join_two_tables: async (tableOne, tableTwo, condition, columns) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(
            `SELECT ${columns.join(
                ", "
            )} FROM ${tableOne} JOIN ${tableTwo} ON ${tableOne}.${condition}=${tableTwo}.${condition}`
        );
        await connection.end();
        return result;
    },

    insert_new_on_condition: async (data, table, column) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`INSERT INTO ${table} SET ? WHERE ${column} =?`, data);
        await connection.end();
        return result;
    },

    select_one_with_condition_regex: async (table, target, condition, column, regex) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(
            `SELECT ${target} FROM ${table} WHERE ? AND ${column} REGEXP ? ORDER BY ${target}`,
            [condition, regex]
        );
        await connection.end();
        return result;
    },

    check_connections: async (user, COMMAND) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(
            `SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST WHERE ? AND ?`,
            [user, COMMAND]
        );
        await connection.end();
        return result;
    },

    kill_connections: async (ID) => {
        await reset_increment_by_table_name(table)
        const result = await connection.query(`KILL ${ID}`);
        await connection.end();
        return result;
    },
};
