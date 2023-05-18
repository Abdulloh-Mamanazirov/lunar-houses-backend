const Joi = require("joi")
const jwt = require("jsonwebtoken")
const client = require("../utils/config")

const getRooms = async (req,res) => {
    let rooms = await client.query(
      `SELECT r.id room_id, r.number_of_rooms, r.price, r.kv, cpx.id complex_id, cpx.name comlex_name, cpy.id company_id, cpy.name company_name FROM room r JOIN complex cpx ON r.complex_id = cpx.id JOIN company cpy ON cpx.company_id = cpy.id`
    );
    res.status(200).json(rooms.rows)
}

const getOneComplexRooms = async (req, res) => {
  let { id } = req.params;
  let complex = await client.query(
    `select * from room where complex_id =  $1`,
    [id]
  );
  if (complex.rowCount === 0) return res.send("Room not found!");
  res.json(complex.rows);
};


const addRoom = async (req,res)=>{
    let {number_of_rooms, price, kv, complex} = req.body
    let {token} = req.headers

    try {
      jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).send("Invalid token");
    }

    const schema = Joi.object({
      number_of_rooms: Joi.number().min(1).required(),
      price: Joi.number().required(),
      kv: Joi.number().min(5).required(),
      complex: Joi.string().required(),
    });
    let { error } = schema.validate(req.body);
    if (error) return res.status(400).json(error);

    let foundedComplex = await client.query(`select * from complex where name = $1`,[complex])

    await client.query(`INSERT INTO room(number_of_rooms, price, kv, company_id, complex_id)VALUES($1,$2,$3,$4,$5)`,[number_of_rooms,price,kv,foundedComplex.rows[0].company_id, foundedComplex.rows[0].id])

    res.status(200).send("Room added successfully")
}

const deleteRoom = async (req, res) => {
  let { token } = req.headers;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedRoom = client.query(`select * from company where id = $1`, [
    id,
  ]);

  if (foundedRoom.rowCount === 0)
    return res.status(404).send("Room not found");

  await client.query(`DELETE FROM room WHERE id = $1`, [id]);

  res.send("Deleted!");
};

const updateRoom = async (req, res) => {
  let { token } = req.headers;
  let { number_of_rooms,price,kv } = req.body;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedRoom = await client.query(`select * from room where id = $1`, [
    id,
  ]);
  if (foundedRoom.rowCount === 0)
    return res.status(404).send("Room not found");

  number_of_rooms = number_of_rooms ? number_of_rooms : foundedRoom.rows[0].number_of_rooms;
  price = price ? price : foundedRoom.rows[0].price;
  kv = kv ? kv : foundedRoom.rows[0].kv;

  try {
    await client.query(
      `update room set number_of_rooms = $1, price = $2, kv = $3 where id = $4`,
      [number_of_rooms, price, kv, id]
    );
    res.status(200).send("Updated successfully!");
  } catch (error) {
    res.send("Please check the input and try again");
  }
};

module.exports = { getRooms,getOneComplexRooms, addRoom, deleteRoom, updateRoom }