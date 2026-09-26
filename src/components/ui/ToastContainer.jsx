import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { removeToast } from '../../app/store/slices/uiSlice';

const TOAST_THEMES = {
  success: {
    border: 'border-emerald-200/80',
    icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={17} />,
    bg: 'bg-emerald-50/40',
  },
  error: {
    border: 'border-rose-200/80',
    icon: <XCircle className="text-rose-600 shrink-0" size={17} />,
    bg: 'bg-rose-50/40',
  },
  warning: {
    border: 'border-amber-200/80',
    icon: <AlertCircle className="text-amber-600 shrink-0" size={17} />,
    bg: 'bg-amber-50/40',
  },
  info: {
    border: 'border-blue-200/80',
    icon: <Info className="text-blue-600 shrink-0" size={17} />,
    bg: 'bg-blue-50/40',
  },
};

const ToastItem = ({ toast }) => {
  const dispatch = useAppDispatch();
  const theme = TOAST_THEMES[toast.type] || TOAST_THEMES.info;

  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto w-full bg-white/95 backdrop-blur-sm border ${theme.border} ${theme.bg} rounded-xl shadow-md p-3.5 flex items-start justify-between gap-3 text-sm text-slate-800`}
      role="alert"
      aria-live="polite"
      data-testid={`toast-${toast.type}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="mt-0.5">{theme.icon}</span>
        <span className="text-xs font-medium text-slate-800 leading-snug break-words">
          {toast.message}
        </span>
      </div>
      <button
        type="button"
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0" aria-live="assertive">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
