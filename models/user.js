const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const fundsSchema = require("./funds");

//define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: String,
  funds: [fundsSchema],
  expenses: []
});

// on save hook, encrypt password
userSchema.pre("save", function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

// create model class

const userModel = mongoose.model("user", userSchema);

// export the model

module.exports = userModel;
