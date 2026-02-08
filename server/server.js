const exp=require("express")
const app=exp();
require("dotenv").config();
const port=process.env.PORT || 4000;
const mongoose=require("mongoose");
const vendorApp = require("./APIs/vendorApi");
const adminApp = require("./APIs/adminApi");
const buyerApp = require("./APIs/buyerApi");
const cors = require("cors");
app.use(cors());

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
