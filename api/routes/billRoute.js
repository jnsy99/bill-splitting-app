const router = require("express").Router();
const {
  createBill,
  getBills,
  updateBill,
  deleteBill,
  updateSplitOption,
  addBill,
} = require("../controllers/billController");

router.put("/bill/createBill/:id", createBill);
router.get("/bill/getBills/:id", getBills);
router.put("/bill/updateBill/:payeeId/:itemId", updateBill);
router.delete("/bill/deleteBill/:payeeId/:itemId", deleteBill);
router.put("/bill/updateSplitOption/:id", updateSplitOption);
router.post("/bill/addBill", addBill);

module.exports = router;
