setupModal();

function setupModal() {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);
  refs.modal.addEventListener('click', handleModalClose);

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    refs.modal.classList.toggle('backdrop--hidden');
  }

  function handleModalClose(e) {
    const backdrop  = e.target;
    if(backdrop.classList.contains('backdrop') ) {
      toggleModal();
    }
    
  }
  


}