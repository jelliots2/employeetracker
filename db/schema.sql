DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS department CASCADE;

-- department table
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- role table
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  CONSTRAINT fk_department
    FOREIGN KEY(department_id)
    REFERENCES department(id)
    ON DELETE CASCADE -- Change to CASCADE if you want to delete roles when the department is deleted
);

-- employee table
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  CONSTRAINT fk_role
    FOREIGN KEY(role_id)
    REFERENCES role(id)
    ON DELETE CASCADE, -- This will remove employees if the role is deleted
  CONSTRAINT fk_manager
    FOREIGN KEY(manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL -- Set manager_id to NULL if the manager is deleted
);
