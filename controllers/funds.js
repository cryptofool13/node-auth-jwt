const jwt = require("jwt-simple");

const config = require("../config");

const User = require("../models/user");

function decodeToken(token) {
  let payload = jwt.decode(token, config.secret);
  return payload.sub;
}

exports.addFundEntry = (req, res, next) => {
  // check for user input
  if (!req.body.funds) {
    return res.send({ error: "bad input: no funds array found" });
  }

  let funds = req.body.funds;
  // validate user input is array
  if (!Array.isArray(funds)) {
    return res.send({ error: "bad input: funds must be an array" });
  }

  let accounts = [];
  // build temp array
  funds.forEach(fund => {
    accounts.push({ name: fund.name, balance: fund.balance });
  });
  // build temp fund entry
  const newFundEntry = {
    timestamp: new Date().getTime(),
    accounts: accounts
  };
  // pull user id from auth token
  let id = decodeToken(req.headers.authorization);
  // find user by id and update funds array
  User.findByIdAndUpdate(id, {
    // add newFundEntry and sort funds array
    $push: { funds: { $each: [newFundEntry], $sort: { timestamp: -1 } } }
  }).then((user, err) => {
    if (err) {
      res.send({ error: err });
    }

    // check if query returns an existing user
    if (!user) {
      res.send({ error: "user does not exist" });
    }

    res.send({ messgae: "funds updated" });
  });
};

exports.getCurrentBalance = (req, res, next) => {
  // pull user id from auth token
  let id = decodeToken(req.headers.authorization);

  // find by id to extract user's fund data
  User.findById(id).then((user, err) => {
    if (err) {
      res.send({ error: err });
    }

    // check if query returns an existing user
    if (!user) {
      res.send({ error: "user does not exist" });
    }

    // take first item in funds array (its sorted after every update)
    let currentFunds = user.funds[0].accounts;

    // responds with array of objects with name and balance props
    res.send(currentFunds);
  });
};

exports.getPastBalances = (req, res, next) => {
  // pull id from auth token
  let id = decodeToken(req.headers.authorization);

  // find by id to get user
  User.findById(id).then((user, err) => {
    if (err) {
      res.send({ error: err });
    }
    if (!user) {
      res.send({ error: "user does not exist" });
    }

    // return fund entries from up to 30 days ago
    let funds = user.funds;
    funds = funds.slice(0, 30);

    res.send(funds);
  });
};
