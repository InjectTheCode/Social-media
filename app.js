const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const errorController = require("./controllers/errorCntroller");

const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
console.log(process.env.NODE_ENV);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(errorController);

module.exports = app;
