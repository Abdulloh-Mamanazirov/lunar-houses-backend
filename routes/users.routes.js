let express = require("express")
const { getAllUsers, loginUser, deleteUser } = require("../controller/users.ctrl")

let usersRoute = express.Router()

usersRoute.get('/users', getAllUsers)
usersRoute.post('/log-in-user', loginUser)
usersRoute.delete('/delete-user/:id', deleteUser)

module.exports = usersRoute