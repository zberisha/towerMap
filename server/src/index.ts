import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { skyscraperRouter } from "./routes/skyscrapers.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/towerMap";

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/skyscrapers", skyscraperRouter);

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
);

async function main() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API në http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
