import { Router } from "express";
import { Skyscraper } from "../models/Skyscraper.js";

export const skyscraperRouter = Router();

skyscraperRouter.get("/", async (_req, res, next) => {
  try {
    const items = await Skyscraper.find().sort({ heightM: -1 }).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

skyscraperRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await Skyscraper.findById(req.params.id).lean();
    if (!item) {
      res.status(404).json({ message: "Nuk u gjet" });
      return;
    }
    res.json(item);
  } catch (e) {
    next(e);
  }
});
