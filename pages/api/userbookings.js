import { UserBooking } from "@/models/UserBooking";
import { Boarding } from "@/models/Boarding";
import { DateTimeSettings } from "@/models/DateTimeSettings";
import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import nodemailer from "nodemailer";
import dayjs from "dayjs"; // Import dayjs
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

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

async function sendMyselfConfirmationEmail(userEmail, booking) {
  let mailOptions = {
    from: process.env.WORK_EMAIL,
    to: process.env.WORK_EMAIL,
    subject: "📢 New Booking Received – Admin Notification",
    html: `
      <p>Hello Admin,</p>
      <p>A new booking has been made via the website. Here are the details:</p><br/>
      <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
        <tr>
          <td align="left"><strong>📧 Client Email:</strong></td>
          <td align="left">${userEmail}</td>
        </tr>
        <tr>
          <td align="left"><strong>📅 Start Date:</strong></td>
          <td align="left">${booking.startDate}</td>
        </tr>
        <tr>
          <td align="left"><strong>📅 End Date:</strong></td>
          <td align="left">${booking.endDate}</td>
        </tr>
        <tr>
          <td align="left"><strong>🕒 Start Time:</strong></td>
          <td align="left">${booking.startTime}</td>
        </tr>
        <tr>
          <td align="left"><strong>🕒 End Time:</strong></td>
          <td align="left">${booking.endTime}</td>
        </tr>
        <tr>
          <td align="left"><strong>🚗 Pickup Required:</strong></td>
          <td align="left">${booking.requirePickup ? "Yes" : "No"}</td>
        </tr>
      </table>
      <br/>
      <br/>
      <p>— Bulldog Babysitter Booking System 🐶</p>
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

/*
 * Check if any date in booking range overlaps with disabled dates
 * @param {string} start - in format 'DD/MM/YYYY'
 * @param {string} end - in format 'DD/MM/YYYY'
 * @param {Array<Date>} disabledDates - array of JS Date objects
 * @returns {boolean} true if booking is invalid (conflicts)
 */

function formatToISODate(date) {
  return new Date(date).toISOString().split("T")[0];
}

function parseDateString(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

function isBookingDateInvalid(start, end, disabledDates) {
  console.log(".....................................................");
  console.log("Start:", start, "End:", end);

  const disabledSet = new Set(disabledDates.map(formatToISODate));
  console.log("Disabled Dates:", Array.from(disabledSet));

  const startDate = parseDateString(start);
  const endDate = parseDateString(end);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isoDate = formatToISODate(currentDate);
    console.log("🔍 Checking:", isoDate);

    if (disabledSet.has(isoDate)) {
      console.log("❌ Cannot book – clashes with disabled date:", isoDate);
      return true; // Conflict found
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("✅ No clash with disabled dates. Booking allowed.");
  return false; // No conflict
}

function calculateDaysAndHours(startDate, startTime, endDate, endTime) {
  const parse = (d, t) => {
    const [day, month, year] = d.split("/");
    const [hour, minute] = t.split(":");
    return new Date(year, month - 1, day, hour, minute).getTime();
  };

  const start = parse(startDate, startTime);
  const end = parse(endDate, endTime);
  const diff = end - start;

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const millisecondsInHour = 1000 * 60 * 60;

  const totalDays = Math.floor(diff / millisecondsInDay);
  const totalHours = Math.floor(
    (diff % millisecondsInDay) / millisecondsInHour
  );

  return { totalDays, totalHours };
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
      console.log("Data received", req.body);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);

      const settings = await DateTimeSettings.findOne();
      const disabledDates = settings?.disabledDates || [];
      console.log(disabledDates);

      const conflict = isBookingDateInvalid(startDate, endDate, disabledDates);

      if (conflict) {
        return res.status(400).json({
          error:
            "The booking dates you selected clash with dates when the owner is not accepting bookings. Please select another date.",
        });
      }

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
      await sendMyselfConfirmationEmail(userEmail, userBookingInfo);
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

      const updateData = {};

      // Format and assign only if values exist
      if (rawData.startDate) {
        updateData.startDate = dayjs(rawData.startDate, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
      }

      if (rawData.endDate) {
        updateData.endDate = dayjs(rawData.endDate, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
      }

      if (
        rawData.startTime &&
        dayjs(rawData.startTime, "HH:mm", true).isValid()
      ) {
        updateData.startTime = dayjs(rawData.startTime, "HH:mm").format(
          "HH:mm"
        );
      }

      if (rawData.endTime && dayjs(rawData.endTime, "HH:mm", true).isValid()) {
        updateData.endTime = dayjs(rawData.endTime, "HH:mm").format("HH:mm");
      }

      // Add other fields as-is (e.g., requirePickup)
      Object.keys(rawData).forEach((key) => {
        if (!["startDate", "endDate", "startTime", "endTime"].includes(key)) {
          updateData[key] = rawData[key];
        }
      });

      // 👉 Recalculate totalDays and totalHours if date/time has changed
      const hasDateOrTimeChanged =
        updateData.startDate ||
        updateData.endDate ||
        updateData.startTime ||
        updateData.endTime;

      if (hasDateOrTimeChanged) {
        const existingBooking = await UserBooking.findById(id);
        const finalStartDate =
          updateData.startDate || existingBooking.startDate;
        const finalEndDate = updateData.endDate || existingBooking.endDate;
        const finalStartTime =
          updateData.startTime || existingBooking.startTime;
        const finalEndTime = updateData.endTime || existingBooking.endTime;

        // Calculate totalDays and totalHours
        const parse = (d, t) => {
          const [day, month, year] = d.split("/");
          const [hour, minute] = t.split(":");
          return new Date(year, month - 1, day, hour, minute).getTime();
        };

        const start = parse(finalStartDate, finalStartTime);
        const end = parse(finalEndDate, finalEndTime);
        const diff = end - start;

        const millisecondsInDay = 1000 * 60 * 60 * 24;
        const millisecondsInHour = 1000 * 60 * 60;

        const totalDays = Math.floor(diff / millisecondsInDay);
        const totalHours = Math.floor(
          (diff % millisecondsInDay) / millisecondsInHour
        );

        updateData.totalDays = totalDays;
        updateData.totalHours = totalHours;

        console.log(
          "📅 Recalculated:",
          totalDays,
          "days and",
          totalHours,
          "hours"
        );
      }

      console.log("✅ Final updateData before DB save:", updateData);

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

      const boardingInfo = await Boarding.findOne({
        userId: updateBooking.userId,
      });

      if (boardingInfo) {
        await sendEditedConfirmationEmail(boardingInfo.email, updateBooking);
      }

      return res.json(updateBooking);
    } catch (error) {
      console.error("Error in PATCH handler:", error.message);
      console.error(error.stack);
      return res
        .status(500)
        .json({ error: "Failed to update booking details." });
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await UserBooking.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
