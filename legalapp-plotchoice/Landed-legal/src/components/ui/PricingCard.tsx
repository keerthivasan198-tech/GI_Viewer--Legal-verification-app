import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface PricingCardProps {
  price?: string;
  originalPrice?: string;
  onPaySubmit?: () => void;
  loading?: boolean;
  ctaText?: string;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  price = '₹399',
  originalPrice = '₹999',
  onPaySubmit,
  loading = false,
  ctaText = 'Pay ₹399 and run the search',
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card flex flex-col justify-between ${className}`}>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-brand-700 font-extrabold text-xs rounded-full mb-4 border border-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Verification Report Fee</span>
        </div>

        <div className="flex items-baseline gap-2.5 mb-2">
          <span className="text-3xl font-black text-slate-900">{price}</span>
          {originalPrice && (
            <span className="text-sm font-semibold text-slate-400 line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
            60% OFF
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Includes comprehensive check across High Court, District Courts, and Revenue Tribunals.
        </p>

        <ul className="space-y-3 text-xs text-slate-700 mb-6">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Instant PDF report delivered to WhatsApp & Email</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Covers civil suits, injunctions & revenue disputes</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>100% legal privacy guaranteed</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <PrimaryButton onClick={onPaySubmit} loading={loading}>
          {ctaText}
        </PrimaryButton>
        <div className="flex items-center justify-center gap-1 mt-2.5 text-[11px] text-slate-400">
          <Lock className="w-3 h-3" />
          <span>Mock checkout demo (No real charge)</span>
        </div>
      </div>
    </div>
  );
};
