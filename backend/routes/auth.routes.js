import { login, logOut, signup } from "../controllers/auth.controllers.js"
import express from "express"
const  authrouter = express.Router()

authrouter.post("/signup", signup);
authrouter.post("/login", login);
authrouter.get("/logout", logOut);
export default authrouter