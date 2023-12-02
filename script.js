// import {
//   createCartItemElement,
//   createImageElement,
//   createTitleElement,
//   createPriceElement,
//   createQuantityElement,
//   createTotalCostElement,
//   createControlQuantityBtn,
//   createDeleteProductBtn,
//   createHeaderElement,
// } from './createElements.js';

class Product {
  static category = 'Movies';
  constructor(id, title, img, price) {
    this.id = id;
    this.title = title;
    this.image = img;
    this.price = price;
  }
}

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
      const renderGood = new ProductRenderer(item);
      const renderElement = renderGood.render();
      parentNode.appendChild(renderElement);
    });
  }
}

class ProductRenderer {
  constructor(Product) {
    this.product = Product;
  }

  createProductElement() {
    const { id, image, title, price } = this.product;
    const element = document.createElement('div');
    element.id = `good-${id}`;
    element.className = 'good';

    const img = document.createElement('img');
    img.src = image;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const priceElement = document.createElement('p');
    priceElement.textContent = ` ₴${price}`;
    priceElement.className = 'product-price';

    const button = document.createElement('button');
    button.className = 'product-add-btn';
    button.textContent = 'Купити';
    button.addEventListener('click', () => this.addToCart());

    element.appendChild(img);
    element.appendChild(titleElement);
    element.appendChild(priceElement);
    element.appendChild(button);

    return element;
  }
  render() {
    const renderElement = this.createProductElement();
    return renderElement;
  }

  addToCart() {
    store.cart.addToCart(this.product);
  }
}

class CartTablo {
  constructor() {
    this.goodsInCart = [];
    this.totalPrice = 0;
  }
  addToCart(good) {
    this.goodsInCart.push(good);
    this.totalPrice += good.price;
    this.updateCartDisplay();
  }

  deleteFromCart(good) {
    const id = good.id;
    const indexToRemove = this.goodsInCart.findIndex(item => item.id === id);
    if (indexToRemove !== -1) {
      this.goodsInCart.splice(indexToRemove, 1);
      this.totalPrice -= good.price;
      this.updateCartDisplay();
    }
  }

  deleteAllTheSameFromCart(good) {
    const oldLength = this.goodsInCart.length;
    const updatedArr = this.goodsInCart.filter(item => item.id !== good.id);
    const newLength = updatedArr.length;
    const deletedItemsQuantity = oldLength - newLength;
    this.goodsInCart = updatedArr;
    this.totalPrice -= deletedItemsQuantity * good.price;
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    const cartElement = document.querySelector('.cart');
    cartElement.querySelector('.goods-in-cart span').innerHTML =
      this.goodsInCart.length;
    cartElement.querySelector('.total-price span').innerHTML = this.totalPrice;
  }
}

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

class CartModalItem {
  constructor(product, cartDisplay) {
    this.product = product;
    this.cartDisplay = cartDisplay;
    this.id = product.id;
  }

  createCartItemElement(id) {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.setAttribute('data-id', id);
    return cartItemElement;
  }

  createImageElement(image) {
    const imgElement = document.createElement('img');
    imgElement.className = 'cart-image';
    imgElement.src = image;
    return imgElement;
  }

  createTitleElement(title) {
    const titleElement = document.createElement('h4');
    titleElement.className = 'cart-title';
    titleElement.textContent = title;
    return titleElement;
  }

  createPriceElement(price) {
    const priceElement = document.createElement('p');
    priceElement.className = 'cart-price';
    priceElement.textContent = `₴${price}.00`;
    return priceElement;
  }

  createQuantityElement(quantity) {
    const quantityElement = document.createElement('p');
    quantityElement.className = 'cart-quantity';
    quantityElement.textContent = `${quantity}`;
    return quantityElement;
  }

  createTotalCostElement(price, quantity) {
    const totalCostElement = document.createElement('p');
    totalCostElement.className = 'cart-total-quantity';
    totalCostElement.textContent = `₴${price * quantity}.00`;
    return totalCostElement;
  }

  createControlQuantityBtn(html, onClick) {
    const button = document.createElement('button');
    button.className = 'quantity-btn';
    button.innerHTML = html;
    button.addEventListener('click', onClick);
    return button;
  }

