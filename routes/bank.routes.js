let express = require("express");
const { getBank, doCalculation, saveCalculation } = require("../controller/banks.ctrl");

let bankRouter = express.Router();

bankRouter.post("/banks", getBank);
bankRouter.post("/calculation", doCalculation);
bankRouter.post("/save-calculation", saveCalculation);

module.exports = bankRouter;