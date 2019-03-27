const jwt = require("jwt-simple");

const config = require("../config");

const User = require("../models/user");

function decodeToken(token) {
  let payload = jwt.decode(token, config.secret);
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

  let items = [];

  expenses.forEach(item => {
    items.push({
      label: item.label,
      cost: item.cost,
      itemType: item.itemType
    });
  });

  const newExpenseEntry = {
    timestamp: new Date().getTime(),
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

// get expense set for current month
