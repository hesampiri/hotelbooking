import { Schema, model, models } from "mongoose";

const RoomSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    capacity: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    size: Number, // m²
    beds: [
      {
        type: {
          type: String,
          enum: ["King", "Queen", "Twin", "Sofa Bed"],
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],

    pricePerNight: {
      type: Number,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    amenities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default models.Room || model("Room", RoomSchema);
