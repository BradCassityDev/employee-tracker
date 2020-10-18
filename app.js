const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');
const DB = require('./db/employeedb');


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

        } else if (result.menu === 'add a role') {

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



const initiateApp = () => {
    const db = new DB(connection);
    mainMenu(db);
    
}

// Close connection to db
const closeDb = (db) => {
    db.endConnection();
};

initiateApp();

