import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
  Pending: {
    dot: 'bg-amber-500',
    trigger: 'bg-amber-50/90 text-amber-900 border-amber-200/90 hover:bg-amber-100/70 hover:border-amber-300',
    selected: 'bg-amber-50 text-amber-900 font-semibold',
  },
  'In Progress': {
    dot: 'bg-blue-500',
    trigger: 'bg-blue-50/90 text-blue-900 border-blue-200/90 hover:bg-blue-100/70 hover:border-blue-300',
    selected: 'bg-blue-50 text-blue-900 font-semibold',
  },
  Completed: {
    dot: 'bg-emerald-500',
    trigger: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/90 hover:bg-emerald-100/70 hover:border-emerald-300',
    selected: 'bg-emerald-50 text-emerald-900 font-semibold',
  },
  Cancelled: {
    dot: 'bg-slate-400',
    trigger: 'bg-slate-100/90 text-slate-800 border-slate-200/90 hover:bg-slate-200/60 hover:border-slate-300',
    selected: 'bg-slate-100 text-slate-800 font-semibold',
  },
};

/**
 * Reusable CustomDropdown Component
 * Fully custom modern React dropdown replacing native HTML selects across the app.
 *
 * Meets all user design requirements:
 * - Trigger: clear visible border, moderate radius (rounded-lg), clean background, comfortable padding, subtle shadow, smooth transitions, professional typography, aligned ChevronDown
 * - Popover Menu: white background, rounded-xl corners, subtle border, soft shadow, comfortable padding, gap from trigger, clean option typography, clear hover & selected states, checkmark (✓), Framer Motion entrance/exit animation
 * - Supports options array (objects or strings) or <option> children
 * - Dual event dispatch: sends synthetic event { target: { value } } and works with both (e) => fn(e.target.value) and (val) => fn(val)
 * - Hidden native select for testing library and browser accessibility compatibility
 */
export const CustomDropdown = forwardRef(
  (
    {
      id,
      value,
      onChange,
      options,
      children,
      placeholder = 'Select an option',
      disabled = false,
      size = 'md', // 'sm' | 'md' | 'lg'
      align = 'left', // 'left' | 'right'
      className = '',
      triggerClassName = '',
      menuClassName = '',
      leftIcon = null,
      isStatusVariant = false,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Normalize options from array of strings, array of objects, or React option children
    const normalizedOptions = useMemo(() => {
      if (Array.isArray(options)) {
        return options.map((opt) => {
          if (typeof opt === 'object' && opt !== null) {
            return {
              value: String(opt.value),
              label: opt.label ?? String(opt.value),
            };
          }
          return { value: String(opt), label: String(opt) };
        });
      }
      if (children) {
        return React.Children.toArray(children)
          .filter((child) => React.isValidElement(child) && child.type === 'option')
          .map((child) => ({
            value: String(child.props.value ?? child.props.children),
            label: child.props.children ?? String(child.props.value),
          }));
      }
      return [];
    }, [options, children]);

    // Find current selected option
    const selectedOption = normalizedOptions.find((opt) => opt.value === String(value));
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    // Close on click outside and escape key
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const handleSelect = (newValue) => {
      setIsOpen(false);
      if (onChange) {
        // Create a synthetic event that works whether caller expects e.target.value or string value
        const syntheticEvent = {
          target: { value: newValue, name: id || testId, id },
          currentTarget: { value: newValue, name: id || testId, id },
          value: newValue,
          toString: () => newValue,
          valueOf: () => newValue,
          [Symbol.toPrimitive]: () => newValue,
        };
        onChange(syntheticEvent);
      }
    };

    // Height & padding size variants
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9.5 px-3.5 text-xs sm:text-sm',
      lg: 'h-11 px-4 text-sm',
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    // Status variant styling
    const statusStyle =
      isStatusVariant && STATUS_COLORS[value]
        ? STATUS_COLORS[value].trigger
        : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15';

    return (
      <div
        ref={containerRef}
        className={`relative inline-block text-left w-full ${className}`}
        data-testid={testId ? `${testId}-wrapper` : undefined}
      >
        {/* Custom Visual Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || displayLabel}
          className={`w-full flex items-center justify-between gap-2.5 border rounded-lg shadow-2xs font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${currentSize} ${statusStyle} ${triggerClassName}`}
        >
          <div className="flex items-center gap-2 truncate">
            {leftIcon && (
              <span className="text-slate-400 shrink-0 flex items-center">
                {leftIcon}
              </span>
            )}
            {isStatusVariant && STATUS_COLORS[value] && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[value].dot}`} />
            )}
            <span className="truncate">{displayLabel}</span>
          </div>

          <ChevronDown
            size={13}
            className={`text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform duration-200 stroke-[2.2] ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </button>

        {/* Custom Framer Motion Popover Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              role="listbox"
              aria-label={ariaLabel || displayLabel}
              className={`absolute ${
                align === 'right' ? 'right-0' : 'left-0'
              } top-full mt-1.5 z-50 min-w-full w-max max-w-xs bg-white rounded-xl border border-slate-200/90 shadow-lg shadow-slate-900/8 p-1.5 space-y-0.5 max-h-64 overflow-y-auto focus:outline-none ${menuClassName}`}
            >
              {normalizedOptions.map((opt) => {
                const isSelected = opt.value === String(value);
                const hasStatusColor = isStatusVariant && STATUS_COLORS[opt.value];

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                      isSelected
                        ? isStatusVariant && STATUS_COLORS[opt.value]
                          ? `${STATUS_COLORS[opt.value].selected}`
                          : 'text-blue-600 bg-blue-50/70 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {hasStatusColor && (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasStatusColor.dot}`} />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Native Select: Keeps test-runners, synthetic user events, and forms 100% functional */}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
          disabled={disabled}
          data-testid={testId}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only pointer-events-none absolute -bottom-1 -left-1 opacity-0 w-0 h-0 overflow-hidden"
          {...props}
        >
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

CustomDropdown.displayName = 'CustomDropdown';
