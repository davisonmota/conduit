# ![RealWorld Example App](logo.png)

> ### Node.js and TypeScript codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Node.js, TypeScript, Prisma and Docker** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Node.js, TypeScript, Prisma and Docker** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

> Backend application built using Clean Architecture and DDD. Developed Test Driven (TDD) applying community best practices.
SOLID, Clen code, Security and performance.

## Features
**General functionality:**

* ✅ Authenticate users via JWT (login/signup pages + logout button on settings page)
* ✅ CRU- users (sign up & settings page - no deleting required)
* [ ] CRUD Articles
* [ ] CR-D Comments on articles (no updating required)
* [ ] GET and display paginated lists of articles
* [ ] Favorite articles
* [ ] Follow other users

>To learn more about access [RealWorld](https://realworld-docs.netlify.app/docs/intro).


## Running API tests locally

>### Collection Postman
Use [Postman Collection](./Conduit.postman_collection.json) to API tests locally, to learn more about access [realworld-docs](https://realworld-docs.netlify.app/docs/specs/backend-specs/postman).

Clone project

```bash
  git clone https://github.com/davisonmota/conduit.git
```

Enter the project directory
```bash
  cd conduit
```

Install dependencies
```bash
  npm install
```
Configure database connection url in file **.env**
```bash
  DATABASE_URL="postgresql://<user>:<password>@localhost:5432/mydb"
```
Run migrations database
```bash
  npx prisma migrate dev 
```
Start server
```bash
  npm run start:dev
```

Run tests
```bash
  npm run test
```
Collect coverage 
```bash
  npm run test:coverage
```