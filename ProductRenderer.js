class ProductRenderer {
  constructor(product, addToCartCallback) {
    this.product = product;
    this.addToCartCallback = addToCartCallback;
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
    button.addEventListener('click', () => this.addToCartCallback(this.product));

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

}

export default ProductRenderer;