const express = require("express")
const cors = require("cors")
require("dotenv").config()

// routes
const usersRoute = require("./routes/users.routes")
const adminRoute = require("./routes/admin.routes")
const companyRouter = require("./routes/company.routes")
const complexRouter = require("./routes/complex.routes")
const roomRouter = require("./routes/room.routes")
const bankRouter = require("./routes/bank.routes")

const port = process.env.PORT || 5001
const app = express()

app.use(cors())
app.use(express.json()) 

app.use(usersRoute)
app.use(adminRoute)
app.use(companyRouter)
app.use(complexRouter)
app.use(roomRouter)
app.use(bankRouter)

app.listen(port, () => console.log(port) )