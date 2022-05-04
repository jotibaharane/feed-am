const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    caption: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    likes: [
      {
        type: String,
      },
    ],
    post_created_by: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostSchema);
