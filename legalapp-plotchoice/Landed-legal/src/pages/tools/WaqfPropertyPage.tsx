import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { InfoAlert } from '../../components/ui/InfoAlert';
import { ShieldAlert, Search, CheckCircle2 } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '../../data/tools';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const WaqfPropertyPage: React.FC = () => {
  const ctx = getPropertyContext();
  const [waqfName, setWaqfName] = useState('');
  const [district, setDistrict] = useState(ctx.district ? ctx.district.toLowerCase() : '');
  const [taluk, setTaluk] = useState(ctx.taluk || '');
  const [village, setVillage] = useState(ctx.village || '');
  const [oldSurveyNo, setOldSurveyNo] = useState('');
  const [newSurveyNo, setNewSurveyNo] = useState(ctx.survey || '');
  const [subDivisionNo, setSubDivisionNo] = useState(ctx.subdiv || '');
  const [pattaNumber, setPattaNumber] = useState(ctx.patta || '');

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    setSearched(true);
  };

  return (
    <ToolLayout
      title="WAQF Board Property Search"
      subtitle="Provide All The Details You Know"
      categoryBadge="RESTRICTED LAND CHECK"
      breadcrumbToolName="WAQF Properties"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/waqf_property_infographic.jpg"
          badgeText="WAQF ACT 1995 RESTRICTION"
          title="State Waqf Board Endowment Property Screening"
          subtitle="Section 51 of Waqf Act 1995 and Section 22-A of the Registration Act strictly prohibit sale, gift, mortgage, or exchange of notified Waqf land without prior sanction."
          highlights={[
            "Screens cadastral survey numbers against State Waqf Board Gazette notifications",
            "Identifies dedicated Dargah, Mosque, Khabrastan, and Ashoorkhana endowments",
            "Protects property buyers from void transactions and eviction notices"
          ]}
        />

        <ToolCard>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              WAQF Board Notified Asset Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify State WAQF Board registered property gazette list to prevent illegal land purchases.
            </p>
          </div>

          <InfoAlert title="Section 22-A Statutory Warning" className="mb-6">
            Under Section 22-A of the Registration Act 1908, deeds transferring WAQF Board properties to private individuals cannot be registered by SRO offices.
          </InfoAlert>

          {/* 2-column structure */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="WAQF Name">
                <TextInput
                  value={waqfName}
                  onChange={(e) => setWaqfName(e.target.value)}
                  placeholder="e.g. Big Mosque Waqf / Jamia Masjid"
                />
              </FormField>

              <FormField label="District" required>
                <SelectInput
                  options={TAMIL_NADU_DISTRICTS}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </FormField>

              <FormField label="Taluk">
                <TextInput
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="e.g. Egmore"
                />
              </FormField>

              <FormField label="Village">
                <TextInput
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Triplicane"
                />
              </FormField>

              <FormField label="Old Survey Number">
                <TextInput
                  value={oldSurveyNo}
                  onChange={(e) => setOldSurveyNo(e.target.value)}
                  placeholder="e.g. Old SF 410"
                />
              </FormField>

              <FormField label="New Survey Number">
                <TextInput
                  value={newSurveyNo}
                  onChange={(e) => setNewSurveyNo(e.target.value)}
                  placeholder="e.g. New SF 88/2"
                />
              </FormField>

              <FormField label="Sub Division Number">
                <TextInput
                  value={subDivisionNo}
                  onChange={(e) => setSubDivisionNo(e.target.value)}
                  placeholder="e.g. 2A"
                />
              </FormField>

              <FormField label="Patta Number (Rural)">
                <TextInput
                  value={pattaNumber}
                  onChange={(e) => setPattaNumber(e.target.value)}
                  placeholder="e.g. Patta No 1042"
                />
              </FormField>
            </div>

            {/* Full-width Search */}
            <PrimaryButton type="submit" loading={loading} icon={<Search className="w-4 h-4" />}>
              Search WAQF Board Gazette List
            </PrimaryButton>
          </form>
        </ToolCard>

        {searched && (
          <ToolCard>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-teal-950">
                  No WAQF Property Records Matched
                </h4>
                <p className="text-xs text-teal-800 mt-1">
                  The specified survey parameters do not match any active WAQF Board notified assets in TN WAQF Gazette. (Demo Search Result)
                </p>
              </div>
            </div>
          </ToolCard>
        )}
      </div>
    </ToolLayout>
  );
};
