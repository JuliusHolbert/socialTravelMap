import { Schema, model } from "mongoose";

const PinSchema = new Schema({
          username:{
              type: String,
              required: true,
          },
          title: {
              type: String,
              require: true,
              min: 3,
          },
          desc:{
              type: String,
              require: true,
              min: 3,
          },
          rating:{
              type: Number,
              min: 0,
              max: 5,
          },
          lat:{
              type: Number,
              require: true,
          },
          long:{
            type: Number,
            require: true,
          }
        },
    { timestamps: true }
);

export default model("Pin", PinSchema);