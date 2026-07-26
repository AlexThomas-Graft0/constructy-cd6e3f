'use client';

import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'default' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}) => {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#1677ff] text-white hover:bg-[#0958d9] focus:ring-[#1677ff]",
    default: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-[#1677ff]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626]",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  step,
  min,
}: {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  step?: string;
  min?: string;
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      step={step}
      min={min}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1677ff] focus:ring-[#1677ff] sm:text-sm px-3 py-2 border"
    />
  </div>
);

export const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1677ff] focus:ring-[#1677ff] sm:text-sm px-3 py-2 border bg-white"
    >
      <option value="" disabled>Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const TableWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      {children}
    </table>
  </div>
);

export const Th = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900 uppercase tracking-wider text-xs ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 whitespace-nowrap text-gray-700 ${className}`}>
    {children}
  </td>
);

export const Alert = ({ message, type = 'error' }: { message: string; type?: 'error' | 'success' }) => (
  <div className={`p-4 rounded-md mb-4 text-sm ${type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
    {message}
  </div>
);

export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);