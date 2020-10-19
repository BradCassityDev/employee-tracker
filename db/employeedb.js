const mysql = require('mysql2');
//const mysql = require('mysql2/promise');
const dbConfig = require('../db/connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    // view all departments (name and id)
    viewAllDepartments() {
        const sql = `SELECT * FROM department`;
        return this.connection.promise().query(sql);
    }

    // return department names
    findDeptByName(name) {
        const sql = `SELECT id FROM department WHERE name = ?`;
        const params = [name];
        const result = this.connection.promise().query(sql, params);

        return result;
    }

    // view all roles (job title, role id, department name, and salary)
    viewAllRoles() {
        return this.connection.promise()
                .query(`SELECT title, role.id, department.name AS Department, salary FROM role
                        LEFT JOIN department ON role.department_id = department.id`);
    }

    // view all employees (id, first name, last name, job title, department, salary, and manager)
    viewAllEmployees() {
        return this.connection.promise()
                .query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ",  manager.last_name) AS manager 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
    }

    // Add department
    addDepartment(departmentName) {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [departmentName];
        const result = this.connection.promise().query(
            sql,
            params,
            function(err, res) {
              if (err) throw err;
            }
          );
          
        return result;
    }

    // Add role
    addRole(role) {
        const sql = `INSERT INTO role SET ?`;
        const params = {
            title: role.name,
            salary: role.salary,
            department_id: role.selectedDeptId
        };
        return this.connection.promise().query(sql, params);
    }


    employees() {
        return this.connection.promise().query('SELECT * FROM employee');
    }

    // End connection
    endConnection() {
        this.connection.end();
    }
}

module.exports = DB;