import { UserBooking } from "@/models/UserBooking";
import { Boarding } from "@/models/Boarding";
import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import nodemailer from "nodemailer";
import dayjs from "dayjs"; // Import dayjs

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
      // Extract 'id' and the rest of the fields from req.body
      const { id, startDate, endDate, startTime, endTime, ...updateData } =
        req.body;
      // console.log(
      //   `Line 131 : id: ${id}, updateData: ${JSON.stringif(updateData)}`
      // );
      console.log(
        `Line 132 : startDate: ${startDate}, endDate: ${endDate}, startTime: ${startTime}, endTime: ${endTime}`
      );

      const formattedStartDate = dayjs(startDate, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      const formattedEndDate = dayjs(endDate, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      const formattedStartTime = dayjs(startTime, "HH:mm").isValid()
        ? dayjs(startTime, "HH:mm").format("HH:mm")
        : startTime;
      const formattedEndTime = dayjs(endTime, "HH:mm").isValid()
        ? dayjs(endTime, "HH:mm").format("HH:mm")
        : endTime;

      console.log(
        `Line 139 : formattedStartDate: ${formattedStartDate}, formattedEndDate: ${formattedEndDate}, formattedStartTime: ${formattedStartTime}, formattedEndTime: ${formattedEndTime}`
      );

      // Include the formatted values in updateData
      updateData.startDate = formattedStartDate;
      updateData.endDate = formattedEndDate;
      updateData.startTime = formattedStartTime;
      updateData.endTime = formattedEndTime;

      const updateBooking = await UserBooking.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

      if (!updateBooking) {
        return res
          .status(404)
          .json({ error: "Error updating booking, please try again later" });
      }

      // 📧 Send email to user after successful update
      const boardingInfo = await Boarding.findOne({
        userId: updateBooking.userId,
      });
      if (boardingInfo) {
        await sendEditedConfirmationEmail(boardingInfo.email, updateBooking);
      }

      // Send back the updated booking data as the response
      return res.json(updateBooking); // This sends the updated data back to the client
    } catch (error) {
      console.error("Error in PATCH handler:", error.message);
      console.error(error.stack); // Log the stack trace
      res.status(500).json({ error: "Failed to update booking details." });
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
