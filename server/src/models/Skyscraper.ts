import mongoose from "mongoose";

const skyscraperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    heightM: { type: Number, required: true },
    floors: { type: Number },
    yearBuilt: { type: Number },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    architect: { type: String },
  },
  { timestamps: true }
);

export type SkyscraperDoc = mongoose.InferSchemaType<typeof skyscraperSchema>;
export const Skyscraper = mongoose.model("Skyscraper", skyscraperSchema);
