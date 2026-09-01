import React from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { SurveyNumberFinderUtility } from '../../components/survey/SurveyNumberFinderUtility';

export const SurveyNumberPage: React.FC = () => {
  return (
    <ToolLayout
      title="Land Survey Number Finder"
      subtitle="Identify land survey numbers, sub-division details, and Patta numbers by live GIS map pin or address lookup."
      categoryBadge="TN LAND REVENUE UTILITY"
      breadcrumbToolName="Survey Number Finder"
    >
      <div className="w-full max-w-none space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/survey_number_infographic.jpg"
          badgeText="CADASTRAL SURVEY & PATTA EXTRACT"
          title="Survey Number, Sub-Division & Land Classification Blueprint"
          subtitle="Identifies cadastral parcel boundaries, sub-divisions, government Patta passbook ownership, and revenue land categories across Tamil Nadu."
          highlights={[
            "Land Classifications: Nanjai (Wet / Irrigated), Punjai (Dry Land), Natham (Homestead / Site), Poramboke (Govt. / Common Use)",
            "Hierarchical Resolution: District → Taluk → Village → Designated SRO → Patta Record",
            "Cross-references digital Field Measurement Book (FMB) sketches and registered boundaries"
          ]}
        />

        {/* Live Interactive Survey Finder Utility */}
        <SurveyNumberFinderUtility />
      </div>
    </ToolLayout>
  );
};
