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
    if(foundedUser.rowCount === 0) await client.query(`insert into users(name,email)values($1,$2)`,[name,email])
    else return;

    res.status(200).json({msg:"Logged in successfully"})
}

const deleteUser = async (req, res)=>{
    let {id} = req.params
    let {token} = req.headers

    let admin = await client.query(`select * from admin where id = $1`, [jwt.verify(token,process.env.SECRET_KEY)])
    if(admin.rowCount === 0) return;
    
    let foundedUser = await client.query(`select * from users where id = $1`, [id]);

    if(!foundedUser) return res.status(404).json({msg:"User not found"}) 
    
    await client.query(`delete from users where id = $1`, [id])

    res.send("Removed!")
}

module.exports = {getAllUsers, loginUser, deleteUser}