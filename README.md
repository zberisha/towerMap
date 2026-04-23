# Tower Map

Interactive world map of notable skyscrapers: filter by country, inspect building metadata, and open simplified **Three.js** 3D previews. The project is a **TypeScript monorepo** with a classic **MERN-style** backend (MongoDB, Express, React, Node) and a **Vite** SPA client.

---

## Technologies

| Layer | Stack |
|--------|--------|
| **Client** | [React 18](https://react.dev/), [Vite](https://vitejs.dev/), TypeScript |
| **Maps** | [Leaflet](https://leafletjs.com/), [react-leaflet](https://react-leaflet.js.org/) |
| **3D** | [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and [@react-three/drei](https://github.com/pmndrs/drei) |
| **UI** | [Radix UI](https://www.radix-ui.com/) (Dialog, Scroll Area, Select, Switch, Tooltip) |
| **i18n** | [i18next](https://www.i18next.com/), [react-i18next](https://react.i18next.com/) — English, German, French, Spanish, Italian, Chinese, Japanese, Arabic |
| **SEO** | [react-helmet-async](https://github.com/staylor/react-helmet-async) (meta, Open Graph, Twitter cards, JSON-LD, `hreflang`) |
| **Server** | [Express](https://expressjs.com/), TypeScript, [Mongoose](https://mongoosejs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) |
| **Tooling** | npm workspaces, `tsx` (dev), `concurrently` (run client + server) |

Country outlines are loaded in the browser from public GeoJSON (see client code). Tower records are stored in MongoDB and served by the REST API below.

---

## Repository layout

```
towerMap/
├── client/          # Vite + React SPA
│   ├── public/      # favicon.svg, robots.txt, llms.txt
│   └── src/
├── server/          # Express API
│   └── src/
│       ├── models/
│       ├── routes/
│       └── seed.ts
├── package.json     # workspaces + root scripts
└── .env.example
```

---

## Prerequisites

- **Node.js** (LTS recommended)
- **MongoDB** running locally or a reachable `MONGODB_URI`

---

## Environment variables

Copy `.env.example` to `.env` in the **project root** (or set the same variables when deploying).

| Variable | Used by | Description |
|----------|---------|-------------|
| `MONGODB_URI` | Server | MongoDB connection string (default: `mongodb://127.0.0.1:27017/towerMap`) |
| `PORT` | Server | API port (default: `5000`) |
| `CLIENT_ORIGIN` | Server | CORS origin for the browser app (default: `http://localhost:5173`) |

**Client (optional, for production SEO URLs):**

| Variable | Description |
|----------|-------------|
| `VITE_PUBLIC_SITE_URL` | Public site origin without trailing slash, e.g. `https://yourdomain.com` — used for canonical URLs and Open Graph in the built SPA |

---

## Quick start

From the repository root:

```bash
npm install
```

Seed the database (requires MongoDB):

```bash
npm run seed
```

Start API + client in development:

```bash
npm run dev
```

- **API:** `http://localhost:5000`
- **App:** `http://localhost:5173` (Vite proxies `/api` to the server)

Production builds:

```bash
npm run build
```

This compiles `server` to `server/dist` and `client` to `client/dist`. Serve the API with Node and the SPA with any static host; in production you must configure the frontend to call the same host or set up a reverse proxy so `/api` reaches Express.

---

## API

The HTTP API is a small **JSON REST** layer under the `/api` prefix. All successful responses use `application/json`.

### Health check

`GET /api/health`

**Response:** `200 OK`

```json
{ "ok": true }
```

Use this to verify the process is up (it does not check MongoDB connectivity by itself).

---

### List skyscrapers

`GET /api/skyscrapers`

Returns every document in the `Skyscraper` collection, sorted by **`heightM` descending** (tallest first).

**Response:** `200 OK` — JSON array of objects.

**Example item shape:**

```json
{
  "_id": "…",
  "name": "Burj Khalifa",
  "city": "Dubai",
  "country": "UAE",
  "heightM": 828,
  "floors": 163,
  "yearBuilt": 2010,
  "lat": 25.197197,
  "lng": 55.2743764,
  "architect": "SOM",
  "createdAt": "…",
  "updatedAt": "…"
}
```

| Field | Type | Notes |
|-------|------|--------|
| `_id` | string | MongoDB ObjectId as string |
| `name` | string | Required |
| `city` | string | Required |
| `country` | string | Required; used for map filtering |
| `heightM` | number | Height in metres |
| `floors` | number | Optional |
| `yearBuilt` | number | Optional |
| `lat`, `lng` | number | WGS84 coordinates |
| `architect` | string | Optional |
| `createdAt`, `updatedAt` | string | ISO dates from Mongoose `timestamps` |

On server error, the global handler responds with `500` and a JSON body such as:

```json
{ "message": "Gabim serveri" }
```

---

### Get one skyscraper

`GET /api/skyscrapers/:id`

`:id` must be a valid MongoDB ObjectId string.

**Response:**

- `200 OK` — single object (same fields as above).
- `404 Not Found` — `{ "message": "Nuk u gjet" }` if no document matches.

---

### How the client uses the API

- **Development:** the Vite dev server proxies requests from `http://localhost:5173/api/...` to `http://localhost:5000/api/...`.
- **Production:** configure your host or CDN so `/api` is forwarded to the Express server, or change the client `fetch` base URL to the full API origin.

The SPA does **not** implement POST/PUT/DELETE for skyscrapers; data is expected to be loaded via **`npm run seed`** (or your own MongoDB tooling).

---

## Seeding data

`server/src/seed.ts` connects to MongoDB, **clears** the `Skyscrapers` collection, and inserts the bundled sample dataset.

```bash
npm run seed
```

Run this whenever you need a fresh copy of the demo towers.

---

## License

This project is provided as-is for demonstration and learning. Adjust license and attribution as needed for your use case.
