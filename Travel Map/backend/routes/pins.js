const router = require("express").Router();
import Pin, { find } from "../models/Pin";

//create a pin

router.post("/", async (req, res) => {
    const newPin = new Pin(req.body)
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err){
        res.status(500).json(err);
    }
});

//get all pins

router.get("/", async (req, res)=>{
    try{
        const pins = await find();
        res.status(200).json(pins);
    } catch(err){
        res.status(500).json(err);
    }
})

export default router