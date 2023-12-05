import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { Boarding } from "@/models/Boarding";

const cors = Cors({
  origin: "http://localhost:3001", // specify the origin you want to allow
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
      userId,
    });
    res.json(boardingDoc);
    // res.json("post");
  }

  if (method === "GET") {
    try {
      res.json(await Boarding.find().sort({ createdAt: -1 }));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch boarding details." });
    }
  }
}
