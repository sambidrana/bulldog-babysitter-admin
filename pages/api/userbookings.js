import { UserBooking } from "@/models/UserBooking";
import { Boarding } from "@/models/Boarding";
import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import nodemailer from "nodemailer";
import dayjs from "dayjs"; // Import dayjs
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// import mongoose from "mongoose";

const cors = Cors({
  origin: process.env.NEXT_PUBLIC_CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
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
        <td align="left"><strong>🕒 Start Time:</strong> ${booking.startTime}
        <td align="left"><strong>🕒 End Time:</strong>  ${booking.endTime}
        </tr>
        <tr>
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

async function sendEditedConfirmationEmail(userEmail, booking) {
  let mailOptions = {
    from: process.env.WORK_EMAIL,
    to: userEmail,
    subject: "Booking Date/Time Changed - The Bulldog Babysitter",
    html: `
      <p>Hello,</p>
      <p>Your booking date and/or time has been changed with the Bulldog Babysitter! Please reach out to us if the new date/time needs to be discussed with us </p><br/>
      <table width="100%" border="0" cellspacing="0" cellpadding="5">
        <tr>
          <td align="left"><strong>📅 Start Date:</strong> ${booking.startDate}</td>
          <td align="left"><strong>📅 End Date:</strong> ${booking.endDate}</td>
        </tr>
        <tr>
          <td align="left"><strong>🕒 Start Time:</strong> ${booking.startTime}
          <td align="left"><strong>🕒 End Time:</strong>  ${booking.endTime}

        </tr>


      </table>
      <br/><p>Thank you for booking with The Bulldog Babysitter! 🐶</p>
      <br/><p>Best,<br/>Jacki and John</p>
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
        { $inc: { bookingCount: 1, totalDaysBooked: totalDays } }
      );
      await sendBookingConfirmationEmail(userEmail, userBookingInfo);
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

  if (method === "PATCH") {
    try {
      const { id, ...rawData } = req.body;
      console.log("🔥 RAW req.body:", req.body);
      console.log("🔍 rawData.endTime:", rawData.endTime);

      console.log("🧪 dayjs valid?", dayjs(rawData.endTime, "HH:mm", true).isValid());

      const updateData = {};
  
      // Format and assign only if values exist
      if (rawData.startDate) {
        updateData.startDate = dayjs(rawData.startDate, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
  
      if (rawData.endDate) {
        updateData.endDate = dayjs(rawData.endDate, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
  
      if (rawData.startTime && dayjs(rawData.startTime, "HH:mm", true).isValid()) {
        updateData.startTime = dayjs(rawData.startTime, "HH:mm").format("HH:mm");
      }
  
      if (rawData.endTime && dayjs(rawData.endTime, "HH:mm", true).isValid()) {
        updateData.endTime = dayjs(rawData.endTime, "HH:mm").format("HH:mm");
      }
  
      // Add other fields as-is (e.g., requirePickup, totalHours, etc.)
      Object.keys(rawData).forEach((key) => {
        if (!["startDate", "endDate", "startTime", "endTime"].includes(key)) {
          updateData[key] = rawData[key];
        }
      });
  
      console.log("✅ Final updateData before DB save:", updateData);
  
      const updateBooking = await UserBooking.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updateBooking) {
        return res.status(404).json({ error: "Error updating booking, please try again later" });
      }
  
      const boardingInfo = await Boarding.findOne({ userId: updateBooking.userId });
  
      if (boardingInfo) {
        await sendEditedConfirmationEmail(boardingInfo.email, updateBooking);
      }
  
      return res.json(updateBooking);
    } catch (error) {
      console.error("Error in PATCH handler:", error.message);
      console.error(error.stack);
      return res.status(500).json({ error: "Failed to update booking details." });
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await UserBooking.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

// if (method === "PUT") {
//   try {
//     const { id } = req.query;
//     console.log("Received booking ID:", id);

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid Booking ID" });
//     }

//     const objectId = new mongoose.Types.ObjectId(id); // Convert to ObjectId
//     const updateData = req.body;

//     const updatedBooking = await UserBooking.findByIdAndUpdate(objectId, updateData, { new: true });

//     if (!updatedBooking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     const boardingInfo = await Boarding.findOne({ userId: updatedBooking.userId });

//     if (boardingInfo) {
//       await sendBookingConfirmationEmail(boardingInfo.email, updatedBooking);
//     }

//     res.json(updatedBooking);
//   } catch (error) {
//     console.error("Error updating booking:", error);
//     res.status(500).json({ error: "Failed to update booking" });
//   }
// }
