let express = require("express")
const { getComplexes, addComplex, deleteComplex, getOneCompanyComplexes, updateComplex } = require("../controller/complex.ctrl")

let complexRouter = express.Router()

complexRouter.get("/complexes", getComplexes)
complexRouter.get("/complexes/:id", getOneCompanyComplexes)
complexRouter.post("/add-complex", addComplex)
complexRouter.delete("/delete-complex/:id", deleteComplex)
complexRouter.put("/update-complex/:id", updateComplex)

module.exports = complexRouter