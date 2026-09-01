import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { InfoAlert } from '../../components/ui/InfoAlert';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { SelectInput } from '../../components/ui/SelectInput';
import { PhoneInput } from '../../components/ui/PhoneInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { searchCourtCases, CourtCaseRecord, CourtSearchResponse } from '../../services/courtService';
import { User, Building2, FileCode, Scale, CheckCircle2, MessageSquare } from 'lucide-react';
import { MOCK_DISTRICTS } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const CourtCasePage: React.FC = () => {
  const ctx = getPropertyContext();
  const [searchMode, setSearchMode] = useState<'party' | 'revenue' | 'cnr'>('party');

  // Party Name mode
  const [partyName, setPartyName] = useState(ctx.owner || '');
  
  // Contact info
  const [recipientName, setRecipientName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Revenue Court mode
  const [district, setDistrict] = useState(ctx.districtKey || '');
  const [taluk, setTaluk] = useState(ctx.taluk || '');
  const [village, setVillage] = useState(ctx.village || '');
  const [surveyNumber, setSurveyNumber] = useState(ctx.survey || '');
  const [subdivision, setSubdivision] = useState(ctx.subdiv || '');

  // CNR mode
  const [cnrNumber, setCnrNumber] = useState('');

  // Inline Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<CourtSearchResponse | null>(null);

  const validateCNRForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (searchMode === 'cnr') {
      if (!cnrNumber.trim()) {
        errs.cnrNumber = 'CNR number is required';
      }
      if (!recipientName.trim()) {
        errs.recipientName = 'Your name is required';
      }
      const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
      if (!cleanPhone || cleanPhone.length !== 10) {
        errs.whatsappNumber = 'Please enter a valid 10-digit Indian mobile number';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRunSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchMode === 'cnr' && !validateCNRForm()) {
      return;
    }

    setLoading(true);
    setSearchResponse(null);

    const res = await searchCourtCases({
      mode: searchMode,
      partyName,
      district,
      taluk,
      village,
      surveyNumber,
      subdivision,
      cnrNumber,
      contactName: recipientName,
      countryCode,
      whatsappNumber
    });

    setLoading(false);
    setSearchResponse(res);
  };

  return (
    <ToolLayout
      title="Court Case Litigation Search"
      subtitle="Verify pending litigation, injunction suits, stay orders, and civil dispute history across eCourts and Revenue Tribunals."
      categoryBadge="LITIGATION DUE DILIGENCE"
      breadcrumbToolName="Court Case Search"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/court_case_infographic.jpg"
          badgeText="JUDICIAL LITIGATION SCREENING"
          title="Court Dispute & Interim Stay Order Intelligence"
          subtitle="Identifies pending partition suits, title challenges, injunctions, and stay orders across District Courts, High Courts, and Revenue Tribunals across India."
          highlights={[
            "Searches across Case Number, Party Name, and CNR Number index",
            "Flags active interim stay orders that prohibit registration",
            "Verifies final disposed decrees and decree satisfaction status"
          ]}
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Form Area */}
          <div className="space-y-6">
            <ToolCard>
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Is This Land Or Its Owner In Litigation?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Search across eCourts, High Courts, District Courts, and Revenue Tribunals to identify pending land disputes.
                </p>
              </div>

              {/* Info Alert */}
              <InfoAlert title="Litigation Protection Search" className="mb-6">
                Property transactions can be blocked or invalidated by pending injunction suits or stay orders. Run this search to verify court records before giving advance payments.
              </InfoAlert>

              <form onSubmit={handleRunSearch} className="space-y-6">
                {/* Mode Selector Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    What Do You Want To Search By?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Card 1: Party name */}
                    <div
                      onClick={() => { setSearchMode('party'); setErrors({}); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all select-none ${
                        searchMode === 'party'
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <User className={`w-5 h-5 mb-2 ${searchMode === 'party' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <h4 className="text-sm font-bold text-slate-900">Party name</h4>
                      <p className="text-xs text-slate-500 mt-1">Any person or company, all India</p>
                    </div>

                    {/* Card 2: Revenue court */}
                    <div
                      onClick={() => { setSearchMode('revenue'); setErrors({}); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all select-none ${
                        searchMode === 'revenue'
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Building2 className={`w-5 h-5 mb-2 ${searchMode === 'revenue' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <h4 className="text-sm font-bold text-slate-900">Revenue court</h4>
                      <p className="text-xs text-slate-500 mt-1">By survey number, Tamil Nadu</p>
                    </div>

                    {/* Card 3: CNR number */}
                    <div
                      onClick={() => { setSearchMode('cnr'); setErrors({}); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all select-none ${
                        searchMode === 'cnr'
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <FileCode className={`w-5 h-5 mb-2 ${searchMode === 'cnr' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <h4 className="text-sm font-bold text-slate-900">CNR number</h4>
                      <p className="text-xs text-slate-500 mt-1">You already have a case number</p>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC MODE FORMS */}
                {searchMode === 'party' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <FormField label="Name of the person or company" required>
                      <TextInput
                        value={partyName}
                        onChange={(e) => setPartyName(e.target.value)}
                        placeholder="e.g. M. Ramanathan or ABC Builders Pvt Ltd"
                      />
                    </FormField>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                        Where Should We Send The Result?
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Your Name">
                          <TextInput
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter your name"
                          />
                        </FormField>
                        <FormField label="WhatsApp Number">
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
                  </div>
                )}

                {searchMode === 'revenue' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="District">
                        <SelectInput
                          options={MOCK_DISTRICTS['chennai']}
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Taluk">
                        <TextInput
                          value={taluk}
                          onChange={(e) => setTaluk(e.target.value)}
                          placeholder="e.g. Mambalam"
                        />
                      </FormField>
                      <FormField label="Village">
                        <TextInput
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="e.g. T. Nagar"
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Survey Number">
                        <TextInput
                          value={surveyNumber}
                          onChange={(e) => setSurveyNumber(e.target.value)}
                          placeholder="e.g. 142"
                        />
                      </FormField>
                      <FormField label="Subdivision">
                        <TextInput
                          value={subdivision}
                          onChange={(e) => setSubdivision(e.target.value)}
                          placeholder="e.g. 3B"
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {/* MODE 3: CNR NUMBER WITH WHATSAPP DELIVERY SECTION */}
                {searchMode === 'cnr' && (
                  <div className="space-y-6 pt-2 border-t border-slate-100">
                    <FormField label="CNR Number" required helperText="16-character alphanumeric Unique Case Record Number format (e.g. TNCH010042892022).">
                      <TextInput
                        value={cnrNumber}
                        onChange={(e) => setCnrNumber(e.target.value)}
                        placeholder="Enter 16-character CNR Number"
                      />
                      {errors.cnrNumber && <span className="text-xs text-rose-600 mt-1">{errors.cnrNumber}</span>}
                    </FormField>

                    {/* Where Should We Send The Result? Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Where Should We Send The Result?
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          We send the result link here so you do not lose it.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Your Name" required>
                          <TextInput
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter your full name"
                          />
                          {errors.recipientName && <span className="text-xs text-rose-600">{errors.recipientName}</span>}
                        </FormField>

                        <FormField label="WhatsApp Number" required>
                          <PhoneInput
                            countryCode={countryCode}
                            onCountryCodeChange={setCountryCode}
                            phone={whatsappNumber}
                            onPhoneChange={setWhatsappNumber}
                            placeholder="10-digit WhatsApp number"
                          />
                          {errors.whatsappNumber && <span className="text-xs text-rose-600">{errors.whatsappNumber}</span>}
                        </FormField>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Submit Action Button */}
                <div className="pt-2">
                  <PrimaryButton type="submit" loading={loading} icon={<Scale className="w-4 h-4" />}>
                    Search Litigation & Court Records
                  </PrimaryButton>
                </div>
              </form>
            </ToolCard>

            {/* Court Search Results Output */}
            {searchResponse && (
              <ToolCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Litigation Records Found</h3>
                    {searchResponse.refNumber && (
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
                        {searchResponse.refNumber}
                      </span>
                    )}
                  </div>

                  {searchResponse.deliveryNotice && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>WhatsApp Notification Sent (Mock Demo):</strong> {searchResponse.deliveryNotice}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {searchResponse.cases.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-start font-bold text-slate-900 text-sm">
                          <span>Case No: {item.caseNumber}</span>
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold">
                            {item.caseStatus}
                          </span>
                        </div>
                        <p className="text-slate-600"><strong>Court:</strong> {item.courtName}</p>
                        <p className="text-slate-600"><strong>Parties:</strong> {item.petitioner} vs. {item.respondent}</p>
                        <p className="text-slate-600"><strong>Subject:</strong> {item.subject}</p>
                        <p className="text-slate-500 font-medium">Next Hearing Date: {item.nextHearingDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ToolCard>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
