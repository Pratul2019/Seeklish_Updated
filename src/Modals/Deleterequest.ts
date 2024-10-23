import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    
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
   
  },
  { timestamps: true }
);

const DeleterequestModel = mongoose.models.Deleterequest || mongoose.model("Deleterequest", schema);

export default DeleterequestModel;
