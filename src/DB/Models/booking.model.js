import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate payment tracking records
      trim: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "RESERVED", "CANCELLED"],
      default: "PENDING_PAYMENT",
    },
    contractPdfUrl: {
      type: String,
      default: "", // Optional until generated
    },
    signatures: {
      tenantSigned: {
        type: Boolean,
        default: false,
      },
      ownerSigned: {
        type: Boolean,
        default: false,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Indexes for optimizing lookups in dashboard views
bookingSchema.index({ tenantId: 1, status: 1 });
bookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
