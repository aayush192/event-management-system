export const role: string[] = ["admin", "organizer", "user"];

export const admin = {
  name: "admin",
  email: "ayush@gmail.com",
  password: "password",
  roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
};

export const operation: string[] = [
  "get:approved",
  "get:self",
  "get:selfOrganized",
  "get:All",
  "post",
  "update:self",
  "update:All",
  "delete:self",
  "delete:All",
];
export const model: string[] = [
  "event",
  "operation",
  "registration",
  "role",
  "user",
  "OperationToRole",
];
interface OpModel{
  roleId: string;
  model: string;
  operation: string;
}

export const opModel: OpModel[] = [
  // roleId 1
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "get:approved",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "get:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "get:selfOrganized",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "get:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "post",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "update:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "update:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "delete:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "event",
    operation: "delete:All",
  },
//mode operation user admin
 
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "operation",
    operation: "get:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "operation",
    operation: "post",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "operation",
    operation: "update:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "operation",
    operation: "delete:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "get:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "get:selfOrganized",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "get:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "post",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "update:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "update:All",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "delete:self",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "registration",
    operation: "delete:All",
  },

  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "get:one",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "getAll",
  },
  {
    roleId: " dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "post",
  },
  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "update:self",
  },
  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "update:All",
  },
  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "delete:one",
  },
  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "role",
    operation: "delete:All",
  },

  {
    roleId: "dd39c967-b972-4fc8-b576-3642bd03de48",
    model: "user",
    operation: "get:one",
  },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "get:self" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "get:some" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "getAll" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "post" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "update:self" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "update:All" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "delete:one" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "delete:self" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "user", operation: "delete:All" },

  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "get:one" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "get:some" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "getAll" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "post" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "update:All" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "delete:one" },
  { roleId: " dd39c967-b972-4fc8-b576-3642bd03de48", model: "OperationToRole", operation: "delete:All" },

  // organizer (same pattern)
 
  { roleId: " role", model: "event", operation: "get:self" },
  { roleId: " role", model: "event", operation: "get:approved" },
  { roleId: " role", model: "event", operation: "post" },
  { roleId: " role", model: "event", operation: "update:self" },
  { roleId: " role", model: "event", operation: "delete:self" },

 
  { roleId: " role", model: "registration", operation: "get:self" },
  { roleId: " role", model: "registration", operation: "post" },
  { roleId: " role", model: "registration", operation: "update:self" },
  { roleId: " role", model: "registration", operation: "delete:self" },


  { roleId: " role", model: "user", operation: "get:self" },
  { roleId: " role", model: "user", operation: "update:self" },



  //role3


  { roleId: " role", model: "operation", operation: "get:one" },
  { roleId: " role", model: "operation", operation: "get:self" },
  { roleId: " role", model: "operation", operation: "get:some" },
  { roleId: " role", model: "operation", operation: "getAll" },
  { roleId: " role", model: "operation", operation: "post" },
  { roleId: " role", model: "operation", operation: "update:self" },
  { roleId: " role", model: "operation", operation: "update:All" },
  { roleId: " role", model: "operation", operation: "delete:one" },
  { roleId: " role", model: "operation", operation: "delete:self" },
  { roleId: " role", model: "operation", operation: "delete:some" },
  { roleId: " role", model: "operation", operation: "delete:All" },

  { roleId: " role", model: "registration", operation: "get:one" },
  { roleId: " role", model: "registration", operation: "get:self" },
  { roleId: " role", model: "registration", operation: "get:some" },
  { roleId: " role", model: "registration", operation: "getAll" },
  { roleId: " role", model: "registration", operation: "post" },
  { roleId: " role", model: "registration", operation: "update:self" },
  { roleId: " role", model: "registration", operation: "update:All" },
  { roleId: " role", model: "registration", operation: "delete:one" },
  { roleId: " role", model: "registration", operation: "delete:self" },
  { roleId: " role", model: "registration", operation: "delete:some" },
  { roleId: " role", model: "registration", operation: "delete:All" },

  { roleId: " role", model: "role", operation: "get:one" },
  { roleId: " role", model: "role", operation: "get:self" },
  { roleId: " role", model: "role", operation: "get:some" },
  { roleId: " role", model: "role", operation: "getAll" },
  { roleId: " role", model: "role", operation: "post" },
  { roleId: " role", model: "role", operation: "update:self" },
  { roleId: " role", model: "role", operation: "update:All" },
  { roleId: " role", model: "role", operation: "delete:one" },
  { roleId: " role", model: "role", operation: "delete:self" },
  { roleId: " role", model: "role", operation: "delete:some" },
  { roleId: " role", model: "role", operation: "delete:All" },

  { roleId: " role", model: "user", operation: "get:one" },
  { roleId: " role", model: "user", operation: "get:self" },
  { roleId: " role", model: "user", operation: "get:some" },
  { roleId: " role", model: "user", operation: "getAll" },
  { roleId: " role", model: "user", operation: "post" },
  { roleId: " role", model: "user", operation: "update:self" },
  { roleId: " role", model: "user", operation: "update:All" },
  { roleId: " role", model: "user", operation: "delete:one" },
  { roleId: " role", model: "user", operation: "delete:self" },
  { roleId: " role", model: "user", operation: "delete:some" },
  { roleId: " role", model: "user", operation: "delete:All" },

  { roleId: " role", model: "OperationToRole", operation: "get:one" },
  { roleId: " role", model: "OperationToRole", operation: "get:self" },
  { roleId: " role", model: "OperationToRole", operation: "get:some" },
  { roleId: " role", model: "OperationToRole", operation: "getAll" },
  { roleId: " role", model: "OperationToRole", operation: "post" },
  { roleId: " role", model: "OperationToRole", operation: "update:self" },
  { roleId: " role", model: "OperationToRole", operation: "update:All" },
  { roleId: " role", model: "OperationToRole", operation: "delete:one" },
  { roleId: " role", model: "OperationToRole", operation: "delete:self" },
  { roleId: " role", model: "OperationToRole", operation: "delete:some" },
  { roleId: " role", model: "OperationToRole", operation: "delete:All" },
];