let express = require("express")
const { loginAdmin } = require("../controller/admin.ctrl")

let adminRoute = express.Router()

adminRoute.post("/log-in-admin", loginAdmin)

module.exports = adminRoute