# Next.js Backend (Clean Architecture)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)

This is the backend API for the project, built with Next.js and following Clean Architecture principles. The React frontend will be loaded separately into the project root.

**Note:** The `/pages`, `/styles`, and `/public` folders have been removed for a pure API backend.

## Deployment

- Deploy instantly to Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)
- Update `.vercel/project.json` with your real `projectId` and `orgId` from the Vercel dashboard for production deployments.
- See [Vercel Docs](https://vercel.com/docs) for more info.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file with your PostgreSQL `DATABASE_URL` and `JWT_SECRET`.
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Authentication

- All endpoints except `/api/auth/register` and `/api/auth/login` require a JWT Bearer token in the `Authorization` header.
- Obtain a token by registering and logging in.
- Example:
  ```http
  Authorization: Bearer <your-jwt-token>
  ```

## API Documentation (Swagger/OpenAPI)

- The OpenAPI spec is available at [`/api/docs`](http://localhost:3000/api/docs) (JSON).
- To view Swagger UI, use a tool like [Swagger Editor](https://editor.swagger.io/) and import the JSON from `/api/docs`.

## Project Structure

- `src/core` - Domain models, enums, interfaces
- `src/infrastructure` - Prisma repositories, adapters
- `src/application` - Use cases
- `src/api` - Next.js API routes
- `src/tests` - Unit and integration tests

## Testing

- Run all tests:
  ```bash
  npm test
  ```
- Unit and integration tests are in `src/tests/`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](LICENSE)
