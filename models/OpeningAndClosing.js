import mongoose, { model, models, Schema } from "mongoose";

const OpeningAndClosingSchema = new Schema(
  {
    // disabledDates: [{ type: Date }],
    OpeningTime: { type: String },
    ClosingTime: { type: String }, 
  },
  {
    timestamps: true,
  }
);

export const OpeningAndClosing =
  models.OpeningAndClosing || model("OpeningAndClosing", OpeningAndClosingSchema);
