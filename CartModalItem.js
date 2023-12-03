import { store } from './script.js';
import { modal } from './script.js';

class CartModalItem {
  constructor(product, cartDisplay) {
    this.product = product;
    this.cartDisplay = cartDisplay;
    this.id = product.id;
  }

  createElement(elementType, className, content) {
    const element = document.createElement(elementType);
    element.className = className;
    if (content) element.innerHTML = content;
    return element;
  }

  createCartItemElement(id) {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.dataset.id = id;
    return cartItemElement;
  }

  createImageElement(image) {
    const imgElement = document.createElement('img');
    imgElement.className = 'cart-image';
    imgElement.src = image;
    return imgElement;
  }

  createTitleElement(title) {
    return this.createElement('h4', 'cart-title', title);
  }

  createPriceElement(price) {
    return this.createElement('p', 'cart-price', `₴${price}.00`);
  }

  createQuantityElement(quantity) {
    return this.createElement('p', 'cart-quantity', quantity);
  }

  createTotalCostElement(price, quantity) {
    return this.createElement(
      'p',
      'cart-total-quantity',
      `₴${price * quantity}.00`,
    );
  }

  createButton(className, html, onClick) {
    const button = this.createElement('button', className, html);
    button.addEventListener('click', onClick);
    return button;
  }

  createDeleteProductBtn(onClick) {
    return this.createButton(
      'delete-btn',
      '<i class="fa-solid fa-xmark"></i>',
      onClick,
    );
  }

  createQuantityWrapElement(quantityElement) {
    const MINUS_ICON = '<i class="fa-solid fa-minus"></i>';
    const PLUS_ICON = '<i class="fa-solid fa-plus"></i>';
    const quantityWrap = this.createElement('div', 'cart-quantity-wrap');
    quantityWrap.appendChild(
      this.createButton('quantity-btn', MINUS_ICON, () =>
        this.updateQuantity(-1),
      ),
    );
    quantityWrap.appendChild(quantityElement);
    quantityWrap.appendChild(
      this.createButton('quantity-btn', PLUS_ICON, () =>
        this.updateQuantity(1),
      ),
    );
    return quantityWrap;
  }

  handleCartUpdates(amount, el, good) {
    if ((amount === -1 && this.product.quantity === 1) || amount === 0) {
      store.cart.removeAllSameItemFromCart(good);
      el.parentNode.removeChild(el);
    } else if (amount === -1) {
      store.cart.removeItemFromCart(good);
    } else if (amount === 1) {
      store.cart.addToCart(good);
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
    const good = { ...this.product };
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

export default CartModalItem;