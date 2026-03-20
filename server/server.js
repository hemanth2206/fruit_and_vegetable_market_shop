const exp=require("express")
const app=exp();
require("dotenv").config();
const port=process.env.PORT || 4000;
const mongoose=require("mongoose");
const vendorApp = require("./APIs/vendorApi");
const adminApp = require("./APIs/adminApi");
const buyerApp = require("./APIs/buyerApi");
const cors = require("cors");

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server and local non-browser requests.
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Origin not allowed by CORS"));
        },
        credentials: true,
    })
);

mongoose.connect(process.env.DBURL)
.then(()=>{app.listen(port,()=>console.log(`server listening on port ${port}`)) 
            console.log("DB connection success")        
})
.catch(err=>console.log("Error in db connection",err))

app.use(exp.json())
app.use('/buyer-api', buyerApp)
app.use('/vendor-api',vendorApp)
app.use('/admin-api',adminApp)


app.use((err, req, res, next) => {
    console.log("Error Caught by Global Error Handler", err);
    res.status(500).send({ message: "Something went wrong", error: err.message });
});
