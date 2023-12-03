import Product from './Product.js';
import ProductRenderer from './ProductRenderer.js';
import { store } from './script.js';

class ProductList {
  static initializeProducts() {
    return [
      new Product(1, 'Jumanji', 'images/Jumanji.webp', 580),
      new Product(2, '13 Minutes', 'images/13 Minutes.webp', 590),
      new Product(3, 'Aquaman', 'images/Aquaman.webp', 350),
      new Product(4, 'Venom', 'images/Venom.webp', 350),
    ];
  }
  constructor() {
    this.products = ProductList.initializeProducts();
  }

  render() {
    const parentNode = document.querySelector('.goods');
    this.products.forEach(item => {
        const renderGood = new ProductRenderer(item, (product) => {
            store.cart.addToCart(product); 
          });
      const renderElement = renderGood.render();
      parentNode.appendChild(renderElement);
    });
  }
}

export default ProductList;