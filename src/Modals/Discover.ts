import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      ref: "users",
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const connectionpostSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    discoverName: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    discoverImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    discoverName: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    discoverImage: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    comment: [commentSchema],
    connectionpost: [connectionpostSchema],
  },
  { timestamps: true }
);

const DiscoverModel =
  mongoose.models.Discover || mongoose.model("Discover", schema);

export default DiscoverModel;
