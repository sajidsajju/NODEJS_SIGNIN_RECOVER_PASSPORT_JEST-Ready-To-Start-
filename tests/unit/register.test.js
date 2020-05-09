const register = require("../../routes/register");
const userModel = require("../../models/User.model");
const httpMocks = require("node-mocks-http");
const newData = require("../mock-data/newData.json");

const model = userModel;
model.create = jest.fn();
model.findOne = jest.fn();



let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("register.CreateUser", () => {
    beforeEach(() => {
        req.body = newData;
    });
  test("should have a createUser function", () => {
    expect(typeof register.createUser).toBe("function");
  });
 
  test("should handle .findOne({Email}) error", async () => {
    model.findOne.mockReturnValue("Email Already Exist!");
    await register.createUser(req, res, next);
    expect(model.findOne).toBeCalledWith({ "email": "john@gmail.com"});
    expect(res.statusCode).toBe(401);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toBe("Email Already Exist!");
  });
  test("should match the passwords", async () => {
    await register.createUser(req, res, next);
    expect(req.body.password).toBe(req.body.confirm_password);
  });
});
  // test("should call the model.create", async () => {
  //   model.create.mockReturnValue('User registered successfully ! ');
  //   await register.createUser(req, res, next);
    // expect(model.create).toBeCalled();
    // expect(res.statusCode).toBe(201);
    // expect(res._isEndCalled()).toBeTruthy();
  //   expect(res._getJSONData()).toBe('User registered successfully ! ');
  // });

  // test("should handle errors", async () => {
  //   const errorMessage = {message: "Name property missing"};
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   model.create.mockReturnValue(rejectedPromise);
  //  await register.createUser(req, res, next);
  //   expect(res._getJSONData()).toStrictEqual(errorMessage);
  // });

  describe("register.loginUser", () => {

  test("should have a loginUser function", () => {
    expect(typeof register.loginUser).toBe("function");
  });
  
  });