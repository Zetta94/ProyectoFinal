const express = require("express")
const router = express.Router()
const ProductManager = require('../controllers/product.controler.js')
const manager = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        const response = await manager.getProducts();
        let limit = parseInt(req.query.limit);
        if (limit) {
            const arraylimit = response.slice(0, limit)
            return res.status(200).send({status:"success",payload:arraylimit})
        } else {
            return res.status(200).send({status:"success",payload:response})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({status: 'error', message:error.message})
    }
}) 

router.get('/products/:pid', async (req, res) => {
    try {
        let pid = parseInt(req.params.pid);
        const response = await manager.getProductById(pid);
        if (response) {
            return res.status(200).send({status:"success",payload:response})
        } else {
            console.log('The product does not exist');
            return res.status(200).send({status:"success", payload:'The product does not exist'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 'error', message:error.message})
    }
})

router.post('/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail=[] } = req.body
        console.log(title,"-",description,"-", code,"-", price,"-", stock,"-", category,"-", thumbnail)
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('All fields are mandatory, except for thumbnails.')
        }
        await manager.addProduct(title, description, code, price, stock, category, thumbnail)
        res.status(200).send({ status: "success", payload: "Product added successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: 'error', message: error.message })
    }
})


// router.put('/products/:pid', async(req,res)=>{
//     try{

//     } catch(error){
//         console.log(error)
//         return res.send('Error')
//     }
// })

// router.delete('/products/:pid', async(req,res)=>{
//     try{

//     } catch(error){
//         console.log(error)
//         return res.send('Error')
//     }
// })

module.exports = router;