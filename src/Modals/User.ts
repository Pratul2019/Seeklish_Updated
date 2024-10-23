import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    connectpostrental: {
      type: Array,
      default: [],
    },
    connectpostdiscover: {
      type: Array,
      default: [],
    },
    connectpostapplication: {
      type: Array,
      default: [],
    },
    isdeleteuserrequest: {
      type: Boolean,
      default: false
    },
    audience: {
      type: Map,
      of: new Schema({
        name: String,
        image: String,
      }, { _id: false }),
      default: {},
    },
    connections: {
      type: Map,
      of: new Schema({
        name: String,
        image: String,
        isallowed: {
          type: Boolean,
        },
      }, { _id: false }),
      default: {},
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", schema);

export default UserModel;
