import type { NextApiRequest, NextApiResponse } from 'next';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'LDA Project API',
    version: '1.0.0',
    description: 'API documentation for the LDA Project backend',
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          UserID: { type: 'string' },
          Email: { type: 'string', format: 'email' },
          PasswordHash: { type: 'string' },
          Name: { type: 'string' },
          Role: { $ref: '#/components/schemas/Role' },
          CreatedAt: { type: 'string', format: 'date-time' },
          UpdatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['UserID', 'Email', 'PasswordHash', 'Role', 'CreatedAt', 'UpdatedAt'],
      },
      Project: {
        type: 'object',
        properties: {
          ProjectID: { type: 'string' },
          Title: { type: 'string' },
          Description: { type: 'string' },
          Status: { $ref: '#/components/schemas/ProjectStatus' },
          CreatedBy: { type: 'string' },
          CreatedAt: { type: 'string', format: 'date-time' },
          UpdatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['ProjectID', 'Title', 'Status', 'CreatedBy', 'CreatedAt', 'UpdatedAt'],
      },
      ProjectAssignment: {
        type: 'object',
        properties: {
          AssignmentID: { type: 'string' },
          ProjectID: { type: 'string' },
          UserID: { type: 'string' },
          AssignedAt: { type: 'string', format: 'date-time' },
        },
        required: ['AssignmentID', 'ProjectID', 'UserID', 'AssignedAt'],
      },
      Page: {
        type: 'object',
        properties: {
          PageID: { type: 'string' },
          ProjectID: { type: 'string' },
          Title: { type: 'string' },
          ScreenshotPath: { type: 'string' },
          Order: { type: 'integer' },
          CreatedAt: { type: 'string', format: 'date-time' },
          UpdatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['PageID', 'ProjectID', 'ScreenshotPath', 'Order', 'CreatedAt', 'UpdatedAt'],
      },
      Workflow: {
        type: 'object',
        properties: {
          WorkflowID: { type: 'string' },
          FromPageID: { type: 'string' },
          ToPageID: { type: 'string' },
          Label: { type: 'string' },
          CreatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['WorkflowID', 'FromPageID', 'ToPageID', 'CreatedAt'],
      },
      Comment: {
        type: 'object',
        properties: {
          CommentID: { type: 'string' },
          PageID: { type: 'string' },
          UserID: { type: 'string' },
          Content: { type: 'string' },
          CreatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['CommentID', 'PageID', 'UserID', 'Content', 'CreatedAt'],
      },
      PDFReport: {
        type: 'object',
        properties: {
          ReportID: { type: 'string' },
          ProjectID: { type: 'string' },
          GeneratedAt: { type: 'string', format: 'date-time' },
          FilePath: { type: 'string' },
        },
        required: ['ReportID', 'ProjectID', 'GeneratedAt', 'FilePath'],
      },
      Role: {
        type: 'string',
        enum: ['PM', 'Developer'],
      },
      ProjectStatus: {
        type: 'string',
        enum: ['Working', 'Review', 'Ready'],
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ['./pages/api/**/*.ts'], // Path to the API docs (JSDoc comments)
};

const swaggerSpec = swaggerJSDoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerSpec);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// To serve Swagger UI, use a custom Express server or a separate script (Next.js API routes do not support middleware like swagger-ui-express directly) 