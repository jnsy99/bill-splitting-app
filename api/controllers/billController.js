const serverError = require("../utils/serverError");
const BillModel = require("../models/BillModel");

const addBill = async (req, res) => {
  const { id, items } = req.body;
  if (items.length) {
    await BillModel.deleteMany({ id });
    BillModel.create({ id, items })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(() => {
        serverError(res);
      });
  } else {
    res.status(404).json({ message: "Items not found!" });
  }
};

const createBill = (req, res) => {
  const { name, cost, qty } = req.body;
  BillModel.findOneAndUpdate(
    { id: req.params.id },
    { $push: { items: { name, cost, qty } } },
    { new: true }
  )
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "Bill not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

const getBills = (req, res) => {
  BillModel.findOne({ id: req.params.id })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => serverError(res));
};

const updateBill = (req, res) => {
  const { payeeId, itemId } = req.params;
  const { name, cost, uid, qty } = req.body;
  BillModel.findOne({ id: payeeId, "items._id": itemId })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Item not found" });
      }

      const item = doc.items.find((item) => item._id.toString() === itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const uidExists = item.uid.includes(uid);
      const canAddUid = item.qty > item.uid.length;

      const update = uidExists
        ? {
            $pull: { "items.$.uid": uid },
          }
        : canAddUid
        ? {
            $push: { "items.$.uid": uid },
          }
        : {};

      return BillModel.findOneAndUpdate(
        { id: payeeId, "items._id": itemId },
        {
          $set: {
            "items.$.name": name,
            "items.$.cost": cost,
            "items.$.qty": qty,
          },
          ...update,
        },
        { new: true }
      );
    })
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    })
    .catch(() => serverError(res));
};

const deleteBill = (req, res) => {
  const { payeeId, itemId } = req.params;
  BillModel.findOneAndUpdate(
    { id: payeeId },
    { $pull: { items: { _id: itemId } } },
    { new: true }
  )
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    })
    .catch(() => serverError(res));
};

const updateSplitOption = (req, res) => {
  const { id } = req.params;
  const { splitOption } = req.body;
  BillModel.findOneAndUpdate({ id }, { splitOption }, { new: true })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => serverError(res));
};

const deleteExpiredDocuments = async () => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  await BillModel.deleteMany({
    createdAt: { $lt: cutoffDate },
  });
};
setInterval(deleteExpiredDocuments, 60 * 60 * 1000);

module.exports = {
  createBill,
  getBills,
  updateBill,
  deleteBill,
  updateSplitOption,
  addBill,
};
