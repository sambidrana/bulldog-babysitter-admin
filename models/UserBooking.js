import mongoose, { model, models, Schema } from "mongoose";

const UserBookingSchema = new Schema(
  {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    requirePickup: { type: Boolean },
    totalDays: {type: Number},
    totalHours: {type: Number},
    userId: { type: String, ref: "Boarding" },
  },
  {
    timestamps: true,
  }
);

export const UserBooking =
  models.UserBooking || model("UserBooking", UserBookingSchema);
