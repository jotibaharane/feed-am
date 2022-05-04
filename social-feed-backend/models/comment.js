const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = mongoose.Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    createdBy: {
      type: String,
    },
    text: {
      type: String,
    },
    likes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);

