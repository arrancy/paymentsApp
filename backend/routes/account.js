const { Router } = require("express");
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose");
const { Account } = require("./../../db");
const { User } = require("./../../db");

const zod = require("zod");

const accountRouter = Router();

const transferSchema = zod.object({
  to: zod.string(),
  amount: zod.number(),
});
accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const idOfUser = req.userId;
  const requestedAccount = await Account.findOne({ userId: idOfUser });
  const requestedAccountForName = await User.findOne({ _id: idOfUser });
  const finalBalance = requestedAccount.balance / 100;
  const firstName = requestedAccountForName.firstName;
  console.log(firstName);
  res.status(200).json({
    balance: "rs " + finalBalance,
    firstName: firstName,
  });
});
accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { success } = transferSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ msg: "invalid inputs" });
  }
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const finalAmount = amount * 100;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -finalAmount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: finalAmount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
      msg: "Transfer successful",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  accountRouter,
};

// the code below checks the reliability of the transaction, it simulates two back to back transactions and then throws an error because of two almost concurrent transactions.
// async function transfer(req) {
//   try {
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to } = req.body;

//     // Fetch the accounts within the transaction
//     const account = await Account.findOne({ userId: req.userId }).session(
//       session
//     );

//     if (!account) {
//       await session.abortTransaction();
//       console.log("account does not exist");
//       return;
//     }
//     if (account.balance < amount) {
//       await session.abortTransaction();
//       console.log("Insufficient balance");
//       return;
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//       await session.abortTransaction();
//       console.log("Invalid account");
//       return;
//     }

//     // Perform the transfer
//     await Account.updateOne(
//       { userId: req.userId },
//       { $inc: { balance: -amount } }
//     ).session(session);
//     await Account.updateOne(
//       { userId: to },
//       { $inc: { balance: amount } }
//     ).session(session);

//     // Commit the transaction
//     await session.commitTransaction();
//     console.log("done");
//   } catch (err) {
//     console.log(err);
//   }
// }

// transfer({
//   userId: "661804d2a590780fd8eeecbd",
//   body: {
//     to: "6617e794f98bff743326e1b4",
//     amount: 100,
//   },
// });

// transfer({
//   userId: "661804d2a590780fd8eeecbd",
//   body: {
//     to: "6617e794f98bff743326e1b4",
//     amount: 100,
//   },
// });

//week 8 : paytm backend : control does not go ahead of mongoose.startSession();
// whenever i send a request to the "/transfer" endpoint and i am using transactions in mnogoose the whenever i send the request, postman keeps loading forever and after adding a few logs i came to know that the control reaches to await mongoose.startSession(); and does not go forward because i experimented by putting logs above and below it .
//problem is solved now, it was because mongoose was installed in the main parent directory as well as the backend directory
