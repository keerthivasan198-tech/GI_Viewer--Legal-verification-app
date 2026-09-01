
import { Router } from 'express';
import { listSROs, findSRO } from '../controllers/sroController';
import { searchGuideline } from '../controllers/guidelineController';
import { checkTempleProperty } from '../controllers/templeController';
import { checkWaqfProperty } from '../controllers/waqfController';
import { computeStampDuty } from '../controllers/stampDutyController';
import { computeBuildingValue } from '../controllers/buildingValueController';
import { searchEC } from '../controllers/ecController';
import { searchCERSAI } from '../controllers/cersaiController';
import { searchCourt } from '../controllers/courtController';
import { resolveSurvey } from '../controllers/surveyController';
import { calculateComposite } from '../controllers/compositeController';
import { listTemplates, generateDeed } from '../controllers/formsController';
import { runFullPropertyAudit } from '../controllers/auditController';
import { sendOTP, verifyOTP } from '../controllers/authController';

const router = Router();

// Auth
router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);

// Master Unified Audit
router.post('/audit/full-property-audit', runFullPropertyAudit);

// 12 Individual Tools
router.post('/ec/search', searchEC);
router.post('/cersai/search', searchCERSAI);
router.post('/court/search', searchCourt);
router.post('/guideline/search', searchGuideline);
router.post('/composite/calculate', calculateComposite);
router.post('/temple/check', checkTempleProperty);
router.post('/waqf/check', checkWaqfProperty);
router.post('/stamp-duty/calculate', computeStampDuty);
router.get('/sro/list', listSROs);
router.post('/sro/find', findSRO);
router.get('/forms/templates', listTemplates);
router.post('/forms/generate', generateDeed);
router.post('/building-value/calculate', computeBuildingValue);
router.post('/survey/resolve', resolveSurvey);

export default router;
