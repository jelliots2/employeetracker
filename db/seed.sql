-- Insert departments
INSERT INTO department (name)
VALUES 
  ('Engineering'),
  ('Human Resources'),
  ('Finance'),
  ('Marketing');
ON CONFLICT (id) DO NOTHING;

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES 
  ('Software Engineer', 85000, 1),
  ('HR Manager', 70000, 2),
  ('Financial Analyst', 65000, 3),
  ('Marketing Coordinator', 60000, 4);
ON CONFLICT (id) DO NOTHING;

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, NULL),
  ('Robert', 'Brown', 3, 2),
  ('Emily', 'Davis', 4, NULL);
ON CONFLICT (id) DO NOTHING;