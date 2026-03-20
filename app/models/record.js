
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecordSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "active",
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const RecordModel = mongoose.model("record", RecordSchema);

module.exports = RecordModel;