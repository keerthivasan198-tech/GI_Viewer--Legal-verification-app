import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { InfoAlert } from '../../components/ui/InfoAlert';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { SelectInput } from '../../components/ui/SelectInput';
import { PhoneInput } from '../../components/ui/PhoneInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { MapPlaceholder } from '../../components/ui/MapPlaceholder';
import { searchCERSAI, CERSAIResult } from '../../services/cersaiService';
import { MapPin, FormInput, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const CERSAIPage: React.FC = () => {
  const ctx = getPropertyContext();
  const [searchMode, setSearchMode] = useState<'map' | 'manual'>('map');
  
  // Form state
  const [district, setDistrict] = useState(ctx.district ? ctx.district.toLowerCase() : '');
  const [cityVillage, setCityVillage] = useState(ctx.village || ctx.road || '');
  const [pincode, setPincode] = useState(ctx.postcode || '');
  const [propertyType, setPropertyType] = useState('residential_apartment');
  const [surveyNumber, setSurveyNumber] = useState(ctx.survey ? `${ctx.survey}/${ctx.subdiv || ''}` : '');
  const [plotNumber, setPlotNumber] = useState(ctx.door_no || '');
  const [doorNumber, setDoorNumber] = useState(ctx.door_no || '');
  const [ownerName, setOwnerName] = useState(ctx.owner || '');
  
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [addressLine1, setAddressLine1] = useState(ctx.street_address || ctx.road || '');
  const [landmark, setLandmark] = useState('');

  // Report delivery contact
  const [recipientName, setRecipientName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [reportResult, setReportResult] = useState<CERSAIResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReportResult(null);

    const res = await searchCERSAI({
      searchMode,
      district,
      cityVillage,
      pincode,
      propertyType,
      surveyNumber,
      plotNumber,
      doorNumber,
      ownerName,
      recipientName,
      whatsappNumber
    });

    setLoading(false);
    setReportResult(res);
  };

  const propertyTypeOptions = [
    { value: 'residential_apartment', label: 'Residential Flat / Apartment' },
    { value: 'individual_house', label: 'Individual House / Villa' },
    { value: 'vacant_plot', label: 'Vacant Residential Plot / Land' },
    { value: 'commercial_shop', label: 'Commercial Building / Shop' },
    { value: 'agricultural_land', label: 'Agricultural Land' }
  ];

  return (
    <ToolLayout
      title="CERSAI Mortgage Check"
      subtitle="Verify Central Registry of Securitisation Asset Reconstruction (CERSAI) mortgage security charges before property purchase."
      categoryBadge="MORTGAGE DUE DILIGENCE"
      breadcrumbToolName="CERSAI Check"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/cersai_infographic.jpg"
          badgeText="BANKING CHARGES & LIENS"
          title="CERSAI Central Asset Security Registry Ecosystem"
          subtitle="CERSAI tracks all equitable mortgages, security interests, and bank hypothecations filed by scheduled commercial banks and NBFCs across India."
          highlights={[
            "Screens borrower PAN and property address against active bank charges",
            "Detects undisclosed home loans, double financing, or fraudulent pledges",
            "Validates charge satisfaction and No Objection Certificate (NOC) status"
          ]}
        />

        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Is This Property Already Mortgaged?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search security interest records created by banks and financial institutions across India.
            </p>
          </div>

          <InfoAlert title="About CERSAI Verification Search" className="mb-6">
            CERSAI tracks all equitable mortgages created by banks, NBFCs, and financial institutions. Pin property location on the GIS map below or select district parameters to run mortgage check.
          </InfoAlert>

          {/* Prominent Interactive GIS Location Map */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Interactive GIS Location Map (Pin Property Location)
              </label>
              <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                Map View Active
              </span>
            </div>
            <MapPlaceholder
              height="h-72 sm:h-80"
              onLocationSelect={(loc) => {
                setCityVillage(loc.address);
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-slate-100">
            {/* MANUAL MODE UI */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="District" required>
                  <SelectInput
                    options={TAMIL_NADU_DISTRICTS}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </FormField>
                  <FormField label="City / Town / Village">
                    <TextInput
                      value={cityVillage}
                      onChange={(e) => setCityVillage(e.target.value)}
                      placeholder="e.g. T. Nagar"
                    />
                  </FormField>
                  <FormField label="Pincode">
                    <TextInput
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 600017"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Property Type">
                    <SelectInput
                      options={propertyTypeOptions}
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Survey Number">
                    <TextInput
                      value={surveyNumber}
                      onChange={(e) => setSurveyNumber(e.target.value)}
                      placeholder="e.g. 142/3B"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Plot Number">
                    <TextInput
                      value={plotNumber}
                      onChange={(e) => setPlotNumber(e.target.value)}
                      placeholder="e.g. Plot No 42"
                    />
                  </FormField>
                  <FormField label="Door / Flat Number">
                    <TextInput
                      value={doorNumber}
                      onChange={(e) => setDoorNumber(e.target.value)}
                      placeholder="e.g. Door No 12, Flat 3A"
                    />
                  </FormField>
                  <FormField label="Owner Name">
                    <TextInput
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Name of property owner"
                    />
                  </FormField>
                </div>

                {/* Optional Expandable: Add address details */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressDetails(!showAddressDetails)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>{showAddressDetails ? 'Hide additional address details' : '+ Add address details'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAddressDetails ? 'rotate-180' : ''}`} />
                  </button>

                  {showAddressDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 bg-slate-50 border border-slate-200/90 rounded-xl">
                      <FormField label="Street / Building Name">
                        <TextInput
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="e.g. Green Park Enclave"
                        />
                      </FormField>
                      <FormField label="Landmark">
                        <TextInput
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Bus Depot"
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              </div>

            {/* Where Should We Send The Report? Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Where Should We Send The Report?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter recipient contact info for instant report delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Your Name" required>
                  <TextInput
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </FormField>

                <FormField label="WhatsApp Number" required>
                  <PhoneInput
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    phone={whatsappNumber}
                    onPhoneChange={setWhatsappNumber}
                    placeholder="10-digit WhatsApp number"
                  />
                </FormField>
              </div>
            </div>

            {/* Primary Action Button */}
            <PrimaryButton type="submit" loading={loading} icon={<ShieldCheck className="w-4 h-4" />}>
              Run CERSAI Mortgage Search
            </PrimaryButton>
          </form>
        </ToolCard>

        {/* Mock Report Result Card */}
        {reportResult && (
          <ToolCard className="border-teal-200 bg-teal-50/40">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  CERSAI Verification Status: <span className="text-teal-700">{reportResult.status}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">{reportResult.remarks}</p>
                <div className="mt-3 p-3 bg-white border border-teal-200 rounded-lg text-xs text-slate-700">
                  📄 Detailed report sent to WhatsApp <strong>{countryCode} {whatsappNumber}</strong>.
                </div>
              </div>
            </div>
          </ToolCard>
        )}
      </div>
    </ToolLayout>
  );
};
