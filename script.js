import {
  createCartItemElement,
  createImageElement,
  createTitleElement,
  createPriceElement,
  createQuantityElement,
  createTotalCostElement,
  createControlQuantityBtn,
  createDeleteProductBtn,
  createHeaderElement,
} from './createElements.js';

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

class Cart {
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

class CartDisplay {
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
        cartItems.push(new CartItem(product, this));
      }
    });

    return cartItems;
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
    const headerElement = cartContainer.querySelector('.cart-item-header');
    cartContainer.innerHTML = '';
    if (!headerElement) {
      const newHeaderElement = createHeaderElement();
      cartContainer.appendChild(newHeaderElement);
    }
  }

  render() {
    const cartContainer = document.querySelector('.cart-display');
    const headerElement = cartContainer.querySelector('.cart-item-header');
    // if (!store.cart.goodsInCart.length) {
    //   const emptyEl = document.createElement('p');
    //   emptyEl.className = 'empty-cart';
    //   emptyEl.textContent = 'У корзину ще не додано жодного товару';
    //   cartContainer.appendChild(emptyEl);
    //   return;
    // }

    if (!headerElement && store.cart.goodsInCart.length ) {
      const newHeaderElement = createHeaderElement();
      cartContainer.appendChild(newHeaderElement);
    }
    // this.cartItemsElement = cartContainer;
    this.cartItems.forEach(cartItem => {
      if (cartItem.product.quantity) {
        const cartItemElement = cartItem.render();
        cartContainer.appendChild(cartItemElement);
      }
    });
  }
}

class CartItem {
  constructor(product, cartDisplay) {
    this.product = product;
    this.cartDisplay = cartDisplay;
    this.id = product.id;
  }

  render() {
    const { id, title, image, price, quantity } = this.product;

    const cartItemElement = createCartItemElement(id);
    const imgElement = createImageElement(image);
    const titleElement = createTitleElement(title);
    const priceElement = createPriceElement(price);
    const quantityElement = createQuantityElement(quantity);
    const totalCostElement = createTotalCostElement(price, quantity);
    const quantityWrap = this.createQuantityWrapElement(quantityElement);
    const deleteBtn = createDeleteProductBtn(() => {
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

  createQuantityWrapElement(quantityElement) {
    const quantityWrap = document.createElement('div');
    quantityWrap.className = 'cart-quantity-wrap';
    quantityWrap.appendChild(
      createControlQuantityBtn('<i class="fa-solid fa-minus"></i>', () => {
        this.updateQuantity(-1);
      }),
    );
    quantityWrap.appendChild(quantityElement);
    quantityWrap.appendChild(
      createControlQuantityBtn('<i class="fa-solid fa-plus"></i>', () =>
        this.updateQuantity(1),
      ),
    );
    return quantityWrap;
  }

  updateQuantity(amount) {
    const el = document.querySelector(`[data-id="${this.id}"]`);
    const quantityElement = el.querySelector(`.cart-quantity`);
    const totalCostElement = el.querySelector(`.cart-total-quantity`);

    const good = {
      id: this.product.id,
      title: this.product.title,
      image: this.product.image,
      price: this.product.price,
    };

    // if (this.product.quantity === 0) return;

    if (amount == -1 && this.product.quantity == 1) {
        store.cart.deleteAllTheSameFromCart(good);
      el.parentNode.removeChild(el);
    } else if (amount == -1) {
      store.cart.deleteFromCart(good);
    } else if (amount == 1) {
      store.cart.addToCart(good);
    } else if (amount == 0) {
      store.cart.deleteAllTheSameFromCart(good);
      el.parentNode.removeChild(el);
    }

    this.product.quantity += amount;
    

    if (quantityElement) {
      quantityElement.textContent = this.product.quantity;
    }

    if (totalCostElement) {
      totalCostElement.textContent = `₴${
        this.product.price * this.product.quantity
      }`;
    }
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

    this.cartDisplay = new CartDisplay();
    
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
  constructor() {
    this.goodList = new ProductList();
    this.cart = new Cart();
  }

  render() {
    this.goodList.render();
  }
}

const store = new Store();
store.render();
const modal = new Modal(store.cart);
