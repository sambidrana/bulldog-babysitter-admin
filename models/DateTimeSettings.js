import mongoose, { model, models, Schema } from "mongoose";

const DateTimeSettingsSchema = new Schema(
  {
    disabledDates: [{ type: Date }],
    startTime: { type: String },
    endTime: { type: String }, 
  },
  {
    timestamps: true,
  }
);

export const DateTimeSettings =
  models.DateTimeSettings || model("DateTimeSettings", DateTimeSettingsSchema);
