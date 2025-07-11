import { Role } from '../enums/Role';

export interface User {
  UserID: string;
  Email: string;
  PasswordHash: string;
  Name?: string;
  Role: Role;
  CreatedAt: Date;
  UpdatedAt: Date;
} 