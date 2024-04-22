const fs = require('fs').promises
const path = require('path');

class CartManager {
    constructor(){
        this.path = path.resolve(__dirname, '../carts.json');
    }

    async newCart(){
        try {
            let cart = [];

            try {
                const data = await fs.readFile(this.path, 'utf8')
                if (data.trim() !== '') {
                    cart = JSON.parse(data);
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }

            const id = cart.length + 1;

            const product = {
                id : id,
                products:[]
            }

            cart.push(product);
            await fs.writeFile(this.path, JSON.stringify(cart, null, 2));
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductsByCart(cid){
        try{
        const data = await fs.readFile(this.path, 'utf8');
        const carts = JSON.parse(data);
        const cart_find = carts.find(e => e.id === cid);
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
            throw new Error(error);
        }

    } 

    async addProduct(cid,pid){
        try {
            let product = []
            const data = await fs.readFile(path.resolve(__dirname, '../products.json'), 'utf8')
            if (data.trim() !== '') {
                product = JSON.parse(data);
            }
            const product_find = product.find(e => e.id === pid);

            if(!product_find){
                throw new Error("The product does not exist")
            }

            const data2 = await fs.readFile(this.path, 'utf8');
            const carts = JSON.parse(data2)
            const index = carts.findIndex(e => e.id === cid);

            if (index === -1) {
                throw new Error("Cart not found");
            }
            
            if (!carts[index]) {
                throw new Error("Cart does not exist");
            }

            const cart = carts.find(e=>e.id === cid) 
            const productInCart = cart.products.find(e => e.product === pid)

            if(!productInCart){
                carts[index].products.push({"product": pid, "quantity": 1});
            }else{
                carts[index].products.quantity= productInCart.quantity++
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            console.log('Cart updated successfully.');
        } catch (error) {
            throw new Error (error.message);
        }
    }
}

module.exports = CartManager;