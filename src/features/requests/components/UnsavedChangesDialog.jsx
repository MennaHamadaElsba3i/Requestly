import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';

export const UnsavedChangesDialog = ({
  isOpen,
  onStay,
  onDiscard,
  title = 'Unsaved changes',
  message = 'You have unsaved changes. Are you sure you want to leave without saving?',
}) => {
  const stayButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus safe action by default
    stayButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onStay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-dialog-title"
      aria-describedby="unsaved-dialog-description"
      data-testid="unsaved-changes-dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-xl border border-slate-200/90 shadow-xl p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h3 id="unsaved-dialog-title" className="text-base font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p id="unsaved-dialog-description" className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <Button
            ref={stayButtonRef}
            type="button"
            variant="secondary"
            size="md"
            onClick={onStay}
            data-testid="stay-editing-btn"
            className="w-full sm:w-auto"
          >
            Continue Editing
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onDiscard}
            data-testid="discard-changes-btn"
            className="w-full sm:w-auto"
          >
            Discard Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
