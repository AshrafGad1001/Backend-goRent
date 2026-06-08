import mongoose from "mongoose";
const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "APPROVE_LISTING",
        "REJECT_LISTING",
        "BAN_USER",
        "UNBAN_USER",
        "RESOLVE_DISPUTE",
      ],
      required: true,
    },
    // ID of the document being acted upon (e.g., a specific Property ID or User ID)
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // Explicitly defines which collection targetId belongs to
    targetType: {
      type: String,
      enum: ["PROPERTY", "USER", "BOOKING"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    // Admin logs are historical records; they are written once and never updated.
    // Disabling updatedAt saves database overhead.
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Index to track an individual admin's activity history sorted by newest first
adminLogSchema.index({ adminId: 1, createdAt: -1 });

// Compound index to quickly find all actions taken against a specific item or user
// (e.g., "Show me the moderation history for Property X")
adminLogSchema.index({ targetId: 1, targetType: 1, createdAt: -1 });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

module.exports = AdminLog;
