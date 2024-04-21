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
                const data = await fs.readFile(this.path, 'utf8');
                if (data.trim() !== '') {
                    products = JSON.parse(data);
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('Error reading file:', error);
                }
            }

            const control_code = products.find(e => e.code === code);
            if (control_code) {
                throw new Error('A product with this code has already been entered');
            }

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
            console.log('Product added successfully.');
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            return products;
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


    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            let products = JSON.parse(data);
            const index = products.findIndex(e => e.id === id);
    
            if (index === -1) {
                console.log("Error: Product not found");
                return;
            }
    
            const deletedProduct = products[index];
    
            const nullProduct = { id: deletedProduct.id };
            for (const key in deletedProduct) {
                if (key !== 'id') {
                    nullProduct[key] = null;
                }
            }
    
            products[index] = nullProduct;
    
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    async updateProduct(id, fieldToUpdate, newValue) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);  
            const index = products.findIndex(e => e.id === id);
            
            if (index === -1) {
                console.log("Error: Product not found");
                return;
            }

            if (fieldToUpdate === 'id') {
                console.log("Error: Cannot update ID field");
                return;
            }

            if (!products[index].hasOwnProperty(fieldToUpdate)) {
                console.log("Error: Field to update is not valid");
                return;
            }

            products[index][fieldToUpdate] = newValue;

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Product updated successfully.');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

}

module.exports = ProductManager;
