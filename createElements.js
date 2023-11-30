export function createCartItemElement(id) {
  const cartItemElement = document.createElement('div');
  cartItemElement.className = 'cart-item';
  cartItemElement.setAttribute('data-id', id);
  return cartItemElement;
};

export function createImageElement(image) {
  const imgElement = document.createElement('img');
  imgElement.className = 'cart-image';
  imgElement.src = image;
  return imgElement;
};

export function createTitleElement(title) {
  const titleElement = document.createElement('h4');
  titleElement.className = 'cart-title';
  titleElement.textContent = title;
  return titleElement;
};

export function createPriceElement(price) {
  const priceElement = document.createElement('p');
  priceElement.className = 'cart-price';
  priceElement.textContent = `₴${price}.00`;
  return priceElement;
};

export function createQuantityElement(quantity) {
  const quantityElement = document.createElement('p');
  quantityElement.className = 'cart-quantity';
  quantityElement.textContent = `${quantity}`;
  return quantityElement;
};

export function createTotalCostElement(price, quantity) {
  const totalCostElement = document.createElement('p');
  totalCostElement.className = 'cart-total-quantity';
  totalCostElement.textContent = `₴${price * quantity}.00`;
  return totalCostElement;
};

export function createControlQuantityBtn(html, onClick) {
  const button = document.createElement('button');
  button.className = 'quantity-btn';
  button.innerHTML = html;
  button.addEventListener('click', onClick);
  return button;
};

export function createDeleteProductBtn(onClick) {
  const button = document.createElement('button');
  button.className = 'delete-btn';
  button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  button.addEventListener('click', onClick);
  return button;
};


export function createHeaderElement() {
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
