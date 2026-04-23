import "dotenv/config";
import mongoose from "mongoose";
import { Skyscraper } from "./models/Skyscraper.js";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/towerMap";

/** Të dhëna referuese për kullat më të larta (lartësi të përafërta CTBUH). */
const DATA = [
  { name: "Burj Khalifa", city: "Dubai", country: "UAE", heightM: 828, floors: 163, yearBuilt: 2010, lat: 25.197197, lng: 55.2743764, architect: "SOM" },
  { name: "Merdeka 118", city: "Kuala Lumpur", country: "Malaysia", heightM: 678.9, floors: 118, yearBuilt: 2023, lat: 3.1390, lng: 101.7026, architect: "Fender Katsalidis" },
  { name: "Shanghai Tower", city: "Shanghai", country: "China", heightM: 632, floors: 128, yearBuilt: 2015, lat: 31.2397, lng: 121.4998, architect: "Gensler" },
  { name: "Abraj Al-Bait Clock Tower", city: "Mecca", country: "Saudi Arabia", heightM: 601, floors: 120, yearBuilt: 2012, lat: 21.4189, lng: 39.8256, architect: "SL Rasch" },
  { name: "Ping An Finance Centre", city: "Shenzhen", country: "China", heightM: 599.1, floors: 115, yearBuilt: 2017, lat: 22.5364, lng: 114.0545, architect: "KPF" },
  { name: "Goldin Finance 117", city: "Tianjin", country: "China", heightM: 596.6, floors: 128, yearBuilt: 2024, lat: 39.0842, lng: 117.2010, architect: "P&T Group" },
  { name: "Lotte World Tower", city: "Seoul", country: "South Korea", heightM: 554.5, floors: 123, yearBuilt: 2017, lat: 37.5125, lng: 127.1025, architect: "KPF" },
  { name: "One World Trade Center", city: "New York", country: "USA", heightM: 541.3, floors: 94, yearBuilt: 2014, lat: 40.7127, lng: -74.0134, architect: "SOM" },
  { name: "Guangzhou CTF Finance Centre", city: "Guangzhou", country: "China", heightM: 530, floors: 111, yearBuilt: 2016, lat: 23.1201, lng: 113.3244, architect: "KPF" },
  { name: "Tianjin CTF Finance Centre", city: "Tianjin", country: "China", heightM: 530, floors: 97, yearBuilt: 2019, lat: 39.0233, lng: 117.7040, architect: "SOM" },
  { name: "China Zun", city: "Beijing", country: "China", heightM: 528, floors: 108, yearBuilt: 2018, lat: 39.9163, lng: 116.4603, architect: "KPF" },
  { name: "Taipei 101", city: "Taipei", country: "Taiwan", heightM: 508, floors: 101, yearBuilt: 2004, lat: 25.033963, lng: 121.564472, architect: "C.Y. Lee" },
  { name: "Shanghai World Financial Center", city: "Shanghai", country: "China", heightM: 492, floors: 101, yearBuilt: 2008, lat: 31.2350, lng: 121.5010, architect: "KPF" },
  { name: "International Commerce Centre", city: "Hong Kong", country: "China", heightM: 484, floors: 108, yearBuilt: 2010, lat: 22.3034, lng: 114.1602, architect: "KPF" },
  { name: "Central Park Tower", city: "New York", country: "USA", heightM: 472.4, floors: 98, yearBuilt: 2020, lat: 40.7660, lng: -73.9810, architect: "Adrian Smith + Gordon Gill" },
  { name: "Lakhta Center", city: "Saint Petersburg", country: "Russia", heightM: 462, floors: 87, yearBuilt: 2019, lat: 59.9870, lng: 30.2110, architect: "Gorproject / RMJM" },
  { name: "Landmark 81", city: "Ho Chi Minh City", country: "Vietnam", heightM: 461.2, floors: 81, yearBuilt: 2018, lat: 10.7942, lng: 106.7219, architect: "Atkins" },
  { name: "Changsha IFS Tower T1", city: "Changsha", country: "China", heightM: 452, floors: 94, yearBuilt: 2018, lat: 28.2282, lng: 112.9860, architect: "Wong Tung" },
  { name: "Petronas Twin Towers (1)", city: "Kuala Lumpur", country: "Malaysia", heightM: 451.9, floors: 88, yearBuilt: 1998, lat: 3.1579, lng: 101.7116, architect: "Cesar Pelli" },
  { name: "Willis Tower", city: "Chicago", country: "USA", heightM: 442.1, floors: 108, yearBuilt: 1974, lat: 41.8789, lng: -87.6359, architect: "SOM" },
  { name: "Kingkey 100", city: "Shenzhen", country: "China", heightM: 441.8, floors: 100, yearBuilt: 2011, lat: 22.5445, lng: 114.1030, architect: "TFP Farrells" },
  { name: "Guangzhou International Finance Center", city: "Guangzhou", country: "China", heightM: 438.6, floors: 103, yearBuilt: 2010, lat: 23.1200, lng: 113.3180, architect: "WilkinsonEyre" },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  await Skyscraper.deleteMany({});
  await Skyscraper.insertMany(DATA);
  console.log(`U futën ${DATA.length} kullë.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
