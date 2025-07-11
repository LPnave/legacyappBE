import { z } from 'zod';
import { ProjectStatus } from '../core/enums/ProjectStatus';

export const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  createdBy: z.string().uuid(),
  status: z.nativeEnum(ProjectStatus),
  description: z.string().optional(),
});

export type ProjectCreateDTO = z.infer<typeof ProjectCreateSchema>; 