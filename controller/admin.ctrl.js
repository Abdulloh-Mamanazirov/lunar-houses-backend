let client = require("../utils/config")
let jwt = require("jsonwebtoken")

let loginAdmin = async (req, res) => {
    let {username, password} = req.body
    
    let admin = await client.query(`select * from admin where username = $1`, [username])
    if (admin.rowCount === 0) return res.status(404).json({msg:"Admin not found"})
    if (admin.rows[0].password !== password) return res.status(400).json({ msg: "Password incorrect" });
    
    res.status(200).json({ msg: "Logged in successfully", token: jwt.sign(admin.rows[0].id, process.env.SECRET_KEY, {}) });
}

module.exports = { loginAdmin }