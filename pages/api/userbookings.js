import { UserBooking } from "@/models/UserBooking";
import { Boarding } from "@/models/Boarding";
import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";

const cors = Cors({
  origin: process.env.NEXT_PUBLIC_CORS_ORIGIN, // specify the origin you want to allow
  methods: ["GET", "POST", "DELETE"], // specify the methods you want to allow
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handleUserBooking(req, res) {
  await runMiddleware(req, res, cors);

  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        requirePickup,
        totalDays,
        totalHours,
        userId,
      } = req.body;
      console.log(totalDays);

      const userBookingInfo = await UserBooking.create({
        startDate,
        endDate,
        startTime,
        endTime,
        requirePickup,
        totalDays,
        totalHours,
        userId,
      });
      await Boarding.findOneAndUpdate(
        { userId: userId },
        {
          $inc: { bookingCount: 1, totalDaysBooked: totalDays }, // Increment bookingCount by 1
          // $inc: { totalDaysBooked: totalDays }, // Increment totalDaysBooked by the new totalDays
        }
        // { upsert: true, new: true } // Upsert option creates a new document if it doesn't exist, and new option returns the updated document
      );
      res.json(userBookingInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create User Booking." });
    }
  }
  if (method === "GET") {
    try {
      if (req.query?.id) {
        res.json(await UserBooking.findOne({ _id: req.query.id }));
      } else {
        res.json(await UserBooking.find().sort({ createdAt: -1 }));
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch boarding details." });
    }
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await UserBooking.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
