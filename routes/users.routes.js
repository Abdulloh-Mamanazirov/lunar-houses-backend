let express = require("express")
const { getAllUsers, loginUser, deleteUser, saveUserHouses, getUserHouses, deleteUserHouse } = require("../controller/users.ctrl")

let usersRoute = express.Router()

usersRoute.get('/users', getAllUsers)
usersRoute.post('/log-in-user', loginUser)
usersRoute.delete('/delete-user/:id', deleteUser)
usersRoute.post('/save-house', saveUserHouses)
usersRoute.get('/get-houses/:id', getUserHouses)
usersRoute.delete("/delete-houses/:id", deleteUserHouse);

module.exports = usersRoute