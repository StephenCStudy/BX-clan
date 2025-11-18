import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    ingameName: { type: String, required: true },
    role: {
      type: String,
      enum: ["leader", "organizer", "moderator", "member"],
      default: "member",
      index: true,
    },
    avatarUrl: { type: String },
    clan: { type: Schema.Types.ObjectId, ref: "Clan", index: true },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
type UserDoc = InferSchemaType<typeof UserSchema>;

const UserModel =
  (mongoose.models.User as Model<UserDoc>) ||
  mongoose.model<UserDoc>("User", UserSchema);

export default UserModel;
