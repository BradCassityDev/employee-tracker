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
                'exit application'
            ]
        }
    ])
    .then(async result => {
        // Determine which menu item was selected
        console.log(`------------${result.menu}------------`);
        if(result.menu === 'view all departments') {
            const returned = await db.viewAllDepartments();
            console.log(returned[0]);
        } else if (result.menu === 'view all roles') {
            const returned = await db.viewAllRoles();
            console.log(returned[0]);
        } else if (result.menu === 'view all employees') {
            const returned = await db.viewAllEmployees();
            console.log(returned[0]);
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
            let names =[];
            departments[0].forEach(row => {
                names.push(row.name);
            });

            console.log(names);
            const questions = [
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is the role name?'
                    }, 
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the salary?'
                    },
                    {
                        type: 'list',
                        name: 'department_name',
                        message: 'What department does this role belong to?',
                        choices: names
                    }
                ];
            
            const result = await addPrompts(questions);
            const deptId = await db.findDeptByName(result.department_name);

            result.selectedDeptId = deptId[0][0].id;
            console.log(result);

            if(result) {
                const returned = await db.addRole(result);
                console.log('New role added!');
            }

        } else if (result.menu === 'add an employee') {

        } else if (result.menu === 'update an employee role') {

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