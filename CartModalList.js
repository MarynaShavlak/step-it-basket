import CartModalItem from './CartModalItem.js';
import { store } from './script.js';

class CartModalList {
  constructor() {
    this.cartItems = [];
    this.render();
  }

  createProductMap(products) {
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

    return productMap;
  }

  buildCartItems(productMap, context) {
    const cartItems = [];

    productMap.forEach(product => {
      const existingCartItem = this.findCartItemById(product.id, context);
      if (existingCartItem) {
        existingCartItem.this.updateQuantity(product.quantity);
        cartItems.push(existingCartItem);
      } else {
        cartItems.push(new CartModalItem(product, context));
      }
    });

    return cartItems;
  }

  createCartItems(products) {
    const productMap = this.createProductMap(products);
    const cartItems = this.buildCartItems(productMap, this);
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

  createFooterElement(items) {
    const { quantity, sum } = this.calculateCartResults(items);
    const footerElement = document.createElement('div');
    footerElement.className = 'cart-item cart-item-footer';

    const titleFooter = document.createElement('p');
    titleFooter.className = 'cart-title-footer';
    titleFooter.textContent = 'Всього';
    footerElement.appendChild(titleFooter);

    const quantityFooter = document.createElement('p');
    quantityFooter.textContent = quantity;
    quantityFooter.className = 'cart-quantity-wrap-footer';
    footerElement.appendChild(quantityFooter);

    const totalCostFooter = document.createElement('p');
    totalCostFooter.textContent = '₴ ' + sum + '.00';
    totalCostFooter.className = 'cart-total-quantity-footer';
    footerElement.appendChild(totalCostFooter);

    return footerElement;
  }

  calculateCartResults(items) {
    const sum = items.reduce((accumulator, item) => {
      return accumulator + item.price;
    }, 0);
    const quantity = items.length;
    return { quantity, sum };
  }

  updateCartResults(items) {
    const { quantity, sum } = this.calculateCartResults(items);
    const quantityEl = document.querySelector('.cart-quantity-wrap-footer');
    const sumEl = document.querySelector('.cart-total-quantity-footer');
    quantityEl.textContent = quantity;
    sumEl.textContent = '₴ ' + sum + '.00';
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

  renderHeader(cartContainer) {
    const headerElement = cartContainer.querySelector('.cart-item-header');
    if (!headerElement && store.cart.goodsInCart.length) {
      const newHeaderElement = this.createHeaderElement();
      cartContainer.appendChild(newHeaderElement);
    }
  }

  renderFooter(cartContainer) {
    const footerElement = cartContainer.querySelector('.cart-item-footer');
    if (!footerElement && store.cart.goodsInCart.length) {
      const newFooterElement = this.createFooterElement(store.cart.goodsInCart);
      cartContainer.appendChild(newFooterElement);
    }
  }

  renderCartItems(cartContainer) {
    const fragment = document.createDocumentFragment();
    this.cartItems.forEach(cartItem => {
      if (cartItem.product.quantity) {
        const cartItemElement = cartItem.render();
        fragment.appendChild(cartItemElement);
      }
    });

    cartContainer.appendChild(fragment);
  }

  render() {
    const cartContainer = document.querySelector('.cart-display');
    this.renderHeader(cartContainer);
    this.renderCartItems(cartContainer);
    this.renderFooter(cartContainer);
  }
}

export default CartModalList;
