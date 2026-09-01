import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AlphabetFilter } from '../../components/ui/AlphabetFilter';
import { ResultsTable, Column } from '../../components/ui/ResultsTable';
import { getCompositeValues } from '../../services/guidelineService';
import { CompositeValueResult } from '../../types';
import { Search } from 'lucide-react';
import { MOCK_ZONES, MOCK_SROS, MOCK_VILLAGES } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const CompositeValuePage: React.FC = () => {
  const ctx = getPropertyContext();
  const [zone, setZone] = useState(ctx.zone || 'chennai');
  const [sro, setSro] = useState(ctx.sroKey || 't_nagar');
  const [village, setVillage] = useState(ctx.villageKey || 't_nagar_v');
  const [streetName, setStreetName] = useState(ctx.road || '');

  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompositeValueResult[]>([]);

  const fetchResults = async (letter = selectedLetter, street = streetName) => {
    setLoading(true);
    const data = await getCompositeValues(
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

  const columns: Column<CompositeValueResult>[] = [
    { header: 'Street / Apartment Complex', accessor: 'streetName' },
    {
      header: 'Composite Value',
      accessor: (row) => (
        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
          {row.compositeValue}
        </span>
      )
    },
    { header: 'Building Classification', accessor: 'buildingClass' },
    { header: 'Effective Date', accessor: 'effectiveDate' }
  ];

  return (
    <ToolLayout
      title="Apartment Composite Value Search"
      subtitle="Find combined land and structural guideline valuation rates for flats and multi-storey units."
      categoryBadge="APARTMENT VALUATION"
      breadcrumbToolName="Composite Value"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/composite_value_infographic.jpg"
          badgeText="APARTMENT VALUATION FORMULA"
          title="Apartment Composite Value & UDS Share Architecture"
          subtitle="Apartment composite valuation combines the Undivided Share of Land (UDS) with the built-up area and structural construction grade multiplier."
          highlights={[
            "Formula: [Built-up Area Value] + [UDS Land Share Value] x Construction Multiplier",
            "Incorporates building age depreciation (up to 50%) and floor-level premium factors",
            "Provides statutory valuation basis for apartment sale deed registrations"
          ]}
        />

        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Composite Rate Lookup
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find combined land and structural guideline values for flats, apartments, and multi-storey commercial units.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* 2-column layout */}
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

              <FormField label="Street Name / Complex">
                <TextInput
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Anna Salai"
                />
              </FormField>
            </div>

            {/* Full-width Search */}
            <PrimaryButton type="submit" loading={loading} icon={<Search className="w-4 h-4" />}>
              Search Composite Values
            </PrimaryButton>
          </form>
        </ToolCard>

        <ToolCard>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Filter Street Directory
              </h3>
              <span className="text-xs text-indigo-700 font-extrabold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {results.length} Records Found
              </span>
            </div>
            <AlphabetFilter
              selectedLetter={selectedLetter}
              onSelectLetter={(lettr) => {
                setSelectedLetter(lettr);
                fetchResults(lettr, streetName);
              }}
            />
          </div>

          <ResultsTable columns={columns} data={results} />
        </ToolCard>
      </div>
    </ToolLayout>
  );
};
