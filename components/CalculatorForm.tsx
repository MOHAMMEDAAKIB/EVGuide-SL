'use client';

import { ReactNode } from 'react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'range' | 'checkbox' | 'radio';
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  unit?: string;
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface CalculatorFormProps {
  steps?: FormStep[];
  fields?: FormField[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitLabel?: string;
  variant?: 'simple' | 'wizard';
  currentStep?: number;
  onStepChange?: (step: number) => void;
  errors?: Record<string, string>;
  children?: ReactNode;
}

export default function CalculatorForm({
  steps,
  fields,
  values,
  onChange,
  onSubmit,
  isLoading = false,
  submitLabel = 'Calculate',
  variant = 'simple',
  currentStep = 0,
  onStepChange,
  errors = {},
  children,
}: CalculatorFormProps) {
  const renderField = (field: FormField) => {
    const value = values[field.id] ?? '';
    const error = errors[field.id];

    const commonClasses =
      'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors';

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-900 dark:text-white">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'text' && (
          <input
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={commonClasses}
          />
        )}

        {field.type === 'number' && (
          <div className="relative">
            <input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              required={field.required}
              className={commonClasses}
            />
            {field.unit && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                {field.unit}
              </span>
            )}
          </div>
        )}

        {field.type === 'select' && (
          <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            className={commonClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'range' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {field.min} {field.unit}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {value} {field.unit}
              </span>
              <span>
                {field.max} {field.unit}
              </span>
            </div>
            <input
              id={field.id}
              type="range"
              value={value}
              onChange={(e) => onChange(field.id, parseFloat(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>
        )}

        {field.type === 'checkbox' && (
          <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
            <input
              id={field.id}
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(field.id, e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
          </label>
        )}

        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {field.helpText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  if (variant === 'wizard' && steps) {
    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          {currentStepData.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">{currentStepData.description}</p>
          )}

          <div className="space-y-4">
            {currentStepData.fields.map((field) => renderField(field))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onStepChange?.(currentStep - 1)}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{submitLabel}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStepChange?.(currentStep + 1)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </form>
    );
  }

  // Simple variant
  const fieldsToRender = fields || (steps ? steps[0].fields : []);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="space-y-4">
          {fieldsToRender.map((field) => renderField(field))}
        </div>

        {children}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        )}
        <span>{submitLabel}</span>
      </button>
    </form>
  );
}
