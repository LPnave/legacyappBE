import { ProjectStatus } from '../enums/ProjectStatus';
import { User } from './User';

export interface Project {
  ProjectID: string;
  Title: string;
  Description?: string;
  Status: ProjectStatus;
  CreatedBy: User | string;
  CreatedByName?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
} 