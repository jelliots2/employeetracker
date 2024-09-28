import pg from 'pg';
const { Client } = pg;
import inquirer from 'inquirer';
import dotenv from 'dotenv';
dotenv.config();
console.log("Starting Employee Tracker Application...");
// Create a new client instance
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
});
// Connect to the database
async function connectDB() {
    await client.connect();
}
// Main menu function
async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View Employees',
                'View Roles',
                'View Departments',
                'Delete Employee',
                'Delete Role',
                'Delete Department',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Exit'
            ],
        },
    ]);
    switch (action) {
        case 'View Employees':
            await viewEmployees();
            break;
        case 'View Roles':
            await viewRoles();
            break;
        case 'View Departments':
            await viewDepartments();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        case 'Delete Role':
            await deleteRole();
            break;
        case 'Delete Department':
            await deleteDepartment();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Exit':
            console.log('Goodbye!');
            return;
    }
    // Call the main menu again after an action
    await mainMenu();
}
// Function to add an employee
// Function to add an employee with validation for role and manager
async function addEmployee() {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the employee\'s role ID:',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the employee\'s manager ID (or leave blank):',
        },
    ]);
    // Validate roleId
    const roleCheck = await client.query('SELECT id FROM role WHERE id = $1', [roleId]);
    if (roleCheck.rows.length === 0) {
        console.log(`Role ID ${roleId} does not exist. Please enter a valid role ID.`);
        return;
    }
    // Validate managerId if provided
    if (managerId) {
        const managerCheck = await client.query('SELECT id FROM employee WHERE id = $1', [managerId]);
        if (managerCheck.rows.length === 0) {
            console.log(`Manager ID ${managerId} does not exist. Please enter a valid manager ID.`);
            return;
        }
    }
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId || null]);
    console.log(`Employee ${firstName} ${lastName} added.`);
}
// Function to add a role
async function addRole() {
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for this role:',
        },
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    console.log(`Role ${title} added.`);
}
// Function to add a department
async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:',
        },
    ]);
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department ${name} added.`);
}
// Function to view employees with their roles, departments, salaries, and managers
async function viewEmployees() {
    const res = await client.query(`
    SELECT 
      e.id,
      e.first_name AS "First Name",
      e.last_name AS "Last Name",
      r.title AS "Role",
      d.name AS "Department",
      r.salary AS "Salary",
      CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
    FROM 
      employee e
    JOIN 
      role r ON e.role_id = r.id
    JOIN 
      department d ON r.department_id = d.id
    LEFT JOIN 
      employee m ON e.manager_id = m.id
  `);
    console.table(res.rows);
}
// Function to view roles
async function viewRoles() {
    const res = await client.query('SELECT * FROM role');
    console.table(res.rows);
}
// Function to view departments
async function viewDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}
// Function to delete an employee
async function deleteEmployee() {
    const { id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the employee to delete:',
        },
    ]);
    await client.query('DELETE FROM employee WHERE id = $1', [id]);
    console.log(`Employee with ID ${id} deleted.`);
}
// Function to delete a role
async function deleteRole() {
    const { id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the role to delete:',
        },
    ]);
    await client.query('DELETE FROM role WHERE id = $1', [id]);
    console.log(`Role with ID ${id} deleted.`);
}
// Function to delete a department
async function deleteDepartment() {
    const { id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the department to delete:',
        },
    ]);
    await client.query('DELETE FROM department WHERE id = $1', [id]);
    console.log(`Department with ID ${id} deleted.`);
}
// Modified startApp function
async function startApp() {
    try {
        await connectDB();
        await mainMenu();
    }
    catch (err) {
        console.error(err.message); // Type assertion to Error
    }
    finally {
        await client.end();
    }
}
// Call startApp to initiate the application
startApp();
console.log("App initialization complete. Ready for input.");
