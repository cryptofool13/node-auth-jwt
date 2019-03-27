const passport = require("passport");

const Authentication = require("./controllers/authentication");
const FundsController = require("./controllers/funds");
const ExpenseController = require("./controllers/expenses");
// used to tell passport which strategies to use
const passportService = require("./services/passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = app => {
  app.get("/", requireAuth, (req, res) => {
    res.send("hi");
  });
  // funds routes
  app.get("/funds", requireAuth, FundsController.getCurrentBalance);
  app.get("/funds/data", requireAuth, FundsController.getPastBalances);
  app.post("/funds", requireAuth, FundsController.addFundEntry);
  // expense routes
  app.post("/spending", requireAuth, ExpenseController.addExpenseItems);
  // auth routes
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};
