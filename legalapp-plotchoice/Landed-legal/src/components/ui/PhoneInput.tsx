import React from 'react';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';

interface PhoneInputProps {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  placeholder = 'WhatsApp / Mobile Number',
  className = ''
}) => {
  const countryOptions = [
    { value: '+91', label: '🇮🇳 +91' },
    { value: '+1', label: '🇺🇸 +1' },
    { value: '+44', label: '🇬🇧 +44' },
    { value: '+971', label: '🇦🇪 +971' },
    { value: '+65', label: '🇸🇬 +65' }
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="w-28 flex-shrink-0">
        <SelectInput
          options={countryOptions}
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <TextInput
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
