import {
  createCartItemElement,
  createImageElement,
  createTitleElement,
  createPriceElement,
  createQuantityElement,
  createTotalCostElement,
  createButton,
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

  updateCartDisplay() {
    const cartElement = document.querySelector('.cart');
    cartElement.querySelector('.goods-in-cart span').innerHTML =
      this.goodsInCart.length;
    cartElement.querySelector('.total-price span').innerHTML = this.totalPrice;
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

class CartDisplay {
  constructor() {
    this.cartItems = [];
    this.render();
  }

  createCartItems(products) {
    console.log('products: ', products);
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
      cartItems.push(new CartItem(product, this));
    });

    return cartItems;
  }

  updateCartItems(products) {
    this.cartItems = this.createCartItems(products);
    this.render();
  }

  render() {
    const cartContainer = document.querySelector('.cart-display');
    const headerElement = cartContainer.querySelector('.cart-item-header');
    if (!headerElement) {
      const newHeaderElement = createHeaderElement();
      cartContainer.appendChild(newHeaderElement);
    }

    this.cartItems.forEach(cartItem => {
      const cartItemElement = cartItem.render();
      cartContainer.appendChild(cartItemElement);
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
    console.log('this.product: ', this.product);

    const cartItemElement = createCartItemElement(id);
    const imgElement = createImageElement(image);
    const titleElement = createTitleElement(title);
    const priceElement = createPriceElement(price);
    const quantityElement = createQuantityElement(quantity);
    const totalCostElement = createTotalCostElement(price, quantity);
    const quantityWrap = this.createQuantityWrapElement(quantityElement);

    cartItemElement.appendChild(imgElement);
    cartItemElement.appendChild(titleElement);
    cartItemElement.appendChild(priceElement);
    cartItemElement.appendChild(quantityWrap);
    cartItemElement.appendChild(totalCostElement);

    return cartItemElement;
  }

  createQuantityWrapElement(quantityElement) {
    const quantityWrap = document.createElement('div');
    quantityWrap.className = 'cart-quantity-wrap';
    quantityWrap.appendChild(
      createButton('<i class="fa-solid fa-minus"></i>', () => {
        console.log('click');
        this.updateQuantity(-1);
      }),
    );
    quantityWrap.appendChild(quantityElement);
    quantityWrap.appendChild(
      createButton('<i class="fa-solid fa-plus"></i>', () =>
        this.updateQuantity(1),
      ),
    );
    return quantityWrap;
  }

  updateQuantity(amount) {
    this.product.quantity += amount;
    this.render();
    console.log(store);
    store.cart.addToCart(this.product);
    this.cartDisplay.updateCartItems(store.cart.goodsInCart);
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
    this.cartDisplay.render();
  }

  toggleModal() {
    document.body.classList.toggle('modal-open');
    this.refs.modal.classList.toggle('backdrop--hidden');
    this.cartDisplay.updateCartItems(this.cart.goodsInCart);
  }

  handleModalClose(e) {
    const backdrop = e.target;
    if (backdrop.classList.contains('backdrop')) {
      this.toggleModal();
    }
  }
}

const store = new Store();
const modal = new Modal(store.cart);
store.render();
