# Truenorth challenge with typescript

AWS serverless(lambda, dynamodb) calculator server using serverless framework.

## Install

```shell
npm install
```

### local

```shell
# install dynamodb-local
npm run dynamodb:install

# run serverless-offline
npm run start:offline
```

### enviroment variables

You will have to generate a `.env` file with the same variables as `.envExample`.

```shell
# .env
RANDOM_ORG_API_KEY=someApiKeyFromRandom.org
JWT_SECRET=yourSecretJWTSeed
```

### seeding

Create a `user-seed.json` file in src/seed with the following structure.

```json
{
  "email": "someEmail",
  "password": "someEncryptedPassword"
}
```

## AWS

First, set up your AWS settings and run the following command.

Serverless framework deploy lambda, api gateway, dynamodb and other resources.

```shell
npm run deploy:prod
```

Then invoke the seeding function (/seedData) to create the first user and basic operations.

You can run the following command, but you will have to change the url in the `package.json` file.

```shell
npm run seed:prod
```

#### Local Endpoints

`POST user login -`
POST   | http://localhost:3001/dev/v1/login
`POST record new user operation -`       
POST   | http://localhost:3001/dev/v1/record 
`DELETE soft delete user operations -`      
DELETE | http://localhost:3001/dev/v1/record
`GET get all user operations -`      
GET    | http://localhost:3001/dev/v1/record
`GET get all operations -` 
GET    | http://localhost:3001/dev/v1/operation
`POST user login -`    
POST   | http://localhost:3001/dev/seedData 

## Testing

Tests are located in the `tests` folder inside each action module.

To run the tests, run the following command.

```shell
npm run test
```
