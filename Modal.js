import CartModalList from './CartModalList.js';

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

export default Modal;