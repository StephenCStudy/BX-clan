import mongoose, { Schema } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customRoom: {
      type: Schema.Types.ObjectId,
      ref: "CustomRoom",
      required: true,
      index: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ customRoom: 1, createdAt: -1 });

export default mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);
