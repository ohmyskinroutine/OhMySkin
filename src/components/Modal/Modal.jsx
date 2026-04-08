import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  text,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <p className="modal__text">{text}</p>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className="modal__btn modal__btn--confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
