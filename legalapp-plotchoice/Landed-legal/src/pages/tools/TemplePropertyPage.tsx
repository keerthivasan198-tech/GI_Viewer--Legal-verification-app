import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { InfoAlert } from '../../components/ui/InfoAlert';
import { Landmark, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const TemplePropertyPage: React.FC = () => {
  const ctx = getPropertyContext();
  // Form state: exact 8 fields specified
  const [templeName, setTempleName] = useState('');
  const [district, setDistrict] = useState(ctx.district ? ctx.district.toLowerCase() : '');
  const [taluk, setTaluk] = useState(ctx.taluk || '');
  const [village, setVillage] = useState(ctx.village || '');
  const [oldSurveyNo, setOldSurveyNo] = useState('');
  const [newSurveyNo, setNewSurveyNo] = useState(ctx.survey || '');
  const [subDivisionNo, setSubDivisionNo] = useState(ctx.subdiv || '');
  const [pattaNumber, setPattaNumber] = useState(ctx.patta || '');

  // Validation & async UI state
  const [districtError, setDistrictError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!district) {
      setDistrictError('District is required');
      return;
    }
    setDistrictError('');

    setLoading(true);
    setSearched(false);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    setSearched(true);

    // Mock check based on inputs
    const query = `${oldSurveyNo} ${newSurveyNo} ${templeName}`.toLowerCase();
    setIsFlagged(query.includes('108') || query.includes('kapaleeshwarar') || query.includes('temple'));
  };

  return (
    <ToolLayout
      title="Temple Property Search"
      subtitle="Provide All The Details You Know"
      categoryBadge="RESTRICTED LAND CHECK"
      breadcrumbToolName="Temple Property Search"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/temple_property_infographic.jpg"
          badgeText="SECTION 22-A STATUTORY PROHIBITION"
          title="HR&CE Hindu Religious Endowment Land Verification"
          subtitle="Under Section 22-A of the Registration Act, registering any alienation or sale of temple inam/devadhanam lands without HR&CE Commissioner sanction is null and void."
          highlights={[
            "Screens cadastral survey numbers against HR&CE endowment registers",
            "Detects Poojari Manyam, Devadhanam, and Temple trust holdings",
            "Prevents illegal purchase and registration cancellation notices"
          ]}
        />

        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              HR&CE Endowment Registry Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify if a land parcel is registered under the Hindu Religious & Charitable Endowments (HR&CE) Department schedule to prevent illegal transactions.
            </p>
          </div>

          <InfoAlert title="HR&CE Land Transfer Restriction" className="mb-6">
            Registration of HR&CE temple lands to private parties is strictly prohibited under Section 22-A of the Registration Act.
          </InfoAlert>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Responsive 2-column layout on desktop, 1-column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Temple Name */}
              <FormField label="Temple Name">
                <TextInput
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  placeholder="e.g. Sri Kapaleeshwarar Temple"
                />
              </FormField>

              {/* Field 2: District* (Required) */}
              <FormField label="District" required>
                <SelectInput
                  options={TAMIL_NADU_DISTRICTS}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (e.target.value) setDistrictError('');
                  }}
                />
                {districtError && <span className="text-xs text-rose-600">{districtError}</span>}
              </FormField>

              {/* Field 3: Taluk */}
              <FormField label="Taluk">
                <TextInput
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="e.g. Mambalam"
                />
              </FormField>

              {/* Field 4: Village */}
              <FormField label="Village">
                <TextInput
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. T. Nagar"
                />
              </FormField>

              {/* Field 5: Old Survey Number */}
              <FormField label="Old Survey Number">
                <TextInput
                  value={oldSurveyNo}
                  onChange={(e) => setOldSurveyNo(e.target.value)}
                  placeholder="e.g. Old SF 108"
                />
              </FormField>

              {/* Field 6: New Survey Number */}
              <FormField label="New Survey Number">
                <TextInput
                  value={newSurveyNo}
                  onChange={(e) => setNewSurveyNo(e.target.value)}
                  placeholder="e.g. New SF 142"
                />
              </FormField>

              {/* Field 7: Sub Division Number */}
              <FormField label="Sub Division Number">
                <TextInput
                  value={subDivisionNo}
                  onChange={(e) => setSubDivisionNo(e.target.value)}
                  placeholder="e.g. 3B"
                />
              </FormField>

              {/* Field 8: Patta Number (Rural) */}
              <FormField label="Patta Number (Rural)">
                <TextInput
                  value={pattaNumber}
                  onChange={(e) => setPattaNumber(e.target.value)}
                  placeholder="e.g. Patta No. 1042"
                />
              </FormField>
            </div>

            {/* Primary Action Search Button */}
            <div className="pt-2">
              <PrimaryButton type="submit" loading={loading} icon={<Landmark className="w-4 h-4" />}>
                Search Temple Registry
              </PrimaryButton>
            </div>
          </form>
        </ToolCard>

        {/* Results State & No Results State */}
        {searched && (
          <ToolCard>
            {isFlagged ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-950">
                <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-rose-900">
                    HR&CE Temple Property Record Found
                  </h4>
                  <p className="text-xs text-rose-800 mt-1">
                    The requested survey parameters match HR&CE endowment assets in <strong>{district}</strong>. Private title transfer is barred under Sec 22-A.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3 text-teal-950">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-teal-900">
                    No HR&CE Temple Ownership Match Found
                  </h4>
                  <p className="text-xs text-teal-800 mt-1">
                    No active HR&CE temple endowment records matched the entered survey details in <strong>{district}</strong>. (Mock Search Result)
                  </p>
                </div>
              </div>
            )}
          </ToolCard>
        )}
      </div>
    </ToolLayout>
  );
};
