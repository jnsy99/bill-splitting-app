const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customModel = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    items: [
      {
        uid: String,
        cost: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("customBill", customModel);
