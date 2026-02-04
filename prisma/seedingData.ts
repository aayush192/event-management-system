export const role: string[] = ["admin", "organizer", "user"];

export const adminData = {
  name: "aayush",
  email: "ayush@gmail.com",
  password: "password",
  role: "admin",
};

interface OpModel {
  roleId: string;
  model: string;
  operation: string;
}
