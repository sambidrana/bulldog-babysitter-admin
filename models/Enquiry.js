import mongoose, { model, models, Schema } from "mongoose";

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = models.Enquiry || model("Enquiry", EnquirySchema)
