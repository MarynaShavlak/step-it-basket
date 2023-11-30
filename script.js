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
    console.log('product: ', this.product);

    const element = document.createElement('div');
    element.id = `good-${id}`;
    element.className = 'good';

    const img = document.createElement('img');
    img.src = image;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const priceElement = document.createElement('p');
    priceElement.textContent = ` ₴${price}`;
    priceElement.className = 'good-price';

    const button = document.createElement('button');
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

const store = new Store();
store.render();
