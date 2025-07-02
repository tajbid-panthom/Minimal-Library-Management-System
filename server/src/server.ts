import mongoose from "mongoose";
import { Server } from "http";
import "dotenv/config";
import app from "./app";

let server: Server;
let PORT = process.env.PORT || 3000;
let MONGO_URI = process.env.MONGO_URI || "";
async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DataBase Connected Successfully");
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
