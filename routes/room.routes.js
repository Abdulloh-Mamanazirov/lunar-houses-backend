let express = require("express")
const { getRooms, addRoom, deleteRoom, getOneComplexRooms, updateRoom } = require("../controller/room.ctrl")

let roomRouter = express.Router()

roomRouter.get('/rooms', getRooms)
roomRouter.get('/rooms/:id', getOneComplexRooms)
roomRouter.post('/add-room', addRoom)
roomRouter.delete('/delete-room/:id', deleteRoom)
roomRouter.put('/update-room/:id', updateRoom)

module.exports = roomRouter