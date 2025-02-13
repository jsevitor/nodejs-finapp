import cors from "cors";
import express from "express";
import router from "./routes/Routes.js";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
