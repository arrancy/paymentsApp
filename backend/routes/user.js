const { Router } = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("./../../db");
const { Account } = require("./../../db");
const { JWT_SECRET } = require("./../config");
const { authMiddleware } = require("./../middleware");
const userRouter = Router();

const zodSchemaSignUp = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6).max(50),
  firstName: zod.string().min(1).max(50),
  lastName: zod.string().min(1).max(50),
});

const zodSchemaSignin = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6).max(50),
});

const zodSchemaUpdate = zod
  .object({
    password: zod.optional(zod.string().min(6).max(50)),
    firstName: zod.optional(zod.string().min(1).max(50)),
    lastName: zod.optional(zod.string().min(1).max(50)),
  })
  .strict();
// const zodSchemaGetUsers = zod.object({
//   filter: zod.string().min(1).max(50),
// });

userRouter.post("/signup", async (req, res) => {
  const { success } = zodSchemaSignUp.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "invalid inputs",
    });
  }
  const personUsername = req.body.username;
  const usernameExists = await User.findOne({ username: personUsername });

  if (usernameExists) {
    return res.status(411).json({
      msg: "username already exists",
    });
  }
  const newUser = await new User(req.body);
  await newUser.save();
  const userId = newUser._id;

  // creating user's account with random balance
  let userAccount = new Account({
    userId: userId,
    balance: 100 + Math.floor(Math.random() * 1000000),
  });
  await userAccount.save();
  const token = await jwt.sign({ userId: userId }, JWT_SECRET);
  res.status(200).json({
    msg: "user created successfully",

    token: token,
  });
});

userRouter.post("/signin", async (req, res) => {
  console.log(req.body);
  const { success } = await zodSchemaSignin.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "invalid inputs",
    });
  }
  const correctCredentials = await User.findOne(req.body);
  if (!correctCredentials) {
    return res.status(411).json({
      msg: "wrong credentials",
    });
  }
  const userId = correctCredentials._id;
  const token = await jwt.sign({ userId: userId }, JWT_SECRET);
  res.status(200).json({
    token: token,
  });
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const payload = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ msg: "Please provide data to update" });
  }
  const { success } = zodSchemaUpdate.safeParse(payload);
  if (!success) {
    return res.status(411).json({
      msg: " invalid inputs ",
    });
  }
  try {
    await User.updateOne({ _id: req.userId }, payload);
    res.status(200).json({
      msg: "user updadted successfully",
    });
  } catch (err) {
    return console.log(" an error occured : " + err);
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  // const { success } = zodSchemaGetUsers.safeParse(req.params);
  // if (!success) {
  //   res.status(411).json({
  //     msg: "invalid inputs",
  //   });
  // }
  try {
    // Your existing code here
    const filter = req.query.filter || "";
    const requiredUsers = await User.find({
      $or: [
        { firstName: { "$regex": filter } },
        { lastName: { "$regex": filter } },
      ],
    });

    let usersToShow = requiredUsers.map((user) => {
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      };
    });
    res.status(200).json({
      users: usersToShow,
    });
  } catch (error) {
    console.error("Error in bulk user retrieval:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// const badTransaction = async (senderId, recieverId, amount) => {
//   let senderAccount = await User.findOne({ _id: senderId });

//   let recieverAccount = await User.find({ _id: recieverId });

//   await Account.findByIdAndUpdate(senderId, { $inc: { balance: -amount } });

//   await Account.findByIdAndUpdate(sendeerId, { $inc: { balance: amount } });
// };

module.exports = { userRouter };
