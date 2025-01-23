const router = require("express").Router();
const { getCustomBill } = require("../controllers/customBill");

router.get("/bill/getCustomBill/:id", getCustomBill);

module.exports = router;
