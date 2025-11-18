import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CustomRoomSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    scheduleTime: { type: Date, required: true, index: true },
    maxPlayers: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["open", "closed", "ongoing"],
      default: "open",
      index: true,
    },
    clan: { type: Schema.Types.ObjectId, ref: "Clan" },
  },
  { timestamps: true }
);
type CustomRoomDoc = InferSchemaType<typeof CustomRoomSchema>;

const CustomRoomModel =
  (mongoose.models.CustomRoom as Model<CustomRoomDoc>) ||
  mongoose.model<CustomRoomDoc>("CustomRoom", CustomRoomSchema);

export default CustomRoomModel;
