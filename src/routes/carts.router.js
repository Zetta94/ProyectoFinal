const express = require("express")
const router = express.Router()
const CartManager = require("../controllers/carts.controler")
const manager = new CartManager()

//Route returned by a cart determined by its id.
router.get('/carts/:cid', async(req,res)=>{
    try{
        let cid = parseInt(req.params.cid)
        const response = await manager.getProductsByCart(cid)
        if (response) {
            return res.status(200).send({status:"success",payload:response})
        } else {
            return res.status(200).send({status:"success", message:'Empty cart'})
        }
    } catch(error){
        res.status(500).send({ status: "error", error: error.message })
    }
})

//Route that returns the products in a determined cart.
router.post('/carts', async(req,res)=>{
    try{
        const response = manager.newCart()
        res.status(200).send({ status: "success", message: "Cart created successfully" })
    } catch(error){
        res.status(500).send({ status: "error", error: error.message })
    }
})

//Route that adds a determined product to a determined cart
router.post('/carts/:cid/product/:pid', async(req,res)=>{
    try{
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        const response = await manager.addProduct(cid,pid)
        res.status(200).send({ status: "success", message: "Product successfully added to the cart" })
    } catch(error){
        console.log(error)
        res.status(500).send({ status: "error", error: error.message })
    }
})

//Route that removes a cart from the list
router.delete('/carts/:cid',async(req,res)=>{
    try{
        let cid = parseInt(req.params.cid)
        const response = await manager.deleteCart(cid)
        res.status(200).send({status:"success",message: "Cart successfully deleted."})
    }catch(error){
        res.status(500).send({status :"error", error:error.messsage})
    }
})

module.exports = router