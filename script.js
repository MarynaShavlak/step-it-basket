import Store from './Store.js';
import Modal from './Modal.js';
import ProductList from './ProductList.js';
import CartTablo from './CartTablo.js';

export const store = new Store(new ProductList(), new CartTablo());
store.render();
export const modal = new Modal(store.cart);
