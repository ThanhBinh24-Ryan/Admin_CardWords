// ...existing code...
import React from 'react';
import { Modal } from 'flowbite-react';

// ...existing code...
interface ModalConfirmProps {
  show: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  children?: React.ReactNode;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  show,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Modal show={show} onClose={handleClose}>
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t flex justify-end gap-2">
        <button onClick={handleConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
          Confirm
        </button>
        <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
// ...existing code...