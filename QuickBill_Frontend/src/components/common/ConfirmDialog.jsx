import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="p-3 bg-red-50 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-xs">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading} className="flex-1">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
