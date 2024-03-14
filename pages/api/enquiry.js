import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { Enquiry } from "@/models/Enquiry";

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

export default async function handleEnquiry(req, res) {
  await runMiddleware(req, res, cors);

  // res.json(req.method) //1:05:54
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { name, email, contact, message } = req.body;

    const enquiryDoc = await Enquiry.create({
      name,
      email,
      contact,
      message,
    });
    res.json(enquiryDoc);
    // res.json("post");
  }

  if (method === "GET") {
    try {
      res.json(await Enquiry.find().sort({ createdAt: -1 }));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Enquiry details." });
    }
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Enquiry.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
