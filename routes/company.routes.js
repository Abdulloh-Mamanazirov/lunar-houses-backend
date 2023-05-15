let express = require("express")
const { getCompanies, addCompany, deleteCompany, getOneCompany, updateCompany } = require("../controller/company.ctrl")

let companyRouter = express.Router()

companyRouter.get("/companies", getCompanies)
companyRouter.get("/companies/:id", getOneCompany)
companyRouter.post("/add-company", addCompany)
companyRouter.delete("/delete-company/:id", deleteCompany)
companyRouter.put("/update-company/:id", updateCompany)

module.exports = companyRouter