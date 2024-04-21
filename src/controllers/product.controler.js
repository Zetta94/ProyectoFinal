const fs = require('fs').promises
const path = require('path');

class ProductManager {
    constructor(){
        this.path = path.resolve(__dirname, '../products.json');
    }

    async addProduct(title, description, code, price, stock, category, thumbnail){
        try {
            let products = [];

            try {
                const data = await fs.readFile(this.path, 'utf8')
                if (data.trim() !== '') {
                    products = JSON.parse(data);
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error)
                }
            }

            const control_code = products.find(e => e.code === code)
            if (control_code) {
                throw new Error('A product with this code has already been entered')
            }else{
                const id = products.length + 1;

                const product = {
                    id : id,
                    title : title,
                    description : description,
                    code: code,
                    price : price,
                    status: true,
                    stock : stock,
                    category: category,
                    thumbnail: thumbnail
                };

                products.push(product);

                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            }

            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            const product_list = products.filter(e => e.status === true);
            return product_list;
        } catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            const product_find = products.find(e => e.id === id);
            
            if (!product_find) {
                console.log("Error: Not Found");
                return null;
            } else {
                return product_find;
            }
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    }

    //Se implemento un borrado logico. No se elimina por completo el producto, sino que se cambia su status.

    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            let products = JSON.parse(data);
            const index = products.findIndex(e => e.id === id);
    
            if (index === -1) {
                console.log("Error: Product not found");
                return;
            }
    
            products[index].status = false;
    
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Product deleted successfully.');
        } catch (error) {
            throw new Error('Error deleting product:'+ error);
        }
    }

    async updateProduct(id, fieldToUpdate, newValue) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);  
            const index = products.findIndex(e => e.id === id);
            
            if (index === -1) {
                throw new Error("Product not found");
            }
            
            if (fieldToUpdate === 'id') {
                throw new Error("Cannot update ID field");
            }
            
            if (!products[index].hasOwnProperty(fieldToUpdate)) {
                throw new Error("Field to update is not valid");
            }

            products[index][fieldToUpdate] = newValue;

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Product updated successfully.');
        } catch (error) {
            throw new Error ('Error updating product:' + error.message);
        }
    }

}

module.exports = ProductManager;
