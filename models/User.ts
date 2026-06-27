import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [4, "Name must be at least 4 characters long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password must be at least 8 character"],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection:"user",
  },
);
export default models.User || model("User", UserSchema);
