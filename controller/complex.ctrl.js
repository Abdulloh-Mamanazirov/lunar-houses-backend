const Joi = require("joi");
const jwt = require("jsonwebtoken");
const client = require("../utils/config");

const getComplexes = async (req, res) => {
  let complexes = await client.query(
    `SELECT c.name as company_name, com.company_id as company_id, com.id as complex_id, com.name as complex_name, com.address FROM company c JOIN complex com ON c.id = com.company_id`
  );
  res.json(complexes.rows);
};

const getOneCompanyComplexes = async (req, res) => {
  let { id } = req.params;
  let complex = await client.query(
    `select * from complex where company_id =  $1`,
    [id]
  );
  if (complex.rowCount === 0) return res.send("Complex not found!");
  res.json(complex.rows);
};

const addComplex = async (req, res) => {
  let { name, address, company } = req.body;
  let { token } = req.headers;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedComplex = await client.query(
    `select * from complex where name = $1`,
    [name]
  );
  let company_id = await client.query(`select * from company where name = $1`, [
    company,
  ]);

  if (foundedComplex.rowCount > 0)
    return res.status(400).send("This complex name already exists");

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    address: Joi.string().min(3).max(50).required(),
    company: Joi.string().required(),
  });
  let { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error);

  await client.query(
    `INSERT INTO complex(name,address,company_id)VALUES($1,$2,$3)`,
    [name, address, company_id.rows[0].id]
  );

  res.status(200).send("Complex added successfully");
};

const deleteComplex = async (req, res) => {
  let { token } = req.headers;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedComplex = client.query(`select * from complex where id = $1`, [
    id,
  ]);
  if (foundedComplex.rowCount === 0)
    return res.status(404).send("Complex not found");

  await client.query(`DELETE FROM complex WHERE id = $1`, [id]);

  res.send("Deleted!");
};

const updateComplex = async (req, res) => {
  let { token } = req.headers;
  let { name, address } = req.body;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedComplex = await client.query(`select * from complex where id = $1`, [
    id,
  ]);
  if (foundedComplex.rowCount === 0)
    return res.status(404).send("Complex not found");

  if (name?.length < 3)
    return res.status(400).send("Name should be at least 3 characters long");

  name = name ? name : foundedComplex.rows[0].name;
  address = address ? address : foundedComplex.rows[0].address;

  try {
    await client.query(`update complex set name = $1, address = $2 where id = $3`, [
      name,
      address,
      id,
    ]);
    res.status(200).send("Updated successfully!");
  } catch (error) {
    res.send("Please check the input and try again");
  }
};

module.exports = { getComplexes, getOneCompanyComplexes, addComplex, deleteComplex, updateComplex };
