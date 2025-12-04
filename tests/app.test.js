import request from "supertest"
import app from "../main.js"

const testUser = {
  userName: "Kokki",
  email: "kokki@gmail.com",
  password: "salasana123",
}

// Create an agent to keep the cookies between different requests (for logout test)
const cookieAgent = request.agent(app)

// Basic tests to check that all the pages are working
test("Home page is working (returns 200)", async () => {
  const res = await request(app).get("/")
  expect(res.statusCode).toBe(200)
})

test("Login page is working (returns 200)", async () => {
  const res = await request(app).get("/login")
  expect(res.statusCode).toBe(200)
})

test("Register page is working (returns 200)", async () => {
  const res = await request(app).get("/register")
  expect(res.statusCode).toBe(200)
})

// Check that registering, login, and logout works
test("Registration creates a new user", async () => {
  const res = await request(app).post("/users/create").send(testUser)
  expect(res.statusCode).toBe(302)
  expect(res.headers.location).toBe("/login")
})

test("Login logs in a user", async () => {
  const res = await request(app).post("/users/login").send({
    userName: testUser.userName,
    password: testUser.password,
  })

  expect(res.statusCode).toBe(302)
  expect(res.headers.location).toBe("/")
})

test("Logout logs out a user", async () => {
  // Login with the agent
  await cookieAgent.post("/users/login").send({
    userName: testUser.userName,
    password: testUser.password,
  })

  // Logout with the agent
  const res = await cookieAgent.get("/logout")
  expect(res.statusCode).toBe(302)
  expect(res.headers.location).toBe("/")
})

// Check that user can't create a recipe if not logged in
test("Create new recipe page redirects to login if you're not logged in", async () => {
  const res = await request(app).get("/recipes/new")
  expect(res.statusCode).toBe(302)
  expect(res.headers.location).toBe("/login")
})
