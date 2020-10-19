const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');
const DB = require('./db/employeedb');


const addPrompts = (obj) => {
    return inquirer.prompt(obj)
        .then(responses => {
            return responses;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

const mainMenu = (db) => {
    console.log(`
    ------------Main Menu------------
    `);
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'update an employee manager',
                'exit application'
            ]
        }
    ])
    .then(async result => {
        // Determine which menu item was selected
        console.log(`
        ------------${result.menu}------------
        `);
        if(result.menu === 'view all departments') {
            const returned = await db.viewAllDepartments();
            console.table(returned[0]);
        } else if (result.menu === 'view all roles') {
            const returned = await db.viewAllRoles();
            console.table(returned[0]);
        } else if (result.menu === 'view all employees') {
            const returned = await db.viewAllEmployees();
            console.table(returned[0]);
        } else if (result.menu === 'add a department') {
            const questions = {
                type: 'input',
                name: 'department',
                message: 'What is the new department name?'
            };
            const result = await addPrompts(questions);

            if(result) {
                const returned = await db.addDepartment(result.department);
                console.log(`${result.department} has been added as a new department!`);
            }
        } else if (result.menu === 'add a role') {
            const departments = await db.viewAllDepartments();
            let names = departments[0].map(row => {
                return {name: row.name, value: row.id};
            });

            const questions = [
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the role name?'
                    }, 
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the salary?'
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'What department does this role belong to?',
                        choices: names
                    }
                ];
            
            const result = await addPrompts(questions);

            if(result) {
                const returned = await db.addRole(result);
                console.log('New role added!');
            }

        } else if (result.menu === 'add an employee') {
            const employees = await db.viewAllEmployees();
            const managers = employees[0].map(row => {
                return {name: row.first_name + " " + row.last_name, value: row.id};
            });
            const roles = await db.viewAllRoles();
            const roleNames = roles[0].map(row => {
                return {name: row.title, value: row.id};
            });

            const questions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'First name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Last name:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select a role:',
                    choices: roleNames
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select a manager:',
                    choices: managers
                }
            ];

            const result = await addPrompts(questions);
            
            if(result) {
                const returned = await db.addEmployee(result);
                console.log('New employee added!');
            }


        } else if (result.menu === 'update an employee role') {
            const employees = await db.viewAllEmployees();
            const employeeList = employees[0].map(row => {return {name: row.first_name + " " + row.last_name, value: row.id};});
            const roles = await db.viewAllRoles();
            const roleList = roles[0].map(row => {return {name: row.title, value: row.id}});

            const questions = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select an employee:',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select a new role:',
                    choices: roleList
                }
            ];

            const result = await addPrompts(questions);

            if (result) {
                const returned = await db.updateEmployeeRole(result);
                console.log('Employee role updated!');
            }

        } else if (result.menu === 'update an employee manager') {
            const employees = await db.viewAllEmployees();
            const employeeList = employees[0].map(row => {return {name: row.first_name + " " + row.last_name, value: row.id};});
            
            const employee = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select an employee:',
                    choices: employeeList
                },
            ];

            const result1 = await addPrompts(employee);
            console.log(result1);

            let managerList = employees[0].filter(row => result1.id !== parseInt(row.id));

            let managers = managerList.map(row => {
                return {name: row.first_name + " " + row.last_name, value: row.id};
            });

            const manager = [
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select new manager:',
                    choices: managers,
                }
            ];

            
            const result2 = await addPrompts(manager);

            console.log(result1);
            console.log(result2);


        } else if (result.menu === 'exit application') {
            closeDb(db);
            return false;
        } else {
            console.log('Error! The system could not process your request.')
        }
        return true;
    })
    .then(result => {
        if(result) {
            mainMenu(db);
        } else {
            return;
        }
        
    })
    .catch();
};


// Open db connection and go to main menu
const initiateApp = () => {
    const db = new DB(connection);
    mainMenu(db);
}

// Close connection to db
const closeDb = (db) => {
    db.endConnection();
};

// Initiate the program
initiateApp();