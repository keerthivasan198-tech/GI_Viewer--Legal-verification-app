import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AlphabetFilter } from '../../components/ui/AlphabetFilter';
import { ResultsTable, Column } from '../../components/ui/ResultsTable';
import { getGuidelineValues } from '../../services/guidelineService';
import { GuidelineResult } from '../../types';
import { Search } from 'lucide-react';
import { MOCK_ZONES, MOCK_SROS, MOCK_VILLAGES } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const GuidelineValuePage: React.FC = () => {
  const ctx = getPropertyContext();
  const [period, setPeriod] = useState('2024-2025');
  const [zone, setZone] = useState(ctx.zone || 'chennai');
  const [sro, setSro] = useState(ctx.sroKey || 't_nagar');
  const [village, setVillage] = useState(ctx.villageKey || 't_nagar_v');
  const [streetName, setStreetName] = useState(ctx.road || '');

  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GuidelineResult[]>([]);
  const [sortDescending, setSortDescending] = useState(true);

  const fetchResults = async (letter = selectedLetter, street = streetName) => {
    setLoading(true);
    const data = await getGuidelineValues(
      zone,
      sro,
      village,
      street,
      letter === 'ALL' ? undefined : letter
    );
    setLoading(false);
    setResults(data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(selectedLetter, streetName);
  };

  const handleSelectLetter = (letter: string) => {
    setSelectedLetter(letter);
    fetchResults(letter, streetName);
  };

  const handleSortToggle = () => {
    setSortDescending(!sortDescending);
    const sorted = [...results].sort((a, b) => {
      const valA = parseInt(a.guidelineValue.replace(/[^0-9]/g, '')) || 0;
      const valB = parseInt(b.guidelineValue.replace(/[^0-9]/g, '')) || 0;
      return sortDescending ? valA - valB : valB - valA;
    });
    setResults(sorted);
  };

  const periodOptions = [
    { value: '2024-2025', label: '01-Apr-2024 to Present (Revised Guideline Rates)' },
    { value: '2017-2023', label: '09-Jun-2017 to 31-Mar-2024' },
    { value: '2012-2017', label: '01-Apr-2012 to 08-Jun-2017' }
  ];

  const columns: Column<GuidelineResult>[] = [
    { header: 'Street Name / Description', accessor: 'streetName' },
    {
      header: 'Guideline Value',
      accessor: (row) => (
        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
          {row.guidelineValue}
        </span>
      )
    },
    { header: 'Land Classification', accessor: 'landClassification' },
    { header: 'Effective Revision Date', accessor: 'effectiveDate' }
  ];

  return (
    <ToolLayout
      title="Guideline Value Search"
      subtitle="Search official government guideline valuation rates across Tamil Nadu registration zones."
      categoryBadge="GOVERNMENT LAND VALUATION"
      breadcrumbToolName="Guideline Value"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/guideline_value_infographic.jpg"
          badgeText="OFFICIAL TNREGINET VALUATION"
          title="Government Guideline Rates & Land-Use Valuation Matrix"
          subtitle="Guideline value represents the minimum benchmark rate fixed by the state government for property registration and stamp duty computation."
          highlights={[
            "Categorizes rates by Commercial, Residential Special, Industrial & Agricultural zones",
            "Indexed per Sq.Ft, Sq.Meter, Ground (2,400 Sq.Ft), Cent & Acre",
            "Direct basis for statutory 7% Stamp Duty and 2% Registration Fee"
          ]}
        />

        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Guideline Rate Lookup
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check official government guideline values per sq.ft / sq.meter across Tamil Nadu registration zones.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Period select */}
            <FormField label="Period" required>
              <SelectInput
                options={periodOptions}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </FormField>

            {/* 2-Column Layout on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Zone" required>
                <SelectInput
                  options={MOCK_ZONES}
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </FormField>

              <FormField label="Sub Registrar Office" required>
                <SelectInput
                  options={MOCK_SROS['chennai_central'] || []}
                  value={sro}
                  onChange={(e) => setSro(e.target.value)}
                />
              </FormField>

              <FormField label="Village" required>
                <SelectInput
                  options={MOCK_VILLAGES['t_nagar'] || []}
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </FormField>

              <FormField label="Street Name (Optional)">
                <TextInput
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Anna Salai or Usman Road"
                />
              </FormField>
            </div>

            {/* Full-width Search */}
            <PrimaryButton type="submit" loading={loading} icon={<Search className="w-4 h-4" />}>
              Search Guideline Values
            </PrimaryButton>
          </form>
        </ToolCard>

        {/* Results & Alphabet Filter Container */}
        <ToolCard>
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
              Filter Streets By Alphabet
            </h3>
            <AlphabetFilter
              selectedLetter={selectedLetter}
              onSelectLetter={handleSelectLetter}
            />
          </div>

          <ResultsTable
            columns={columns}
            data={results}
            onSort={handleSortToggle}
            sortLabel={sortDescending ? 'Value (High To Low)' : 'Value (Low To High)'}
          />
        </ToolCard>
      </div>
    </ToolLayout>
  );
};
