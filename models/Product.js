import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productname: {
        type: String,
        require: true,
        unique: true
    },
    productprice: {
        type: Number,
        required: true

    },
    instock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Product = mongoose.model("Product", ProductSchema)
export default Product