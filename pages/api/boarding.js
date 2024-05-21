import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { Boarding } from "@/models/Boarding";
import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

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
      // vaccines,
      petNotes,
      imageUrl,
      vaccineUrl,
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
      // vaccines,
      petNotes,
      imageUrl,
      vaccineUrl,
      bookingCount: 0,
      totalDaysBooked: 0,
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

  // if (method === "DELETE") {
  //   if (req.query?.id) {
  //     await Boarding.deleteOne({ _id: req.query?.id });
  //     res.json(true);
  //   }
  // }

  if (method === "DELETE") {
    // Handle DELETE request for deleting a boarding document
    const { id } = req.query; //obj id mongodb

    //s3://bulldogbabysitter-uploads/user_2anqu3YNrsjYdepgcGrfvmB29s0/ path

    const bucketName = "bulldogbabysitter-uploads"; // Ensure this is your bucket name

    try {
      // Retrieve the boarding document from MongoDB
      const boardingDoc = await Boarding.findOne({ _id: id });
      console.log(boardingDoc);

      let s3Key = boardingDoc.userId;
      if (!boardingDoc) {
        return res.status(404).json({ error: "Boarding not found." });
      }

      // Initialize S3 client
      const s3 = new S3Client({
        region: "ap-southeast-2",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      const deleteFolderParams = {
        Bucket: bucketName,
        Prefix: `${s3Key}/`, // Specify the prefix of the folder
      };

      // Delete images from S3 bucket

      try {
        // List all objects within the folder
        const data = await s3.send(new ListObjectsCommand(deleteFolderParams));

        // Delete each object within the folder
        const deleteObjectsParams = {
          Bucket: bucketName,
          Delete: {
            Objects: data.Contents.map((obj) => ({ Key: obj.Key })),
          },
        };
        await s3.send(new DeleteObjectsCommand(deleteObjectsParams));

        // Now that all objects are deleted, delete the folder itself
        const deleteFolderCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: `${s3Key}/`, // Ensure the key ends with a slash to specify it's a folder
        });
        await s3.send(deleteFolderCommand);

        console.log("Folder deleted successfully.");
      } catch (error) {
        console.error("Error deleting folder:", error);
      }

      res.json(true);

      // Delete the boarding document from MongoDB
      await Boarding.deleteOne({ _id: id });
    } catch (error) {
      console.error("Error deleting boarding and images:", error);
      res.status(500).json({ error: "Failed to delete boarding and images." });
    }
  }
}
