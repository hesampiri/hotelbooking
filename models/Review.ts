import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Review || model("Review", ReviewSchema);
