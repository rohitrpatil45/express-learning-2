import express from "express"
import ConnectDB from "./db.js"
import User from "./models/User.js";   // <-- here
import Product from "./models/Product.js";

const app = express()
app.use(express.json()); // handles JSON requests
app.use(express.urlencoded({ extended: true })); // handles form-data (urlencoded)

const PORT = 3000

app.get('/', (req, res) => {
  res.send("hello world")
})

ConnectDB()



app.post('/add-product', async (req, res) => {
  try {
    const { productname, productprice } = req.body;
    const productexist = await Product.findOne({ productname })


    if (productexist) {
      return res.status(400).json({ message: "this product is already exist" })
    }

    const newPorduct = new Product({ productname, productprice });
    await newPorduct.save()
    res.status(201).json({ message: "prodsduct is added" })
  } catch (error) {
    res.status(500).json({ errorr: error.message })

  }

})


// app.put('/update-product/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const { price } = req.body;

//     const updateproduct = await Product.findByIdAndUpdate(productId, { price }, { new: true, runValidators: true })
//     if (!updateproduct) {
//       res.status(404).json({ message: "proudcut id ieas wrong " })
//     }
//   } catch (error) {
//     console.log(error)
//   }


// })


app.put('/update-product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { price } = req.body;

    // Update product by ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productprice: price },   // make sure field name matches schema
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product ID is wrong" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// app.get('/product' , async (req, res) => {
//  try {
//   const allproduct =  await Product.find({},"productname")
//   console.log(allproduct)
//   res.send("check the console ")
//  } catch (error) {
//   res.send("this is done ")
//  }
// })


app.listen(PORT, () => {

  console.log("server is running")

})