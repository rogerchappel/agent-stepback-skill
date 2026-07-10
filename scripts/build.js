import { createCheckpoint } from "../src/index.js";

if (typeof createCheckpoint !== "function") {
  throw new Error("library export missing");
}

console.log("build smoke ok");
