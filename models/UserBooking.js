import mongoose, {model, models, Schema } from "mongoose";

const UserBookingSchema = new Schema(
  {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    userId: { type: String, ref:'Boarding' },
  },
  {
    timestamps: true,
  }
);

export const UserBooking =
  models.UserBooking || model("UserBooking", UserBookingSchema);
