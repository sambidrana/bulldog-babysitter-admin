import mongoose, {model, models, Schema } from "mongoose";

const BoardingSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    petAge: { type: String, required: true },
    chipNumber: { type: String },
    vaccines: { type: String },
    petNotes: { type: String },
    userId: { type: String, ref: "UserBooking" },
  },
  {
    timestamps: true,
  }
);

export const Boarding = models.Boarding || model("Boarding", BoardingSchema);
