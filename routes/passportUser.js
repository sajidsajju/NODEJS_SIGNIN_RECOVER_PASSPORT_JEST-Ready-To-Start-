var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/User.model");
const DeliveryModel = require("../models/Delivery.model");
const RestaurantModel = require("../models/Restaurant.model");

module.exports = function (passport) {
  var opts = {};
  optUsers = opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme(
    "bearer"
  );
  opts.secretOrKey = process.env.TOKEN_SECRET;
  // opts.issuer = 'accounts.examplesoft.com';
  // opts.audience = 'yoursite.net';
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      const model =
        jwt_payload.type === "user"
          ? UserModel
          : jwt_payload.type === "restaurant"
          ? RestaurantModel
          : DeliveryModel;

      model.findOne({ id: jwt_payload.sub, type: jwt_payload.type }, function (
        err,
        user
      ) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
  );
};
