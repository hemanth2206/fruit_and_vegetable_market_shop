const BuyerVendor=require("../models/buyerVendorModel")


async function createBuyerOrVendor(req, res) {
    try {
        const newBuyerVendor=req.body;
        
        // Validate required fields
        if(!newBuyerVendor.email || !newBuyerVendor.firstName || !newBuyerVendor.role) {
            return res.status(400).send({message:"Email, FirstName and Role are required"});
        }
        
        const userInDb=await BuyerVendor.findOne({email:newBuyerVendor.email});
        if(userInDb!==null){
            if(newBuyerVendor.role===userInDb.role){
                res.status(200).send({message:newBuyerVendor.role,payload:userInDb});
            }else{
                res.status(200).send({message:"User with this email already exists as "+userInDb.role});
            }
        }else{
            // Filter only required fields to prevent strict schema errors
            const filteredUser = {
                role: newBuyerVendor.role,
                firstName: newBuyerVendor.firstName,
                lastName: newBuyerVendor.lastName || '',
                email: newBuyerVendor.email,
                profileImageUrl: newBuyerVendor.profileImageUrl || ''
            };
            let newUser = new BuyerVendor(filteredUser);
            let newBuyerOrVendor = await newUser.save();
            res.status(201).send({message:newBuyerOrVendor.role,payload:newBuyerOrVendor});
        }
    } catch(error) {
        console.error("Error in createBuyerOrVendor:", error);
        res.status(500).send({message:"Error creating user",error:error.message});
    }
}

module.exports = createBuyerOrVendor;