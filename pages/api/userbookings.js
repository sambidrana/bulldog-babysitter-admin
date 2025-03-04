import { UserBooking } from "@/models/UserBooking";
import { Boarding } from "@/models/Boarding";
import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import nodemailer from "nodemailer";

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

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.WORK_EMAIL,
    pass: process.env.WORK_EMAIL_PASS,
  },
});

async function sendBookingConfirmationEmail(userEmail, booking) {
  let mailOptions = {
    from: process.env.WORK_EMAIL,
    to: userEmail,
    subject: "Booking Confirmation - The Bulldog Babysitter",
    html: `
      <p>Hello,</p>
      <p>Your booking has been confirmed! 🎉</p><br/>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="5">
      <tr>
        <td align="left"><strong>📅 Start Date:</strong> ${
          booking.startDate
        }</td>
        <td align="left"><strong>📅 End Date:</strong> ${booking.endDate}</td>
      </tr>
      <tr>
        <td align="left"><strong>🕒 Time:</strong> ${booking.startTime} - ${
      booking.endTime
    }</td>
        <td align="left"><strong>🚗 Pickup Required:</strong> ${
          booking.requirePickup ? "Yes" : "No"
        }</td>
      </tr>
    </table>


      <br/><p>Thank you for booking with The Bulldog Babysitter! 🐶</p>

      <br/><p>Best,<br/>Jacki and John</p>


      <br/><p style="color: red;"><strong>📌  Please note:</strong> If you haven't boarded with us before, your booking may be subject to review and potential cancellation.</p>

    `,
  };

  await transporter.sendMail(mailOptions);
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
      // console.log(totalDays);

      //  Fetch user's email from Boarding collection
      const boardingInfo = await Boarding.findOne({ userId });

      if (!boardingInfo) {
        return res
          .status(404)
          .json({ error: "User boarding information not found." });
      }

      const userEmail = boardingInfo.email;

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

      // await sendBookingConfirmationEmail(userEmail, userBookingInfo);

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