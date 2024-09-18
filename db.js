const mongoose = require("mongoose");
const { DB_URL } = require("./backend/config");
mongoose.connect(DB_URL);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    minLength: 4,
    maxLength: 40,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
    trim: true,
  },
});

const AccountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountsSchema);

module.exports = {
  User,
  Account,
};
