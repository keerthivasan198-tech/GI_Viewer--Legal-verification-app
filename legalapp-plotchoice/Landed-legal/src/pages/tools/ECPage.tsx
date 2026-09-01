import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ResultsTable, Column } from '../../components/ui/ResultsTable';
import { MOCK_ZONES, MOCK_DISTRICTS, MOCK_SROS, MOCK_VILLAGES } from '../../data/tools';
import { searchEC, ECRecord } from '../../services/ecService';
import { ECSearchMode, ECSurveyRow, ECPlotRow, ECFlatRow } from '../../types';
import { Search, ExternalLink, MapPin, FileCheck2, HelpCircle, Plus, Trash2, Calendar, FileText, Info, ShieldCheck } from 'lucide-react';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const ECPage: React.FC = () => {
  const ctx = getPropertyContext();

  // Active search mode
  const [searchMode, setSearchMode] = useState<ECSearchMode>('survey');

  // Location fields
  const [zone, setZone] = useState(ctx.zone || 'chennai');
  const [district, setDistrict] = useState(ctx.districtKey || 'chennai_central');
  const [sro, setSro] = useState(ctx.sroKey || 't_nagar');
  const [village, setVillage] = useState(ctx.villageKey || 't_nagar_v');

  // Date range fields (Modes 1 & 3)
  const [startDate, setStartDate] = useState('1987-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // Dynamic survey/sub-division rows (Modes 1 & 3)
  const [surveyRows, setSurveyRows] = useState<ECSurveyRow[]>([
    { id: 's-1', surveyNumber: ctx.survey || '142', subDivisionNumber: ctx.subdiv || '3B' }
  ]);

  // Dynamic plot rows (Modes 1 & 3)
  const [plots, setPlots] = useState<ECPlotRow[]>([
    { id: 'p-1', plotNumber: ctx.door_no ? `${ctx.door_no}, ${ctx.road || ''}`.trim() : (ctx.road ? `${ctx.road}` : 'Plot No. 42B') }
  ]);

  // Dynamic flat rows (Modes 1 & 3)
  const [flats, setFlats] = useState<ECFlatRow[]>([
    { id: 'f-1', flatNumber: 'Flat 3A' }
  ]);

  // Document mode fields (Mode 2)
  const [documentType, setDocumentType] = useState('sale_deed');
  const [documentNumber, setDocumentNumber] = useState('1420');
  const [documentYear, setDocumentYear] = useState('2021');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search execution state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ECRecord[] | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Location dependent dropdown change handlers
  const handleZoneChange = (val: string) => {
    setZone(val);
    const dists = MOCK_DISTRICTS[val] || [];
    setDistrict(dists[0]?.value || '');
  };

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    const sros = MOCK_SROS[val] || [];
    setSro(sros[0]?.value || '');
  };

  const handleSroChange = (val: string) => {
    setSro(val);
    const vills = MOCK_VILLAGES[val] || [];
    setVillage(vills[0]?.value || '');
  };

  // Dynamic Survey Row handlers
  const handleAddSurveyRow = () => {
    setSurveyRows([
      ...surveyRows,
      { id: `s-${Date.now()}`, surveyNumber: '', subDivisionNumber: '' }
    ]);
  };

  const handleRemoveSurveyRow = (id: string) => {
    if (surveyRows.length > 1) {
      setSurveyRows(surveyRows.filter((r) => r.id !== id));
    }
  };

  const handleSurveyRowChange = (id: string, field: 'surveyNumber' | 'subDivisionNumber', value: string) => {
    setSurveyRows(
      surveyRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Dynamic Plot Row handlers
  const handleAddPlot = () => {
    setPlots([...plots, { id: `p-${Date.now()}`, plotNumber: '' }]);
  };

  const handleRemovePlot = (id: string) => {
    if (plots.length > 1) {
      setPlots(plots.filter((p) => p.id !== id));
    }
  };

  const handlePlotChange = (id: string, value: string) => {
    setPlots(plots.map((p) => (p.id === id ? { ...p, plotNumber: value } : p)));
  };

  // Dynamic Flat Row handlers
  const handleAddFlat = () => {
    setFlats([...flats, { id: `f-${Date.now()}`, flatNumber: '' }]);
  };

  const handleRemoveFlat = (id: string) => {
    if (flats.length > 1) {
      setFlats(flats.filter((f) => f.id !== id));
    }
  };

  const handleFlatChange = (id: string, value: string) => {
    setFlats(flats.map((f) => (f.id === id ? { ...f, flatNumber: value } : f)));
  };

  // Client-side Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (searchMode === 'document') {
      if (!documentType) errs.documentType = 'Document type is required';
      if (!documentNumber.trim()) errs.documentNumber = 'Document number is required';
      if (!documentYear.trim()) errs.documentYear = 'Document year is required';
    } else {
      if (!startDate) errs.startDate = 'Start date is required';
      if (!endDate) errs.endDate = 'End date is required';
      if (startDate && endDate && startDate > endDate) {
        errs.endDate = 'End date must be after start date';
      }
      if (surveyRows.some((r) => !r.surveyNumber.trim())) {
        errs.surveyRows = 'Survey number is required for all added rows';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResults(null);

    const res = await searchEC({
      searchMode,
      zone,
      district,
      sro,
      village,
      startDate,
      endDate,
      surveyRows,
      plots,
      flats,
      documentType,
      documentNumber,
      documentYear
    });

    setLoading(false);
    setResults(res.data);
    setStatusMsg(res.message);
  };

  const documentTypeOptions = [
    { value: 'sale_deed', label: 'Sale Deed (Conveyance)' },
    { value: 'mortgage', label: 'Deposit of Title Deeds (Mortgage)' },
    { value: 'gift_deed', label: 'Gift Deed' },
    { value: 'release_deed', label: 'Release Deed' },
    { value: 'lease_deed', label: 'Lease Agreement' },
    { value: 'gpa', label: 'General Power of Attorney (GPA)' },
    { value: 'cancellation', label: 'Cancellation Deed' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const yr = (currentYear - i).toString();
    return { value: yr, label: yr };
  });

  const tableColumns: Column<ECRecord>[] = [
    { header: 'Doc No / Year', accessor: 'documentNumber' },
    { header: 'Reg Date', accessor: 'registrationDate' },
    { header: 'Nature of Document', accessor: 'natureOfDocument' },
    { header: 'Executants (Sellers)', accessor: 'executants' },
    { header: 'Claimants (Buyers)', accessor: 'claimants' },
    { header: 'Survey No', accessor: 'surveyNo' },
    { header: 'Extent Area', accessor: 'extent' }
  ];

  return (
    <ToolLayout
      title="Online Encumbrance Certificate (EC)"
      subtitle="Search registered encumbrance certificate records, title deeds history, and transaction transfers."
      categoryBadge="TITLE DUE DILIGENCE"
      breadcrumbToolName="EC Online"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/ec_infographic.jpg"
          badgeText="HISTORICAL TITLE AUDIT"
          title="Encumbrance Certificate & Transaction Flow Anatomy"
          subtitle="An Encumbrance Certificate (EC) contains the complete 30-year chronological chain of registered title deeds, mortgages, releases, and liens on a specific survey number or plot."
          highlights={[
            "Traces ownership transfers from original parent deed to current owner",
            "Identifies outstanding bank mortgages and pending charge releases",
            "Certifies that the property is legally marketable and free from encumbrances"
          ]}
        />

        <ToolCard>
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Enter Search Parameters</h2>
            <p className="text-xs text-slate-500 mt-1">
              Specify registration zone, sub-registrar office, and property criteria.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Common Location Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Zone" required>
                <SelectInput
                  options={MOCK_ZONES}
                  value={zone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                />
              </FormField>

              <FormField label="District" required>
                <SelectInput
                  options={MOCK_DISTRICTS[zone] || []}
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                />
              </FormField>

              <FormField label="Sub Registrar Office" required>
                <SelectInput
                  options={MOCK_SROS[district] || [{ value: 't_nagar', label: 'T. Nagar SRO' }]}
                  value={sro}
                  onChange={(e) => handleSroChange(e.target.value)}
                />
              </FormField>

              <FormField label="Village" required>
                <SelectInput
                  options={MOCK_VILLAGES[sro] || [{ value: 't_nagar_v', label: 'T. Nagar Village' }]}
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </FormField>
            </div>

            {/* Helper link 1 */}
            <div className="text-xs text-slate-500 italic flex items-center gap-1.5 -mt-2">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Don't know your SRO? </span>
              <Link to="/tools/find-sro" className="text-indigo-600 font-semibold hover:underline">
                Click here to find it easily.
              </Link>
            </div>

            {/* SEARCH BY SEGMENTED CONTROL (3 Selectable Options) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Search By Mode
              </label>
              <SegmentedControl
                options={[
                  { value: 'survey', label: 'Survey Number', icon: <MapPin className="w-4 h-4" /> },
                  { value: 'document', label: 'Document Number', icon: <FileText className="w-4 h-4" /> },
                  { value: 'plotFlat', label: 'Plot/Flat Number', icon: <FileCheck2 className="w-4 h-4" /> }
                ]}
                selectedValue={searchMode}
                onChange={(val) => {
                  setSearchMode(val as ECSearchMode);
                  setErrors({});
                }}
              />
            </div>

            {/* DYNAMIC MODE 1: SURVEY NUMBER */}
            {searchMode === 'survey' && (
              <div className="space-y-5 pt-2">
                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Start Date" required>
                    <TextInput
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && <span className="text-xs text-rose-600">{errors.startDate}</span>}
                  </FormField>

                  <FormField label="End Date" required>
                    <TextInput
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && <span className="text-xs text-rose-600">{errors.endDate}</span>}
                  </FormField>
                </div>

                {/* Helper Link: Data Availability Period */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAvailabilityModal(!showAvailabilityModal)}
                    className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline text-left"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Click Here to know data availability period</span>
                  </button>

                  <Link
                    to="/tools/survey-number"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 italic"
                  >
                    <span>Don't know your survey number? Click here to find it easily.</span>
                  </Link>
                </div>

                {/* Data Availability Modal / Info Banner */}
                {showAvailabilityModal && (
                  <div className="p-4 bg-teal-50 border border-teal-200/90 rounded-xl text-xs text-teal-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-teal-900">
                      <Info className="w-4 h-4 text-teal-600" />
                      <span>Digitized EC Records Availability Period</span>
                    </div>
                    <p>• Zone Chennai, Coimbatore, Madurai: <strong>1975 to Present (Fully Digitized)</strong></p>
                    <p>• Other Sub-Registrar Offices: <strong>1987 to Present</strong></p>
                  </div>
                )}

                {/* Dynamic Survey & Sub-Division Rows */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Survey & Sub Division Numbers
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSurveyRow}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Add Another Survey Number</span>
                    </button>
                  </div>

                  {errors.surveyRows && <span className="text-xs text-rose-600 block">{errors.surveyRows}</span>}

                  {surveyRows.map((row, idx) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
                      <div className="md:col-span-6">
                        <FormField label={idx === 0 ? "Survey Number" : `Survey Number #${idx + 1}`} required={idx === 0}>
                          <TextInput
                            value={row.surveyNumber}
                            onChange={(e) => handleSurveyRowChange(row.id, 'surveyNumber', e.target.value)}
                            placeholder="e.g. 142"
                          />
                        </FormField>
                      </div>

                      <div className="md:col-span-5">
                        <FormField label={idx === 0 ? "Sub Division Number" : `Sub Division #${idx + 1}`}>
                          <TextInput
                            value={row.subDivisionNumber}
                            onChange={(e) => handleSurveyRowChange(row.id, 'subDivisionNumber', e.target.value)}
                            placeholder="e.g. 3B"
                          />
                        </FormField>
                      </div>

                      {surveyRows.length > 1 && (
                        <div className="md:col-span-1 pb-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveSurveyRow(row.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove Survey Row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dynamic Plot Numbers */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Plot Numbers
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPlot}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Plot</span>
                    </button>
                  </div>

                  {plots.map((plt) => (
                    <div key={plt.id} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <TextInput
                          value={plt.plotNumber}
                          onChange={(e) => handlePlotChange(plt.id, e.target.value)}
                          placeholder="e.g. Plot No. 42B"
                        />
                      </div>
                      {plots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlot(plt.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dynamic Flat Numbers */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Flat Numbers
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFlat}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Flat</span>
                    </button>
                  </div>

                  {flats.map((flt) => (
                    <div key={flt.id} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <TextInput
                          value={flt.flatNumber}
                          onChange={(e) => handleFlatChange(flt.id, e.target.value)}
                          placeholder="e.g. Flat 3A"
                        />
                      </div>
                      {flats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFlat(flt.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC MODE 2: DOCUMENT NUMBER */}
            {searchMode === 'document' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Document Type" required>
                    <SelectInput
                      options={documentTypeOptions}
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    />
                    {errors.documentType && <span className="text-xs text-rose-600">{errors.documentType}</span>}
                  </FormField>

                  <FormField label="Document Number" required>
                    <TextInput
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="e.g. 1420"
                    />
                    {errors.documentNumber && <span className="text-xs text-rose-600">{errors.documentNumber}</span>}
                  </FormField>

                  <FormField label="Document Year" required>
                    <SelectInput
                      options={yearOptions}
                      value={documentYear}
                      onChange={(e) => setDocumentYear(e.target.value)}
                    />
                    {errors.documentYear && <span className="text-xs text-rose-600">{errors.documentYear}</span>}
                  </FormField>
                </div>
              </div>
            )}

            {/* DYNAMIC MODE 3: PLOT / FLAT NUMBER */}
            {searchMode === 'plotFlat' && (
              <div className="space-y-5 pt-2">
                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Start Date" required>
                    <TextInput
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && <span className="text-xs text-rose-600">{errors.startDate}</span>}
                  </FormField>

                  <FormField label="End Date" required>
                    <TextInput
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && <span className="text-xs text-rose-600">{errors.endDate}</span>}
                  </FormField>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(!showAvailabilityModal)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Click Here to know data availability period</span>
                </button>

                {/* Survey & Sub Division Rows */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Survey & Sub Division Numbers
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSurveyRow}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Survey Number</span>
                    </button>
                  </div>

                  {surveyRows.map((row, idx) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
                      <div className="md:col-span-6">
                        <FormField label={`Survey Number #${idx + 1}`} required={idx === 0}>
                          <TextInput
                            value={row.surveyNumber}
                            onChange={(e) => handleSurveyRowChange(row.id, 'surveyNumber', e.target.value)}
                            placeholder="e.g. 142"
                          />
                        </FormField>
                      </div>

                      <div className="md:col-span-5">
                        <FormField label={`Sub Division #${idx + 1}`}>
                          <TextInput
                            value={row.subDivisionNumber}
                            onChange={(e) => handleSurveyRowChange(row.id, 'subDivisionNumber', e.target.value)}
                            placeholder="e.g. 3B"
                          />
                        </FormField>
                      </div>

                      {surveyRows.length > 1 && (
                        <div className="md:col-span-1 pb-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveSurveyRow(row.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Plot & Flat Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Plot Numbers
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPlot}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        + Add Plot
                      </button>
                    </div>
                    {plots.map((p) => (
                      <TextInput
                        key={p.id}
                        value={p.plotNumber}
                        onChange={(e) => handlePlotChange(p.id, e.target.value)}
                        placeholder="Plot Number"
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Flat Numbers
                      </label>
                      <button
                        type="button"
                        onClick={handleAddFlat}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        + Add Flat
                      </button>
                    </div>
                    {flats.map((f) => (
                      <TextInput
                        key={f.id}
                        value={f.flatNumber}
                        onChange={(e) => handleFlatChange(f.id, e.target.value)}
                        placeholder="Flat Number"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Primary Search Button */}
            <PrimaryButton type="submit" loading={loading} disabled={loading} icon={<Search className="w-4 h-4" />}>
              Run Encumbrance Search
            </PrimaryButton>
          </form>

          {/* 3 Supporting actions/links */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Redirecting to Certified Copy (CC) portal demo.'); }}
              className="flex items-center gap-2 p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-slate-700 hover:text-indigo-700 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Need a Certified EC?</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
            </a>

            <Link
              to="/tools/survey-number"
              className="flex items-center gap-2 p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-slate-700 hover:text-indigo-700 transition-all"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Get EC by map location</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
            </Link>

            <Link
              to="/tools/find-sro"
              className="flex items-center gap-2 p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-slate-700 hover:text-indigo-700 transition-all"
            >
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Search EC by Revenue Village</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
            </Link>
          </div>
        </ToolCard>

        {/* Search Results Report View */}
        {results && (
          <ToolCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Encumbrance Verification Results</h3>
                <p className="text-xs text-teal-800 bg-teal-50 p-2.5 rounded-lg mt-1 border border-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{statusMsg}</span>
                </p>
              </div>
            </div>
            <ResultsTable columns={tableColumns} data={results} />
          </ToolCard>
        )}
      </div>
    </ToolLayout>
  );
};
