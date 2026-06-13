const mongoose = require("mongoose");

const BlacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

BlacklistTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistToken", BlacklistTokenSchema);
