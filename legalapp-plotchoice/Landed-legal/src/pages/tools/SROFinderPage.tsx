import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AlphabetFilter } from '../../components/ui/AlphabetFilter';
import { MapPlaceholder } from '../../components/ui/MapPlaceholder';
import { MapPin, Search, Map, Building2 } from 'lucide-react';
import { MOCK_ZONES, MOCK_SROS, MOCK_VILLAGES } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const SROFinderPage: React.FC = () => {
  const ctx = getPropertyContext();
  const [showMapFinder, setShowMapFinder] = useState(false);
  const [zone, setZone] = useState(ctx.zone || 'chennai');
  const [sro, setSro] = useState(ctx.sroKey || 't_nagar');
  const [village, setVillage] = useState(ctx.villageKey || 't_nagar_v');
  const [streetName, setStreetName] = useState(ctx.road || '');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchResult(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setLoading(false);
    setSearchResult({
      sroName: 'Sub Registrar Office - T. Nagar (Zone: Chennai)',
      address: 'No. 9, Burkit Road, T. Nagar, Chennai - 600017',
      officer: 'Joint Sub-Registrar II',
      jurisdiction: 'T. Nagar, West Mambalam, Usman Road, Anna Salai (Part)',
      pincode: '600017'
    });
  };

  return (
    <ToolLayout
      title="Sub Registrar Office (SRO) Finder"
      subtitle="Identify designated Sub Registrar Offices by location map, village hierarchy, or street index."
      categoryBadge="JURISDICTION LOCATOR"
      breadcrumbToolName="Find Your SRO"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/sro_finder_infographic.jpg"
          badgeText="SRO JURISDICTION DIRECTORY"
          title="Tamil Nadu Sub-Registrar Office Jurisdiction Finder"
          subtitle="Every land parcel is legally bound to register exclusively at its designated Sub-Registrar Office having territorial revenue jurisdiction."
          highlights={[
            "Resolves territorial jurisdiction by District, Taluk, Village, and Pincode",
            "Displays official SRO Office address, officer contact, and working hours",
            "Prevents registration in incorrect or non-jurisdictional sub-registry offices"
          ]}
        />

        {/* Indigo Feature Panel */}
        <div className="bg-white border-2 border-indigo-600 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>GIS Location Search</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Interactive Location-Based SRO Finder
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Point-and-click SRO identification for any location on map.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMapFinder(!showMapFinder)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex-shrink-0"
            >
              <Map className="w-4 h-4" />
              <span>{showMapFinder ? 'Close Map View' : 'Find SRO by Location'}</span>
            </button>
          </div>

          {/* Collapsible Interactive Map Finder */}
          {showMapFinder && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <MapPlaceholder height="h-72" />
            </div>
          )}
        </div>

        {/* Main Form */}
        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Search SRO Office by Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your property zone, village, or street to locate your designated Sub Registrar Office.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Zone" required>
                <SelectInput
                  options={MOCK_ZONES}
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </FormField>

              <FormField label="Sub Registrar Office">
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

              <FormField label="Street Name">
                <TextInput
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Usman Road"
                />
              </FormField>
            </div>

            {/* Helper link */}
            <div className="text-xs text-indigo-600 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Opening complete hierarchical SRO directory.'); }} className="hover:underline">
                Browse complete SRO & Village Directory? Click here to explore hierarchically.
              </a>
            </div>

            {/* Full-width Search */}
            <PrimaryButton type="submit" loading={loading} icon={<Search className="w-4 h-4" />}>
              Search Sub Registrar Office
            </PrimaryButton>
          </form>
        </ToolCard>

        {/* Search Result */}
        {searchResult && (
          <ToolCard className="border-indigo-200 bg-indigo-50/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-base">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>{searchResult.sroName}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                <p><strong>Address:</strong> {searchResult.address}</p>
                <p><strong>Designated Officer:</strong> {searchResult.officer}</p>
                <p><strong>Jurisdiction Villages:</strong> {searchResult.jurisdiction}</p>
                <p><strong>Pincode:</strong> {searchResult.pincode}</p>
              </div>
            </div>
          </ToolCard>
        )}

        {/* Alphabet Navigation at bottom */}
        <ToolCard>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
            Browse Sub Registrar Offices (A-Z Directory)
          </h3>
          <AlphabetFilter
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />
        </ToolCard>
      </div>
    </ToolLayout>
  );
};