  createDeleteProductBtn(onClick) {
    const button = document.createElement('button');
    button.className = 'delete-btn';
    button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    button.addEventListener('click', onClick);
    return button;
  }

  createQuantityWrapElement(quantityElement) {
    const quantityWrap = document.createElement('div');
    quantityWrap.className = 'cart-quantity-wrap';
    quantityWrap.appendChild(
      this.createControlQuantityBtn('<i class="fa-solid fa-minus"></i>', () => {
        this.updateQuantity(-1);
      }),
    );
    quantityWrap.appendChild(quantityElement);
    quantityWrap.appendChild(
        this.createControlQuantityBtn('<i class="fa-solid fa-plus"></i>', () =>
        this.updateQuantity(1),
      ),
    );
    return quantityWrap;
  }

  handleCartUpdates(amount, el, good) {
    if (amount === -1 && this.product.quantity === 1) {
      store.cart.deleteAllTheSameFromCart(good);
      el.parentNode.removeChild(el);
    } else if (amount === -1) {
      store.cart.deleteFromCart(good);
    } else if (amount === 1) {
      store.cart.addToCart(good);
    } else if (amount === 0) {
      store.cart.deleteAllTheSameFromCart(good);
      el.parentNode.removeChild(el);
    }
  }

  updateItemInterface(el) {
    const quantityElement = el.querySelector(`.cart-quantity`);
    const totalCostElement = el.querySelector(`.cart-total-quantity`);
    if (quantityElement) {
      quantityElement.textContent = this.product.quantity;
    }

    if (totalCostElement) {
      totalCostElement.textContent = `₴${
        this.product.price * this.product.quantity
      }`;
    }
  }

  updateQuantity(amount) {
    const el = document.querySelector(`[data-id="${this.id}"]`);
    const good = {
      id: this.product.id,
      title: this.product.title,
      image: this.product.image,
      price: this.product.price,
    };
    this.handleCartUpdates(amount, el, good);
    this.product.quantity += amount;
    this.updateItemInterface(el);

    if (!store.cart.goodsInCart.length) {
      modal.cartDisplay.reset();
    }
  }
  render() {
    const { id, title, image, price, quantity } = this.product;

    const cartItemElement = this.createCartItemElement(id);
    const imgElement = this.createImageElement(image);
    const titleElement = this.createTitleElement(title);
    const priceElement = this.createPriceElement(price);
    const quantityElement = this.createQuantityElement(quantity);
    const totalCostElement = this.createTotalCostElement(price, quantity);
    const quantityWrap = this.createQuantityWrapElement(quantityElement);
    const deleteBtn = this.createDeleteProductBtn(() => {
      this.updateQuantity(0);
    });

    cartItemElement.appendChild(imgElement);
    cartItemElement.appendChild(titleElement);
    cartItemElement.appendChild(priceElement);
    cartItemElement.appendChild(quantityWrap);
    cartItemElement.appendChild(totalCostElement);
    cartItemElement.appendChild(deleteBtn);

    return cartItemElement;
  }
}

class Modal {
  constructor(cart) {
    this.cart = cart;
    this.refs = {
      openModalBtn: document.querySelector('[data-modal-open]'),
      closeModalBtn: document.querySelector('[data-modal-close]'),
      modal: document.querySelector('[data-modal]'),
    };

    this.setupModal();
  }

  setupModal() {
    this.refs.openModalBtn.addEventListener('click', () => this.toggleModal());
    this.refs.closeModalBtn.addEventListener('click', () => this.toggleModal());
    this.refs.modal.addEventListener('click', e => this.handleModalClose(e));

    this.cartDisplay = new CartModalList();
  }

  toggleModal() {
    document.body.classList.toggle('modal-open');
    this.refs.modal.classList.toggle('backdrop--hidden');
    this.cartDisplay.reset();
    this.cartDisplay.updateCartItems(this.cart.goodsInCart);
  }

  handleModalClose(e) {
    const backdrop = e.target;
    if (backdrop.classList.contains('backdrop')) {
      this.toggleModal();
    }
  }
}

class Store {
  constructor(productList, cart) {
    this.goodList = productList;
    this.cart = cart;
  }

  render() {
    this.goodList.render();
  }
}

const store = new Store(new ProductList(), new CartTablo());
store.render();
const modal = new Modal(store.cart);
