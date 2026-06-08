import mongoose from "mongoose";

const viewingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Index for tenants to see their upcoming or past viewing appointments
viewingSchema.index({ tenantId: 1, scheduledAt: 1 });

// Index for owners to see their agenda/viewing schedule
viewingSchema.index({ ownerId: 1, scheduledAt: 1 });

// Index for checking all viewings booked for a specific property
viewingSchema.index({ propertyId: 1, status: 1 });

const Viewing = mongoose.model("Viewing", viewingSchema);

module.exports = Viewing;
