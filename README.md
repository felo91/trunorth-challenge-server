# TrueNorth Challenge with TypeScript

This project is an AWS serverless calculator server built with TypeScript and utilizing the Serverless Framework. Key services used include AWS Lambda and DynamoDB.

## Getting Started

Follow these steps to get a local copy up and running.

### Installation

Start by installing all the dependencies required for this project.

```shell
npm install
```

### Local Setup

Before you can run the server locally, make sure to install DynamoDB Local using the following command:

```shell
npm run dynamodb:install
```

You can then start the server in offline mode with:

```shell
npm run start:offline
```

### Environment Variables

For the server to function correctly, you need to set up your environment variables. Generate a `.env` file using the provided `.envExample` as a template.

```shell
# .env
RANDOM_ORG_API_KEY=<your-api-key>
JWT_SECRET=<your-jwt-secret>
```

### Database Seeding

Create a `user-seed.json` file in the `src/seed` directory with the following structure:

```json
{
  "username": "<user-email>",
  "password": "<user-encrypted-password>"
  "status": "ACTIVE",
  "id": "b73caeba-058a-4713-9091-d84afd0975e2"
}
```

## AWS Deployment

Before deploying to AWS, ensure your AWS settings are configured correctly.

The Serverless Framework will handle the deployment of Lambda, API Gateway, DynamoDB, and other resources.

```shell
npm run deploy:prod
```

Invoke the seeding function (`/seedData`) to create the first user and basic operations.

```shell
npm run seed:prod
```

> Note: You will have to update the URL in the `package.json` file before running the command above.

## Endpoints

### Local Endpoints

- `POST user login` - POST | http://localhost:3001/dev/v1/login
- `record new user operation` - POST | http://localhost:3001/dev/v1/record 
- `soft delete user operation` - DELETE | http://localhost:3001/dev/v1/record
- `get all user operations` - GET | http://localhost:3001/dev/v1/record
- `get all operations` - GET | http://localhost:3001/dev/v1/operation
- `seed data` - POST | http://localhost:3001/dev/seedData 

> Note: You will not need to seed data locally, dynamodb will make it automatically.

## Testing

Unit tests are located within the `tests` folder inside each action module. Run the tests with the following command:

```shell
npm run test
```

## Live demo

https://ahvbqgblu9.execute-api.us-east-2.amazonaws.com/prod

## License

This project is licensed under the [MIT License](LICENSE.md).


