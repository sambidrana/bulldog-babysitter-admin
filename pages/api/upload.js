import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import formidable from "formidable";

// import http from "node:http";

const bucketName = "bulldogbabysitter-uploads"; // Ensure this is your bucket name

const cors = Cors({
  origin: "http://localhost:3001",
  methods: ["POST"],
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

export default async function handleUpload(req, res) {
  await mongooseConnect();
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
    console.log("FILE INFO", files);
    // Initialize S3 Client with new v3 syntax
    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const file = files.file;
    const originalFilename = file.originalFilename;
    const fileExtension = originalFilename.split(".").pop();
    const newFilename = Date.now() + '-' + file.newFilename + "." + fileExtension; // Append the extension to the new file name

    console.log(newFilename);
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        // Body: fs.createReadStream(file.path),
        Body: fs.readFileSync(file.filepath),
        // ACL: "public-read",
        ContentType: file.mimetype,
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    return res.json({ link });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

/*
    const links = [];
    const file = files.file;
    // console.log("file is this", file)
    console.log("filepath is this", file.filepath)
    
    if (file) {
      const filenameParts = file.originalFilename.split(".");
      const ext = filenameParts.pop();
      const fileName = filenameParts.join(".");
      const newFilename = `${Date.now() + fileName}.${ext}`;
      // console.log({ ext, file, newFilename });
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(file.filepath),
          ACL: "public-read",
          ContentType: mime.lookup(file.filepath),
        })
        );
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        
        links.push(link);
      }
      return res.json({ links });
      
      */

// const form = new multiparty.Form();
// const { fields, files } = await new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });

// const form = new multiparty.Form({
//     maxFileSize: 5 * 1024 * 1024, // 5MB for example
//   });
//   form.parse(req, function (err, fields, files) {
//     if (err) {
//       console.error("Error parsing form:", err);
//       return res.status(500).send("Error parsing the form data");
//     }

//     console.log("Fields:", fields);
//     console.log("Files:", files);

//     res.status(200).json({ message: "Form parsed successfully" });
//   });

// const formData = await req;
// console.log(formData);
// return res.json('ok')

//   if (method === "POST") {
//     const form = new multiparty.Form();

//     form.parse(req, (err, fields, files) => {
//       // Check for errors during parsing
//       if (err) {
//         console.error("Error parsing form: ", err);
//         return res.status(500).send("Error parsing the form data");
//       }

//       // Log the received fields and files
//       console.log("Fields:", fields);
//       console.log("Files:", files);

//       // At this point, you should handle the files as needed.
//       // For example, you could upload them to S3, save info to a database, etc.
//       // Since this is just logging, we'll send a response back to the client.

//       res.status(200).send("Form data received");
//     });
//   } else {
//     // Handle non-POST requests
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

// if (req.method === "POST") {

// form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error parsing the form data");
//     }

//     // 'file' is the key used in the client-side form
//     const [file] = files.file; // Multiparty stores files in arrays

//     // Create params for S3 upload
//     const uploadParams = {
//       Bucket: bucketName, // Use your bucket name
//       Key: `uploads/${file.originalFilename}`, // file name
//       Body: fs.createReadStream(file.path), // file stream
//     };

//     try {
//       // Using PutObjectCommand for upload
//       const command = new PutObjectCommand(uploadParams);
//       await s3Client.send(command);

//       console.log(`File uploaded successfully`);
//       res.status(200).send(`File uploaded successfully`);
//     } catch (s3Err) {
//       console.error("Error uploading to S3", s3Err);
//       return res.status(500).send("Error uploading to S3");
//     }
//   });
// } else {
//   res.setHeader("Allow", ["POST"]);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }
