class Store {
  constructor(productList, cart) {
    this.goodList = productList;
    this.cart = cart;
  }

  render() {
    this.goodList.render();
  }
}

export default Store;