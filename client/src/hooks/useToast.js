// src/hooks/useToast.js
import { useState } from 'react';

const useToast = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  const showToast = (severity, message) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  return {
    open,
    severity,
    message,
    showToast,
    hideToast,
  };
};

export default useToast;
