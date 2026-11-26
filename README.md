# RecipeBookProj
## Clone and install

Clone the repository:

```bash
git clone https://github.com/Fart1k/RecipeBookProj.git
cd RecipeBookProj
```

Install backend dependencies from the repository root:

```bash
npm install
```


## Configure environment variables

### 1. Create a `.env` file

Create a file called `.env` in the repository root:

```dotenv
DB_NAME=recipebook
DB_USERNAME=root
DB_PASSWORD=YOUR_MARIADB_PASSWORD
DB_HOSTNAME=127.0.0.1
PORT=8080
SYNC=true
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET
```

Replace `root` and the password with your actual MariaDB credentials.

**Generate a secure `JWT_SECRET`:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the complete generated value after `JWT_SECRET=`. A sample file named `.env.expample` exists in the repository, but its `JWT_SECRET` line is an instruction, not a usable secret. Replace it rather than copying it literally.

## Start the backend

From the repository root:

```bash
npm run dev
```

With `PORT=8080`, the backend should be reachable at:

- API base URL: **http://localhost:8080**
- Swagger UI: **http://localhost:8080/docs**

On startup, Sequelize creates or adjusts the application's tables when `SYNC=true`. Keep the server running while testing requests; stop it with **Ctrl+C**.

## Test registration and login

The simplest way to test authentication is through Postman.

### 1. Register a user

**POST** `http://localhost:8080/users/register`

Body:

```json
{
  "UserName": "DemoUser",
  "EmailAddress": "demo@example.com",
  "Password": "DemoPassword123!"
}
```

Expected: **201 Created**, with a response similar to:

```json
{
  "message": "User registered successfully",
  "userId": "<generated-user-uuid>",
  "username": "DemoUser"
}
```

### 2. Log in

**POST** `http://localhost:8080/users/login`

Body:

```json
{
  "EmailAddress": "demo@example.com",
  "Password": "DemoPassword123!"
}
```

Expected: **200 OK**. The response includes a `token` and a `user` object:

```json
{
  "message": "Login successful",
  "token": "<your-JWT-token>",
  "user": {
    "id": "<generated-user-uuid>",
    "username": "DemoUser",
    "email": "demo@example.com",
    "role": "user"
  }
}
```

Copy the `token` value. Tokens currently expire after 24 hours. Changing `JWT_SECRET` invalidates tokens signed with the old value.

## Test an authenticated request

Use the token returned by `/users/login`.

In **Postman**:

1. Create a **GET** request to `http://localhost:8080/recipes/mine`.
2. Go to **Authorization -> Bearer Token**.
3. Paste only the token.
4. Click Send.

Expected: **200 OK** with an array of recipes belonging to your user or an empty array if user have no recipes.


If you omit the token, the app returns **401**. If you provide an expired/invalid token, the app also returns **401**. A valid token belonging to a banned account is rejected with **403**.

### Test protected recipe creation

**POST** `http://localhost:8080/recipes` with the same Bearer token and this JSON body:

```json
{
  "RecipeTitle": "Simple Pasta",
  "Ingredients": "Pasta, water, salt",
  "Instructions": "Boil the pasta and serve.",
  "IsVisibleToOther": true
}
```

Expected: **201 Created**. Newly created recipes have `Status = false`, so they will **not** appear in the public `GET /recipes` list until approved by an administrator. You can still see your own recipe in `GET /recipes/mine`.

### Test using Swagger UI

Visit **http://localhost:8080/docs**. For protected endpoints, click **Authorize** and paste the JWT token.

### Admin functions

For testing admin functions you need to create Admin user, login with it and get an admin token.

## Links

- [GitHub Projects](https://github.com/users/Fart1k/projects/6)
- [Project ERD](https://github.com/user-attachments/assets/5bf0c8ef-7a13-45e0-9aaa-574bd1e6b2a3)
