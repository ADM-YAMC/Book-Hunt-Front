import { Role } from '../Roles/roles';

export interface Users {
  id: number;
  name: string;
  lastName: string;
  password: string;
  email: string;
  roleId: number;
  isActive: boolean;
  role: Role;
}
