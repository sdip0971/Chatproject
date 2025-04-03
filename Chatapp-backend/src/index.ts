import express, { json } from "express";
import cors from "cors";
import { authRouter } from "./router/authrouter";
import { config as configDotenv } from "dotenv"; 
import cookieParser from "cookie-parser"; 

const app = express();

app.use(express.json());
configDotenv(); 
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});
app.use("/auth",authRouter);


const port = 3000; // Define the port variable
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});