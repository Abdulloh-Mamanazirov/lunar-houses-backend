let express = require("express")
const { getBank } = require("../controller/banks.ctrl")

let bankRouter = express.Router()

bankRouter.post("/banks", getBank)

module.exports = bankRouter