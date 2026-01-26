import { InputHTMLAttributes, forwardRef } from 'react';

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable form checkbox component with label, error handling, and consistent styling
 */
export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`
                w-5 h-5 bg-slate-800/50 border rounded
                text-blue-600 focus:ring-2 focus:ring-blue-500/50
                transition-all cursor-pointer
                ${error 
                  ? 'border-red-500/50' 
                  : 'border-slate-700'
                }
                ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
              `}
              {...props}
            />
          </div>
          <div className="ml-3">
            <label className="text-sm font-medium text-gray-300 cursor-pointer">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {!error && helperText && (
              <p className="text-xs text-gray-400 mt-1">{helperText}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1 ml-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

