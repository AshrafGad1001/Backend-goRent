import mongoose from "mongoose";

const propertyViewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

propertyViewSchema.index({ propertyId: 1, viewedAt: -1 });

const PropertyView = mongoose.model("PropertyView", propertyViewSchema);

export default PropertyView;
