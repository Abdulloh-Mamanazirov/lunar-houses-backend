const client = require("../utils/config")

const getBank = async (req,res)=>{
    let {totalPrice} = req.body
    let bank = await client.query(`select * from banks where max_loan > $1`,[totalPrice]);
    res.send(bank.rows[0])
}
 
const doCalculation = async(req,res) => {
    let {roomP,roomKv,sp, d} = req.body
    d=d*1
    let data = await client.query(`SELECT calculator($1::integer,$2::integer,$3::integer,$4::integer)`,[roomP,roomKv,sp,d])
    if(data.rowCount === 0)return res.status(400).json({msg:"Calculation failed"})

    return res.status(200).json({data:data.rows, msg:"Calculated successfully"})
}

const saveCalculation = async (req,res) => {
    let { user_id, total, starting, monthly } = req.body;
    try {
        let response = await client.query(`INSERT INTO calculations(total, starting, monthly, user_id)VALUES($1,$2,$3,$4)`,[total,starting, monthly, user_id])
        if(response.rowCount > 0) return res.status(200).send("House saved");
    } catch (error) {
        res.status(400).send("Admins cannot save");
    }
}

module.exports = {getBank,doCalculation,saveCalculation}