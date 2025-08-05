import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/productModel.js'

//Function for add product
const addProduct = async (req, res) => {
    try{
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body

        // Safe file access - won't crash if files are not uploaded
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]


        const images=[image1,image2,image3,image4].filter((item)=> item !== undefined)

        let imagesurl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
                return result.secure_url
            })
        )



        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            image: imagesurl,
            date: Date.now()
        }

        // Handle sizes properly
        const clothingCategories = ['Men', 'Women', 'Kids'];
        if (clothingCategories.includes(category) && sizes) {
            // If sizes is a string, parse it; if it's already an array, use it as is
            if (typeof sizes === 'string') {
                try {
                    productData.sizes = JSON.parse(sizes);
                } catch (error) {
                    // If JSON parsing fails, treat it as a single size
                    productData.sizes = [sizes];
                }
            } else if (Array.isArray(sizes)) {
                productData.sizes = sizes;
            } else {
                productData.sizes = [sizes];
            }
        } else {
            // For non-clothing items, set sizes to empty array or null
            productData.sizes = [];
        }




        console.log(productData);

        const products = new Product(productData);
        await products.save();

        res.json({success:true,message:"Product Added successfully"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//Function for list product
const listProducts = async (req, res) => {
    try{
        const products = await Product.findAll();
        res.json({success: true, products})
    }catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


//Function for removing product
const removeProduct = async (req, res) => {
    try{
        const { id } = req.body; // Get ID from request body, not params
        
        if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        
        const productId = parseInt(id);
        if (isNaN(productId)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }
        
        console.log('Attempting to delete product with ID:', productId);
        
        const product = await Product.findByPk(productId);
        console.log('Found product:', product);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        await Product.destroy({ where: { id: productId } });
        res.json({ success: true, message: "Product Deleted Successfully" });

    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//Function for single product info
const singleProduct = async (req, res) => {
    try{
        const { productId } = req.body;
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        
        const id = parseInt(productId);
        if (isNaN(id)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        res.json({ success: true, product })
    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



export {addProduct, listProducts, removeProduct, singleProduct};






