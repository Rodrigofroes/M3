import express from "express";
import Database from "./Database/database.js";
import chamadoRoute from "./Routes/chamadoRoute.js";
import dialogFlowRoute from "./Routes/dialogFlowRoute.js";
import session from "express-session"

const app = new express();

Database.getInstance();

app.use(session({
    secret: "Iv3TN0kuM5i6c0g0h5qJBTO85ua5O6we",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true
    }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/chamado', chamadoRoute);
app.use('/webhook', dialogFlowRoute);

app.listen(8080, () => {
    console.log("Server started");
});