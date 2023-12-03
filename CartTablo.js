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

  removeItemFromCart(good) {
    const id = good.id;
    const indexToRemove = this.goodsInCart.findIndex(item => item.id === id);
    if (indexToRemove !== -1) {
      this.goodsInCart.splice(indexToRemove, 1);
      this.totalPrice -= good.price;
      this.updateCartDisplay();
    }
  }

  removeAllSameItemFromCart(good) {
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

export default CartTablo;