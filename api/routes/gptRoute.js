const router = require("express").Router();
const {
  processWithOpenAI,
  splitWithAi,
} = require("../controllers/gptController");

router.post("/ai/processWithOpenAI", processWithOpenAI);
router.post("/ai/splitWithAi", splitWithAi);

module.exports = router;
