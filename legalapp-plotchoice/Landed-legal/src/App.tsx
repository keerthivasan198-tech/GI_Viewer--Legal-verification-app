import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { PlotCheckQuestionnairePage } from './pages/PlotCheckQuestionnairePage';
import { ECPage } from './pages/tools/ECPage';
import { CERSAIPage } from './pages/tools/CERSAIPage';
import { CourtCasePage } from './pages/tools/CourtCasePage';
import { GuidelineValuePage } from './pages/tools/GuidelineValuePage';
import { CompositeValuePage } from './pages/tools/CompositeValuePage';
import { TemplePropertyPage } from './pages/tools/TemplePropertyPage';
import { WaqfPropertyPage } from './pages/tools/WaqfPropertyPage';
import { StampDutyPage } from './pages/tools/StampDutyPage';
import { SROFinderPage } from './pages/tools/SROFinderPage';
import { FormsTemplatesPage } from './pages/tools/FormsTemplatesPage';
import { BuildingValuePage } from './pages/tools/BuildingValuePage';
import { SurveyNumberPage } from './pages/tools/SurveyNumberPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Tools Directory */}
        <Route path="/" element={<ToolsDirectoryPage />} />
        <Route path="/tools" element={<ToolsDirectoryPage />} />

        {/* Premium Landscape Questionnaire Workspace */}
        <Route path="/questionnaire" element={<PlotCheckQuestionnairePage />} />
        <Route path="/tools/questionnaire" element={<PlotCheckQuestionnairePage />} />

        {/* 12 Individual Property Verification & Calculation Tools */}
        <Route path="/tools/ec" element={<ECPage />} />
        <Route path="/tools/cersai" element={<CERSAIPage />} />
        <Route path="/tools/court-case" element={<CourtCasePage />} />
        <Route path="/tools/guideline-value" element={<GuidelineValuePage />} />
        <Route path="/tools/composite-value" element={<CompositeValuePage />} />
        <Route path="/tools/temple-property" element={<TemplePropertyPage />} />
        <Route path="/tools/waqf-property" element={<WaqfPropertyPage />} />
        <Route path="/tools/stamp-duty" element={<StampDutyPage />} />
        <Route path="/tools/find-sro" element={<SROFinderPage />} />
        <Route path="/tools/forms" element={<FormsTemplatesPage />} />
        <Route path="/tools/building-value" element={<BuildingValuePage />} />
        <Route path="/tools/survey-number" element={<SurveyNumberPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/tools" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
