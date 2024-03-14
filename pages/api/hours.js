import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { OpeningAndClosing } from "@/models/OpeningAndClosing";

const cors = Cors({
  origin: process.env.NEXT_PUBLIC_CORS_ORIGIN, // specify the origin you want to allow
  methods: ["GET"], // specify the methods you want to allow
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

export default async function handleHoursSettings(req, res) {
  await runMiddleware(req, res, cors);

  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { OpeningTime, ClosingTime } = req.body;

    // This query condition could be adjusted based on your requirements.
    const queryCondition = {}; // Empty condition to match the first document found.

    const update = {
      OpeningTime,
      ClosingTime,
    };

    const options = {
      upsert: true, // Create a new document if one doesn't exist.
      new: true, // Return the updated document.
      setDefaultsOnInsert: true, // Use model's defaults if creating a new doc.
    };

    try {
      const hoursDoc = await OpeningAndClosing.findOneAndUpdate(
        queryCondition,
        update,
        options
      );
      res.status(200).json(hoursDoc);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to save opening and closing times." });
    }
  }

  // Handling GET request
  else if (method === "GET") {
    try {
      const timings = await OpeningAndClosing.find().sort({ createdAt: -1 });
      res.status(200).json(timings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Handling unexpected methods
  else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
