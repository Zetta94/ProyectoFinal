const fs = require('fs').promises
const path = require('path')

class CartManager {
    constructor(){
        this.path = path.resolve(__dirname, '../carts.json')
    }

    //Function that create a new cart.
    async newCart(){
        try {
            let cart = []

            try {
                const data = await fs.readFile(this.path, 'utf8')
                if (data.trim() !== '') {
                    cart = JSON.parse(data)
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }
             const last_element = cart[cart.length-1]
             let id = 1

            if(last_element){
                id = last_element.id + 1
            }
             

            const product = {
                id : id,
                products:[]
            }

            cart.push(product)
            await fs.writeFile(this.path, JSON.stringify(cart, null, 2))
            
        } catch (error) {
            throw new Error(error.message)
        }
    }

    //Function that returns products from a determined cart searched by id
    async getProductsByCart(cid){
        try{
            let carts  = []
            try {
                const data = await fs.readFile(this.path, 'utf8')
                if (data.trim() !== '') {
                    carts = JSON.parse(data)
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }
            const cart_find = carts.find(e => e.id === cid)
            if(cart_find){
                if(cart_find.products.length>0){
                    return cart_find.products
                }else{
                    return null
                }
            }else{
                throw new Error("Cart does not exist")
            }
        } catch (error) {
            throw new Error(error)
        }

    } 

    //Function that adds a determined product to a determined cart
    async addProduct(cid,pid){
        try {
            let product = []
            const data = await fs.readFile(path.resolve(__dirname, '../products.json'), 'utf8')
            if (data.trim() !== '') {
                product = JSON.parse(data)
            }
            const product_find = product.find(e => e.id === pid)

            if(!product_find||!(product_find.status)||(product_find.stock==0)){
                throw new Error("The product does not exist or is out of stock")
            }


            let carts  = []
            try {
                const data2 = await fs.readFile(this.path, 'utf8')
                if (data2.trim() !== '') {
                    carts = JSON.parse(data2)
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }

            const index = carts.findIndex(e => e.id === cid)

            if (index === -1) {
                throw new Error("Cart not found")
            }
            
            if (!carts[index]) {
                throw new Error("Cart does not exist")
            }

            const cart = carts.find(e=>e.id === cid) 
            const productInCart = cart.products.find(e => e.product === pid)

            if(!productInCart){
                carts[index].products.push({"product": pid, "quantity": 1})
            }else{
                carts[index].products.quantity= productInCart.quantity++
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
            console.log('Cart updated successfully.')
        } catch (error) {
            throw new Error (error.message)
        }
    }

    //Function that removes a cart from the list
    async deleteCart(cid){
        try{
            let carts = []

            try {
                const data = await fs.readFile(this.path, 'utf8')
                if (data.trim() !== '') {
                    carts = JSON.parse(data)
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }

            const index = carts.findIndex(e => e.id === cid)

            if (index === -1) {
                throw new Error("Cart not found")
            }
            
            if (!carts[index]) {
                throw new Error("Cart does not exist")
            }

            carts.splice(index, 1)

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
        }catch(error){
            throw new Error(error.messsage)
        }
    }
}

module.exports = CartManager