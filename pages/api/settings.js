import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { DateTimeSettings } from "@/models/DateTimeSettings";

const cors = Cors({
  origin: "http://localhost:3001", // specify the origin you want to allow
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

export default async function handleSettings(req, res) {
  await runMiddleware(req, res, cors);

  // res.json(req.method) //1:05:54
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { disabledDates } = req.body;

    const settingsDoc = await DateTimeSettings.create({
      disabledDates,
    });
    res.json(settingsDoc);
  }

  try {
    const { newDisabledDate } = req.body;

    let update;
    if (Array.isArray(newDisabledDate)) {
      // If newDisabledDate is an array, add all elements to the set
      update = { $addToSet: { disabledDates: { $each: newDisabledDate } } };
    } else {
      // If newDisabledDate is a single value, add it to the set
      update = { $addToSet: { disabledDates: newDisabledDate } };
    }

    const updatedSettings = await DateTimeSettings.findOneAndUpdate(
      {},
      update,
      { new: true, upsert: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  if (method === "GET") {
    try {
      const settings = await DateTimeSettings.find().sort({ createdAt: -1 });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  if (method === "DELETE") {
    try {
      const { dateToEnable } = req.body;

      // Assuming there's only one settings document to update
      const updatedSettings = await DateTimeSettings.findOneAndUpdate(
        {},
        { $pull: { disabledDates: dateToEnable } }, // $pull removes the value from the array
        { new: true }
      );
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
