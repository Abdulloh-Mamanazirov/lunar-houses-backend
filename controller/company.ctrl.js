const Joi = require("joi");
const jwt = require("jsonwebtoken");
const client = require("../utils/config");

const getCompanies = async (req, res) => {
  let companies = await client.query(`select * from company`);
  res.json(companies);
};

const getOneCompany = async (req, res) => {
  let { id } = req.params;
  let company = await client.query(`select * from company where id = $1`, [id]);
  if (company.rowCount === 0) return res.send("Compnay not found!");
  res.json(company.rows);
};

const addCompany = async (req, res) => {
  let { name, image } = req.body;
  let { token } = req.headers;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedCompany = await client.query(
    `select * from company where name = $1`,
    [name]
  );

  if (foundedCompany.rowCount > 0)
    return res.status(400).send("This company name already exists");

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    image: Joi.string().required(),
  });
  let { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error);

  await client.query(
    `INSERT INTO company(name, image, created_by_id)VALUES($1,$2,$3)`,
    [name, image, jwt.verify(token, process.env.SECRET_KEY)]
  );

  res.status(200).send("Added successfully");
};

const deleteCompany = async (req, res) => {
  let { token } = req.headers;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedCompany = await client.query(`select * from company where id = $1`, [
    id,
  ]);
  if (foundedCompany.rowCount === 0)
    return res.status(404).send("Company not found");
  
  await client.query(`DELETE FROM room WHERE company_id = $1`, [id]);
  await client.query(`DELETE FROM complex WHERE company_id = $1`, [id]);
  await client.query(`DELETE FROM company WHERE id = $1`, [id]);

  res.send("Deleted!");
};

const updateCompany = async (req, res) => {
  let { token } = req.headers;
  let { name } = req.body;
  let { id } = req.params;

  try {
    jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Invalid token");
  }

  let foundedCompany = await client.query(`select * from company where id = $1`, [id]);
  if (foundedCompany.rowCount === 0)
    return res.status(404).send("Company not found");

  if (!name) return res.status(400).send("Please fill the input")
  if (name?.length < 3) return res.status(400).send("Name should be at least 3 characters long")
  
  name = name ? name : foundedCompany.rows[0].name;
  
  try {
    await client.query(`update company set name = $1 where id = $2`, [name, id]);
    res.status(200).send("Updated successfully!");
  } catch (error) {
    res.send("Please check the input and try again")
  }
};

module.exports = { getCompanies, getOneCompany, addCompany, deleteCompany, updateCompany };