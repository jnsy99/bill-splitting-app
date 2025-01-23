const serverError = require("../utils/serverError");
const CustomBill = require("../models/CustomBill");

const getCustomBill = (req, res) => {
    CustomBill.findOne({ id: req.params.id })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => serverError(res));
};

module.exports = { getCustomBill };
