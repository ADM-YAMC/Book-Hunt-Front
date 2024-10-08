export interface Auth {
  email: string;
  password: string;
}
export interface Account {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  token: string;
}
