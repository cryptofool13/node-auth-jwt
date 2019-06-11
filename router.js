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
  app.get("/api/funds", requireAuth, FundsController.getCurrentBalance);
  app.get("/api/funds/data", requireAuth, FundsController.getPastBalances);
  app.post("/api/funds", requireAuth, FundsController.addFundEntry);
  // expense routes
  app.get(
    "/api/spending/ls",
    requireAuth,
    ExpenseController.getCurrentExpensesLs
  );
  app.get(
    "/api/spending/set",
    requireAuth,
    ExpenseController.getCurrentExpensesSet
  );
  app.post("/api/spending", requireAuth, ExpenseController.addExpenseItems);
  // auth routes
  app.post("/api/signin", requireSignin, Authentication.signin);
  app.post("/api/signup", Authentication.signup);
};
