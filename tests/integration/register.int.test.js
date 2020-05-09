const request = require("supertest");
const app = require("../../app");
const newData = require("../mock-data/newData.json");
const userModel = require("../../models/User.model");

const endpointUrl = "/api/register";
const loginUrl = "/api/login";
const recoverUrl = "/api/recover";
const addressUrl = "/api/address";
const token = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWFmZmQwNDliZDVhYTJkMDA1ZWE2YzYiLCJlbWFpbCI6InNhamlkYWhtZWQxMDAyQGdtYWlsLmNvbSIsIm5hbWUiOiJzYWppZHNhamp1IiwidHlwZSI6InVzZXIiLCJpYXQiOjE1ODg5ODk5NDJ9.mZet74luMT98PGFjkJAUkfbZvquY3uhAIDfdu3t6Cc0";
const wrongToken = "hvbdsj";


describe(endpointUrl, () => {
  test("POST " + endpointUrl, async () => {
    // const response = await request(app).post(endpointUrl).send(newData);
    // expect(response.statusCode).toBe(201);
    // expect(response.body).toBe("User registered successfully ! ");
  });
  test(
    "should return error 500 on malformed data with POST" + endpointUrl,
    async () => {

      const response = await request(app).post(endpointUrl).send({
        "email": "john@gmail.com",
        "password": "johncena",
        "confirm_password": "johncena",
        "type": "user"
    });
      expect(response.statusCode).toBe(401);
      expect(response.body).not.toBe("User registered successfully ! ");
    });
});
describe(loginUrl, () => {
  test("POST " + loginUrl, async () => {
    const response = await request(app).post(loginUrl).send({
      "email": "sajidahmed1002@gmail.com",
      "password": "sajidsajju",
      "type": "user"
  });
  expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ success: true, token: expect.anything()});

  });
  test("POST  error handling in loginUSER" , async () => {
    const response = await request(app).post(loginUrl).send({
      "email": "sajidahmed1002@gmail.com",
      "type": "user"
  });
  expect(response.statusCode).toBe(401);
    expect(response.body).not.toStrictEqual({ success: true, token: expect.anything()});

  });
});
describe(recoverUrl, () => {
  test("POST " + recoverUrl, async () => {
    const response = await request(app).post(recoverUrl).send({
      "email": "sajidahmed1002@gmail.com",
      "type": "user"
  });
  expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({"message": "A reset email has been sent to sajidahmed1002@gmail.com."});

  });
  test("POST  error handling in recoverPassword" , async () => {
    const response = await request(app).post(recoverUrl).send({
      "email": "sajidahmed@gmail.com",
      "type": "user"
  });
  expect(response.statusCode).toBe(401);
    expect(response.body).not.toStrictEqual({"message": "A reset email has been sent to sajidahmed1002@gmail.com."});

  });
});
describe(addressUrl, () => {
  test("GET " + addressUrl, async () => {
    const response = await request(app).get(addressUrl).set({Authorization: token});
  expect(response.statusCode).toBe(201);
    expect(response.body).not.toStrictEqual({"message": "Empty Address List"});

  });
  test("GET error handling in " + addressUrl, async () => {
    const response = await request(app).get(addressUrl).set({Authorization: wrongToken});
  expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({});

  });
});
describe(addressUrl, () => {
  test("POST " + addressUrl, async () => {
    const response = await request(app).post(addressUrl).set({Authorization: token}).send({
      "phone": "9874568794",
      "flat": "flat-bdsjh",
      "landmark": "near qwe, dbf"
    });
  expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual("Address updated");

  });
  test("POST error handling in " + addressUrl, async () => {
    const response = await request(app).post(addressUrl).set({Authorization: token}).send({
      "phone": "98794",
      "flat": "flat-bdsjh"
    });
  expect(response.statusCode).toBe(401);
    expect(response.body).not.toStrictEqual("Address updated");

  });
});
describe(addressUrl, () => {
  test("DELETE " + addressUrl, async () => {
    const response = await request(app).delete(addressUrl).set({Authorization: token});
  expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual("Deleted");

  });
  test("DELETE error handling in " + addressUrl, async () => {
    const response = await request(app).delete(addressUrl).set({Authorization: wrongToken});
  expect(response.statusCode).toBe(401);
    expect(response.body).not.toStrictEqual("Deleted");

  });
});
