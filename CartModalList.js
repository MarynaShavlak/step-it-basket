import CartModalItem from './CartModalItem.js';
import { store } from './script.js';

class CartModalList {
  constructor() {
    this.cartItems = [];
    this.render();
  }

  createCartItems(products) {
    const cartItems = [];
    const productMap = new Map();

    products.forEach(product => {
      const { id, title, image, price } = product;
      const key = `${id}_${title}`;

      if (productMap.has(key)) {
        productMap.get(key).quantity += 1;
      } else {
        productMap.set(key, { id, title, image, price, quantity: 1 });
      }
    });

    productMap.forEach(product => {
      const existingCartItem = this.findCartItemById(product.id);
      if (existingCartItem) {
        existingCartItem.updateQuantity(product.quantity);
        cartItems.push(existingCartItem);
      } else {
        cartItems.push(new CartModalItem(product, this));
      }
    });

    return cartItems;
  }

  createHeaderElement() {
    const headerElement = document.createElement('div');
    headerElement.className = 'cart-item cart-item-header';

    const itemHeader = document.createElement('div');
    itemHeader.textContent = 'Фото';
    itemHeader.className = 'cart-title-img';
    headerElement.appendChild(itemHeader);

    const titleHeader = document.createElement('h4');
    titleHeader.className = 'cart-title';
    titleHeader.textContent = 'Назва';
    titleHeader.className = 'cart-title';
    headerElement.appendChild(titleHeader);

    const priceHeader = document.createElement('div');
    priceHeader.textContent = 'Ціна';
    priceHeader.className = 'cart-price';
    headerElement.appendChild(priceHeader);

    const quantityHeader = document.createElement('div');
    quantityHeader.textContent = 'Кількість';
    quantityHeader.className = 'cart-quantity-wrap';
    headerElement.appendChild(quantityHeader);

    const totalCostHeader = document.createElement('div');
    totalCostHeader.textContent = 'Загальна вартість';
    totalCostHeader.className = 'cart-total-quantity';
    headerElement.appendChild(totalCostHeader);

    return headerElement;
  }

  findCartItemById(id) {
    return this.cartItems.find(cartItem => cartItem.id === id);
  }

  updateCartItems(products) {
    this.cartItems = [];
    this.cartItems = this.createCartItems(products);
    this.render();
  }

  reset() {
    const cartContainer = document.querySelector('.cart-display');
    cartContainer.innerHTML = '';
    if (!store.cart.goodsInCart.length) {
      const emptyEl = document.createElement('p');
      emptyEl.className = 'empty-cart';
      emptyEl.textContent = 'У корзину ще не додано жодного товару';
      cartContainer.appendChild(emptyEl);
      return;
    }
  }

  render() {
    const cartContainer = document.querySelector('.cart-display');
    const headerElement = cartContainer.querySelector('.cart-item-header');

    if (!headerElement && store.cart.goodsInCart.length) {
      const newHeaderElement = this.createHeaderElement();
      cartContainer.appendChild(newHeaderElement);
    }
    this.cartItems.forEach(cartItem => {
      if (cartItem.product.quantity) {
        const cartItemElement = cartItem.render();
        cartContainer.appendChild(cartItemElement);
      }
    });
  }
}

export default CartModalList;