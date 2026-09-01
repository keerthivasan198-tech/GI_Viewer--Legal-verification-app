import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { STAMP_DUTY_CATEGORIES, calculateStampDuty } from '../../services/stampDutyService';
import { Calculator, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const StampDutyPage: React.FC = () => {
  const ctx = getPropertyContext();
  const defaultVal = ctx.area_sqft ? String(Math.round(ctx.area_sqft * 4500)) : '7500000';
  const [selectedCategory, setSelectedCategory] = useState('conveyance_sale');
  const [propertyValueInput, setPropertyValueInput] = useState(defaultVal);
  const [amountError, setAmountError] = useState('');

  const numericValue = parseFloat(propertyValueInput.replace(/,/g, '')) || 0;

  const categoryOptions: SelectOption[] = STAMP_DUTY_CATEGORIES.map((cat) => ({
    value: cat.id,
    label: cat.name,
    description: cat.description
  }));

  const calcResult = calculateStampDuty(numericValue, selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAmountChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    setPropertyValueInput(raw);
    if (!raw || parseFloat(raw) <= 0) {
      setAmountError('Property consideration amount must be greater than ₹0');
    } else {
      setAmountError('');
    }
  };

  return (
    <ToolLayout
      title="Stamp Duty & Registration Fees Calculator"
      subtitle="Select any of the 29 official document categories to compute instant stamp duty & registration fees."
      breadcrumbToolName="Stamp Duty Calculator"
    >
      <div className="space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/stamp_duty_infographic.jpg"
          badgeText="STATUTORY CONVEYANCE OUTLAY"
          title="Stamp Duty, Registration Fee & Surcharge Calculator"
          subtitle="Accurately calculates statutory Stamp Duty (5-7%), Registration Fees (1-2%), and local transfer duty surcharges across 29 conveyance categories."
          highlights={[
            "Conveyance (Sale): 7% Stamp Duty + 2% Registration Fee on higher of agreed value or guideline",
            "Family Settlements, Partitions & Releases: Nominal rates (1% Stamp Duty capped at ₹25,000)",
            "Instant breakdown of Total Outlay before Sub-Registrar Office execution"
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <ToolCard>
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Document & Consideration Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your document classification and enter consideration or market value.
                </p>
              </div>

              <div className="space-y-6">
                <FormField label="Select the category of the document:" required>
                  <SearchableSelect
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={(val) => setSelectedCategory(val || 'conveyance_sale')}
                    placeholder="Select document category"
                  />
                </FormField>

                <FormField label="Enter property consideration / composite value: ₹" required helperText="Enter higher of market consideration or guideline value.">
                  <TextInput
                    type="text"
                    value={propertyValueInput}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="e.g. 75,00,000"
                  />
                  {amountError && <span className="text-xs text-rose-600 mt-1 block font-medium">{amountError}</span>}
                </FormField>

                <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-3">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{calcResult.categoryName}</span>
                    <span className="text-slate-500 block mt-0.5">
                      Statutory Schedule Rate: {calcResult.stampDutyRatePercent}% Stamp Duty & {calcResult.registrationFeeRatePercent}% Registration Fee
                    </span>
                  </div>
                </div>
              </div>
            </ToolCard>

            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    Buying a New Apartment or Villa?
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Calculate structural PWD plinth valuation and age depreciation.
                  </p>
                </div>
              </div>

              <Link to="/tools/building-value" className="w-full sm:w-auto">
                <PrimaryButton fullWidth={false} className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold" icon={<ArrowRight className="w-4 h-4" />}>
                  Building Calculator
                </PrimaryButton>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Calculation Summary
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-md">
                  STATUTORY RATES
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Entered Consideration</span>
                  <span className="font-bold text-slate-900">{formatCurrency(calcResult.propertyValue)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Stamp Duty ({calcResult.stampDutyRatePercent}%)</span>
                  <span className="font-bold text-blue-700">{formatCurrency(calcResult.stampDutyAmount)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Registration Fee ({calcResult.registrationFeeRatePercent}%)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(calcResult.registrationFeeAmount)}</span>
                </div>

                <div className="p-5 bg-slate-900 text-white rounded-xl shadow-sm">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    Total Estimated Registration Payable
                  </div>
                  <div className="text-2xl sm:text-3xl font-black mt-1 text-white tracking-tight">
                    {formatCurrency(calcResult.totalFees)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                *Note: Rates computed per Tamil Nadu Registration Act schedules.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
