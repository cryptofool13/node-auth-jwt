const jwt = require("jwt-simple");
const ObjectID = require("mongodb").ObjectID;

const User = require("../models/user");

function decodeToken(token) {
  let payload = jwt.decode(token, process.env.SECRET);
  return payload.sub;
}

// add expense items
exports.addExpenseItems = (req, res, next) => {
  // check for user input
  if (!req.body.expenses) {
    return res.send({ error: "bad input: no expenses array" });
  }
  let expenses = req.body.expenses;
  // validate user input is array
  if (!Array.isArray(expenses)) {
    return res.send({ error: "bad input: expenses must be an array" });
  }
  if (!expenses[0]) {
    return res.send({ error: "bad input: no data received" });
  }

  let items = [];

  expenses.forEach(({ label, cost, itemType }) => {
    items.push({
      label,
      cost,
      itemType,
      _id: new ObjectID()
    });
  });

  const newExpenseEntry = {
    timestamp: new Date(),
    items: items
  };
  let id = decodeToken(req.headers.authorization);
  User.findByIdAndUpdate(id, {
    $push: { expenses: { $each: [newExpenseEntry], $sort: { timestamp: -1 } } }
  }).then((user, err) => {
    if (err) {
      return res.send({ error: err });
    }
    if (!user) {
      return res.send({ error: "user does not exist" });
    }
    res.send({ message: "expenses updated", data: user });
  });
};

// get expense list for current month
exports.getCurrentExpensesLs = (req, res, next) => {
  let id = decodeToken(req.headers.authorization);

  let currentTime = new Date().getTime();

  let expenses = [];

  User.findById(id).then((user, err) => {
    if (err) {
      return res.send({ error: err });
    }
    if (!user) {
      return res.send({ error: "user not found" });
    }
    if (!user.expenses.length) {
      return res.send({ error: "no data present" });
    }
    // filter user's expense items by current month
    user.expenses.forEach(entry => {
      if (currentTime - entry.timestamp.getTime() < 657000000) {
        entry.items.forEach(item => {
          expenses.push(item);
        });
      }
    });
    res.send(expenses);
  });
};

// get expense set for current month
exports.getCurrentExpensesSet = (req, res, next) => {
  let id = decodeToken(req.headers.authorization);

  let currentTime = new Date().getTime();

  let expenses = {};

  User.findById(id).then((user, err) => {
    if (err) {
      return res.send({ error: err });
    }
    if (!user) {
      return res.send({ error: "user not found" });
    }
    if (!user.expenses.length) {
      return res.send({ message: "no data present" });
    }

    user.expenses.forEach(entry => {
      if (currentTime - entry.timestamp.getTime() < 2628000000) {
        // go throught entry and add each item, only if it isnt there yet, and keep track of total costs
        entry.items.forEach(item => {
          let label = item.label;
          let cost = item.cost;

          if (!expenses.hasOwnProperty(label)) {
            expenses[label] = item.cost;
          } else {
            expenses[label] += cost;
          }
        });
      }
    });
    res.send({ data: expenses });
  });
};
