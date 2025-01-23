const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const billModel = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    splitOption: String,
    items: [
      {
        name: String,
        cost: Number,
        qty: Number,
        uid: [
          {
            type: String,
            default: "-",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("bill", billModel);
