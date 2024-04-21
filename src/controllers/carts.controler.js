const fs = require('fs').promises
const path = require('path');

class CartManager {
    constructor(){
        this.path = path.resolve(__dirname, '../carts.json');
    }
}
module.exports = CartManager;