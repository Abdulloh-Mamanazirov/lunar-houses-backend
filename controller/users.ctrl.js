let client = require("../utils/config")
const Joi = require("joi")
const jwt = require("jsonwebtoken")

const getAllUsers = async (req,res) => {
    let users = await client.query(`select * from users`)
    res.status(200).json(users.rows)
}

const loginUser = async (req,res) => {
    let {name, email} = req.body

    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email(),
    });
    let {error} = schema.validate(req.body);
    if(error) return res.status(400).json(error);

    let foundedUser = await client.query(`select * from users where email = $1`, [email]);
    if(foundedUser.rowCount > 0) return res.status(200).json({ msg: "Logged in successfully", user:foundedUser.rows });
    if(foundedUser.rowCount === 0) {
       await client.query(`insert into users(name,email)values($1,$2)`,[name,email])
       let response =  await client.query(`select * from users where email = $1`,[email])
       return res.status(200).json({msg:"Logged in successfully", user:response.rows})
    }
}

const deleteUser = async (req, res)=>{
    let {id} = req.params
    let {token} = req.headers

    let admin = await client.query(`select * from admin where id = $1`, [jwt.verify(token, process.env.SECRET_KEY)])
    if(admin.rowCount === 0) return;
    
    let foundedUser = await client.query(`select * from users where id = $1`, [id]);

    if(!foundedUser) return res.status(404).json({msg:"User not found"}) 
    
    await client.query(`delete from calculations where user_id = $1`, [id])
    await client.query(`delete from saved_houses where user_id = $1   `, [id])
    await client.query(`delete from users where id = $1`, [id])

    res.send("Removed!")
}

const saveUserHouses = async (req,res) =>{
    let {id} = req.params
    let {company_id, complex_id, room_id, bank_id, duration, user_id} = req.body
    try {
        await client.query(
          `INSERT INTO saved_houses(company_id, complex_id, room_id, bank_id, user_id, duration)VALUES($1,$2,$3,$4,$5,$6)`,
          [company_id, complex_id, room_id, bank_id, user_id, duration]
        );
        res.status(200).send("Saved successfully")
    } catch (error) {
        console.log(error);
        res.status(400).send("Saving failed")
    }
}

const getUserHouses = async (req,res) =>{
    let {id} = req.params   
    let data = await client.query(
      `SELECT u.name, cpy.name company_name, cpx.name complex_name, cpx.address complex_address, r.number_of_rooms, r.price, r.kv, b.name, sh.duration, sh.id FROM saved_houses sh JOIN users u ON sh.user_id = u.id JOIN company cpy ON sh.company_id = cpy.id JOIN complex cpx ON sh.complex_id = cpx.id JOIN room r ON sh.room_id = r.id JOIN banks b ON sh.bank_id = b.id WHERE u.id = $1`,[id]
    );
    if(data.rowCount === 0) return res.status(404).send("No saved houeses found")

    res.status(200).json({houses:data.rows})
}

const deleteUserHouse = async (req,res) =>{
    let {id} = req.params
    await client.query(`delete from saved_houses where id = $1`, [id]);
    res.send("Deleted")
}

module.exports = {getAllUsers, loginUser, deleteUser, saveUserHouses, getUserHouses,deleteUserHouse}