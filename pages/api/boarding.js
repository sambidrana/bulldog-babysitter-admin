import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { Boarding } from "@/models/Boarding";

const cors = Cors({
  origin: process.env.NEXT_PUBLIC_CORS_ORIGIN, // specify the origin you want to allow
  methods: ["POST"], // specify the methods you want to allow
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

export default async function handleBoarding(req, res) {
  await runMiddleware(req, res, cors);

  // res.json(req.method) //1:05:54
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const {
      firstName,
      lastName,
      phone,
      email,
      petName,
      petType,
      petAge,
      chipNumber,
      vaccines,
      petNotes,
      imageUrl,
      userId,
    } = req.body;

    const boardingDoc = await Boarding.create({
      firstName,
      lastName,
      phone,
      email,
      petName,
      petType,
      petAge,
      chipNumber,
      vaccines,
      petNotes,
      imageUrl,
      userId,
    });
    res.json(boardingDoc);
    // res.json("post");
  }

  if (method === "GET") {
    try {
      if (req.query?.id) {
        res.json(await Boarding.findOne({ _id: req.query.id }));
      } else {
        res.json(await Boarding.find().sort({ createdAt: -1 }));
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch boarding details." });
    }
  }

  if (method === "PATCH") {
    try {
      const { id, ...updateData } = req.body;

      const updatedBoarding = await Boarding.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedBoarding) {
        return res.status(404).json({ error: "Boarding not found." });
      }
      res.json(updatedBoarding);
    } catch (error) {
      res.status(500).json({ error: "Failed to update boarding details." });
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Boarding.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
