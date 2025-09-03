// FILE: /components/forms/FormRow.tsx
import React from 'react';

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
  cols?: 1 | 2 | 3 | 4;
  align?: 'start' | 'center' | 'end';
}

export function FormRow({
  children,
  className = '',
  gap = 'md',
  cols = 1,
  align = 'start'
}: FormRowProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  return (
    <div
      className={`
        grid ${gridCols[cols]} ${gapClasses[gap]} ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  required = false,
  error,
  helpText,
  className = ''
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  title,
  children,
  className = '',
  collapsible = false,
  defaultOpen = true
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
      >
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <svg
          className={`h-5 w-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
