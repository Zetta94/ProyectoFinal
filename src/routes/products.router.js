const express = require("express")
const router = express.Router()
const ProductManager = require('../controllers/product.controler.js')
const manager = new ProductManager()

//Route that returns all products.
router.get('/products', async (req, res) => {
    try {
        const response = await manager.getProducts()
        let limit = parseInt(req.query.limit)
        if (limit) {
            const arraylimit = response.slice(0, limit)
            return res.status(200).send({status:"success",payload:arraylimit})
        } else {
            return res.status(200).send({status:"success",payload:response})
        }
    } catch (error) {
        return res.status(500).send({status: 'error', error:error.message})
    }
}) 

//Route returned by a product determined by its id
router.get('/products/:pid', async (req, res) => {
    try {
        let pid = parseInt(req.params.pid)
        const response = await manager.getProductById(pid)
        return res.status(200).send({status:"success",payload:response})
    } catch (error) {
        return res.status(500).send({status: 'error', error:error.message})
    }
})

//Route that creates a new product
router.post('/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail=[] } = req.body
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('All fields are mandatory, except for thumbnails.')
        }
        const product = await manager.addProduct(title, description, code, price, stock, category, thumbnail)
        console.log(product)
        res.status(200).send({ status: "success", message: "Product successfully added" })

    } catch (error) {    
            res.status(500).send({ status: "error", error: error.message })
        }
})

//Route that updates a new field in a product
router.put('/products/:pid', async(req,res)=>{
    try{
        let pid = parseInt(req.params.pid)
        const {fieldToUpdate, newValue} = req.body
        const response = await manager.updateProduct(pid,fieldToUpdate, newValue)
        res.status(200).send({ status: "success", message: "Product successfully updated " })
    } catch(error){
        res.status(500).json({ status: "error", error: error.message })
    }
})

//Logical Deletion Implemented!! It only changes the status from true to false. Doesn't remove the product completely
router.delete('/products/:pid', async(req,res)=>{
    try{
        let pid = parseInt(req.params.pid)
        const response = await manager.deleteProduct(pid)
        res.status(200).send({status: "success", message: "Product successfully deleted."}) 
    } catch(error){
        res.status(500).json({ status: "error", error: error.message })
    }
})

module.exports = router