const UserModel = require("../models/User.model");
const DeliveryModel = require("../models/Delivery.model");
const RestaurantModel = require("../models/Restaurant.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const Model = (req) => {
  return req === "user"
    ? UserModel
    : req === "restaurant"
    ? RestaurantModel
    : DeliveryModel;
};
// ===PASSWORD RECOVER AND RESET

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = async(req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.FROM_PASS,
    },
  });
  const model = Model(req.body.type);

 await model
    .findOne({ email: req.body.email })
    .then(async(user) => {
      if (!user)
        return res.status(401).json({
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again.",
        });

      //Generate and set password reset token
      await user.generatePasswordReset();

      // Save the updated user object
     await user
        .save()
        .then(async(user) => {
          // send email
          let link =
            "http://" +
            req.headers.host +
            "/api/reset/" +
            user.type +
            "/" +
            user.resetPasswordToken;

          const mailOptions = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "Password change request",
            html: `Hi ${user.name}, \n 
                    <h2 style="color: orange">SWIGGY - </h2><h3 style="color: orange">FOOD DELIVERY APP</h3>\n
                    Please click on the following link,
                     ${link} to reset your password.
                   <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>\n`,
          };

          await transporter.sendMail(mailOptions, (error, result) => {
            if (error) return res.status(500).json({ message: error.message });

            res.status(200).json({
              message: "A reset email has been sent to " + user.email + ".",
            });
          });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// @route POST api/auth/reset
// @desc Reset Password
// @access Public
exports.resetPassword = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.FROM_PASS,
    },
  });
  const model = Model(req.params.type);

  await model
    .findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    .then(async (user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //Set the new password
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save
      await user.save(async(err) => {
        if (err) return res.status(500).json({ message: err.message });

        // send email
        const mailOptions = {
          to: user.email,
          from: process.env.FROM_EMAIL,
          subject: "Your password has been changed",
          html: `Hi ${user.name}, \n 
          <h2 style="color: orange">SWIGGY - </h2><h3 style="color: orange">FOOD DELIVERY APP</h3>\n
                   <p> This is a confirmation that the password for your account ${user.email} has just been changed.</p>\n`,
        };

        await transporter.sendMail(mailOptions, (error, result) => {
          if (error) return res.status(500).json({ message: error.message });

          res.status(200).json({ message: "Your password has been updated." });
        });
      });
    });
};
