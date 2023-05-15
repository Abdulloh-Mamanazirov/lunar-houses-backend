const client = require("../utils/config")

const getBank = async (req,res)=>{
    let {totalPrice} = req.body
    let bank = await client.query(`select * from banks where max_loan > $1`,[totalPrice]);
    res.send(bank.rows[0])
}

module.exports = {getBank}