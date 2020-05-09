const DeliveryModel = require("../models/Delivery.model");
const RestaurantModel = require("../models/Restaurant.model");
const UserModel = require("../models/User.model");
const {
  registerValidation,
  loginValidation,
  recoverValidation,
  resetValidation,
  addressValidation
} = require("./validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Password = require("../routes/password");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  {
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? cb(null, true)
      : cb(null, false);
  }
};

module.exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Model = (req) => {
  return req === "user"
    ? UserModel
    : req === "restaurant"
    ? RestaurantModel
    : DeliveryModel;
};

exports.createUser = async (req, res, next) => {
  const model = Model(req.body.type);
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message);

    const EmailExist = await model.findOne({ email: req.body.email });
    if (EmailExist) return res.status(401).json("Email Already Exist!");

    const NameExist = await model.findOne({ name: req.body.name });
    if (NameExist) return res.status(401).json("Name Already Exist!");

    if (req.body.password !== req.body.confirm_password)
      return res.status(401).json("Password Doesnot match!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const createdModel = await model.create(req.body);
    // res.json(createdModel);
    return res.status(201).json("User registered successfully ! ");
  } catch (err) {
    return res.json(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const model = Model(req.body.type);
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message);

    const user = await model.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "user doesnot exist" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Email/Password" });

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, type: user.type },
      process.env.TOKEN_SECRET,
     /* { expiresIn: 3000 /*1 week }*/
    );
    return res.status(201).json({ success: true, token: "bearer " + token });
  } catch (err) {
    return res.json(err);
  }
};

exports.recover = (req, res) => {
  const { error } = recoverValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  Password.recover(req, res);
};

exports.getReset = (req, res) => {
  Password.reset(req, res);
};

exports.reset = (req, res) => {
  const { error } = resetValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  Password.resetPassword(req, res);
};

exports.imageUpload = async (req, res) => {
  const model = Model(req.user.type);

  model.findById(req.user._id).then(async (user) => {
    user.profileImage = req.file.filename;
    await user
      .save()
      .then(() => res.status(201).json("Profile Pic Changed!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
};

exports.imageDelete = async (req, res) => {
  const model = Model(req.user.type);
  try {
    await model.findById(req.user._id).then((user) => {
      fs.unlink("./uploads/" + user.profileImage, function (err) {
        if (err) return res.json(err);
      });
    });

    await model.findById(req.user._id).then(async (user) => {
      user.profileImage = undefined;
      await user.save();
      return res.status(201).json("Profile Picture Removed ! ");
    });
  } catch (err) {
    return res.status(401).json(err);
  }
};
exports.addAddress = async (req, res) => {
  const model = Model(req.user.type);
  const { error } = addressValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  const address = {
    address: {
      phone: req.body.phone,
      flat: req.body.flat,
      landmark: req.body.landmark,
    },
  };
  try {
    const savedData = await model.findByIdAndUpdate(req.user._id, {
      $push: { addresses: address },
    });
    if (savedData) return res.status(201).json("Address updated");
  } catch (err) {
    return res.status(401).json(err);
  }
};

exports.deleteAddress = async (req, res) => {
  const model = Model(req.user.type);

  try {
    const savedData = await model.findByIdAndUpdate(req.user._id, {
      $pop: { addresses: -1 },
    });
    if (savedData) return res.status(201).json("Deleted");
    else return res.status(401).json("Empty Address List");
  } catch (err) {
    return res.status(401).json(err);
  }
};

exports.getAddress = async (req, res) => {
  const model = Model(req.user.type);

  await model
    .findById(req.user._id)
    .then((user) => {
      if(user.addresses)
      return res.status(201).json(user.addresses);
      else return res.status(401).json("Empty Address List");
    })
    .catch((err) => res.status(401).json("Error: " + err));
};
