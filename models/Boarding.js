import mongoose, {model, models, Schema } from "mongoose";

const BoardingSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    petAge: { type: Date, required: true },
    chipNumber: { type: String },
    // vaccines: { type: String },
    petNotes: { type: String },
    imageUrl: {type: String},
    vaccineUrl: {type: String},
    bookingCount:{type: Number},
    totalDaysBooked: {type: Number},
    userId: { type: String, ref: "UserBooking" },
  },
  {
    timestamps: true,
  }
);

export const Boarding = models.Boarding || model("Boarding", BoardingSchema);
