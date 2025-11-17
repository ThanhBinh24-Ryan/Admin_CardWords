import React from 'react';
import { TextInput } from 'flowbite-react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text' }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <TextInput type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default InputField;