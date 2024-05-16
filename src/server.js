import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import db from "./config/db.js";
import userRouter from "./routers/userRouter.js";

const corsOptions = {
  origin : [
    "http://localhost:3000","https://sumokwon.netlify.app"
  ]
}
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"))
app.use(cors(corsOptions))

app.get("/", (req,res) => res.send({name:"test"}));
//스탬프 예시
// app.post("/test", async (req,res) => {
//   console.log(req.body)
//   const {stamp_id, user_id} = req.body
//   try {
//     const QUERY = `UPDATE UserStamp SET is_collected = TRUE WHERE user_no = (SELECT user_no FROM User WHERE user_no = ?) AND stamp_id = ?`;
//     await db.execute(QUERY, [user_id, stamp_id]);

//     res.status(200).json({
//       status: "success",
//       message: `Stamp ${stamp_id} for user ${user_id} has been updated successfully.`,
//       stamp_id : stamp_id
//     })
//   } catch (error) {
//     console.error("Error updating stamp:", error);
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while updating the stamp."
//     }); 
//   }
// })
app.use('/users', userRouter)

app.listen(PORT, () => console.log(`Server is Listening http://localhost:${PORT}`))

