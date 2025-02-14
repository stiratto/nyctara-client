import clsx from "clsx";
import React from "react";

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  accepts?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { name, type, placeholder, accepts, onChange, value, className, disabled },
    ref,
  ) => {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        accept={accepts}
        value={value}
        className={clsx(
          `bg-transparent border-b border-black p-2 focus:outline-hidden w-full`,
          className,
        )}
        onChange={onChange}
        ref={ref}
        disabled={disabled}
      />
    );
  },
);

export default Input;
