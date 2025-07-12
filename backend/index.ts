import express from "express";
import { bootstrap } from "./src/app";

const app = express();
bootstrap(app);
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
