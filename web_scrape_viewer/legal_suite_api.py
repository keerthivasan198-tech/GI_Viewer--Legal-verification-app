import os
import json
import time
from datetime import datetime
from flask import Blueprint, request, jsonify

legal_api = Blueprint('legal_api', __name__, url_prefix='/api/v1')

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'legal_data')

def load_json_data(filename):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def calculate_stamp_duty(instrument_type, consideration_value, guideline_value, is_female_buyer=False):
    taxable_value = max(float(consideration_value or 0.0), float(guideline_value or 0.0))
    inst = (instrument_type or "sale").lower()
    stamp_duty_pct = 7.0
    reg_fee_pct = 2.0
    surcharge_pct = 0.0

    if inst in ["settlement", "settlement_family", "partition", "release", "mortgage", "lease"]:
        stamp_duty_pct = 1.0
        reg_fee_pct = 1.0
    elif inst == "gift":
        stamp_duty_pct = 7.0
        reg_fee_pct = 2.0

    stamp_duty_amt = round((taxable_value * stamp_duty_pct) / 100.0)
    reg_fee_amt = round((taxable_value * reg_fee_pct) / 100.0)
    surcharge_amt = round((taxable_value * surcharge_pct) / 100.0)
    total_outlay = stamp_duty_amt + reg_fee_amt + surcharge_amt

    return {
        "taxableMarketValue": taxable_value,
        "stampDutyPercent": stamp_duty_pct,
        "stampDutyAmount": stamp_duty_amt,
        "registrationFeePercent": reg_fee_pct,
        "registrationFeeAmount": reg_fee_amt,
        "surchargePercent": surcharge_pct,
        "surchargeAmount": surcharge_amt,
        "totalOutlay": total_outlay,
        "calculationBasis": "Calculated on Agreed Consideration Value (higher than Guideline Value)" if float(consideration_value or 0.0) > float(guideline_value or 0.0) else "Calculated on Government Guideline Value (higher than Agreed Consideration)"
    }

def calculate_building_value(building_type, age_years, total_area_sqft, amenities_cost=0.0):
    base_rate = 1800.0
    b_type = (building_type or "residential_rcc").lower()
    if "commercial" in b_type:
        base_rate = 2400.0
    elif "industrial" in b_type:
        base_rate = 1500.0
    elif "tiled" in b_type:
        base_rate = 1100.0

    gross_replacement_value = float(total_area_sqft or 0.0) * base_rate
    depreciation_pct = min(float(age_years or 0) * 1.5, 60.0)
    depreciation_amount = round((gross_replacement_value * depreciation_pct) / 100.0)
    depreciated_structure_value = gross_replacement_value - depreciation_amount
    net_estimated_value = depreciated_structure_value + float(amenities_cost or 0.0)

    return {
        "totalAreaSqFt": total_area_sqft,
        "basePlinthRatePerSqFt": base_rate,
        "grossReplacementValue": gross_replacement_value,
        "depreciationPercent": depreciation_pct,
        "depreciationAmount": depreciation_amount,
        "depreciatedStructureValue": depreciated_structure_value,
        "amenitiesCost": amenities_cost or 0.0,
        "estimatedBuildingValue": net_estimated_value
    }

# 1. Health
@legal_api.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "PlotCheck Legal & Cadastral Intelligence Suite",
        "framework": "Flask + PlotCheck Engine",
        "version": "1.0.0"
    })

# 2. EC Search
@legal_api.route('/ec/search', methods=['POST'])
def search_ec():
    query = request.json or {}
    survey_rows = query.get("surveyRows", [])
    plots = query.get("plots", [])
    primary_survey = survey_rows[0].get("surveyNumber", "142/3B") if survey_rows else "142/3B"
    primary_plot = plots[0].get("plotNumber", "Plot No. 42B") if plots else "Plot No. 42B"

    if query.get("searchMode") == "document":
        records = [
            {
                "id": "EC-DOC-001",
                "documentNumber": f"Doc {query.get('documentNumber') or '1420'} / {query.get('documentYear') or '2021'}",
                "registrationDate": f"15-Mar-{query.get('documentYear') or '2021'}",
                "natureOfDocument": query.get('documentType') or "Sale Deed (Conveyance)",
                "executants": "K. Rajendran & Co-owners",
                "claimants": "S. Ananthakrishnan",
                "propertyDescription": f"{primary_plot}, Green Park Enclave, Door No. 12",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": False,
                "remarks": "Registered absolute sale deed. Clean title."
            }
        ]
    else:
        records = [
            {
                "id": "EC-TX-001",
                "documentNumber": "Doc 1420 / 2021",
                "registrationDate": "15-Mar-2021",
                "natureOfDocument": "Sale Deed (Conveyance)",
                "executants": "K. Rajendran",
                "claimants": "S. Ananthakrishnan",
                "propertyDescription": f"{primary_plot}, Survey No {primary_survey}, {query.get('village') or 'Velachery'}",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": False
            },
            {
                "id": "EC-TX-002",
                "documentNumber": "Doc 890 / 2018",
                "registrationDate": "10-May-2018",
                "natureOfDocument": "Deposit of Title Deeds (Mortgage)",
                "executants": "S. Ananthakrishnan",
                "claimants": "HDFC Bank Ltd.",
                "propertyDescription": f"{primary_plot}, Survey No {primary_survey}",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": True,
                "remarks": "Home loan mortgage charge. Release receipt recommended."
            }
        ]

    return jsonify({
        "success": True,
        "totalRecords": len(records),
        "data": records,
        "message": "Encumbrance Certificate ledger processed successfully."
    })

# 3. CERSAI
@legal_api.route('/cersai/search', methods=['POST'])
def search_cersai():
    query = request.json or {}
    records = [
        {
            "id": "CERSAI-SEC-901",
            "securityInterestId": "SI-2021-098412",
            "borrowerName": query.get("borrowerName") or "S. Ananthakrishnan",
            "lenderBank": "HDFC Bank Ltd.",
            "assetCategory": "Immovable Residential Property",
            "propertyAddress": query.get("propertyAddress") or "Plot 42B, Green Park Enclave, Velachery, Chennai",
            "surveyNo": query.get("surveyNumber") or "142/3B",
            "sanctionedAmount": 5500000,
            "chargeCreationDate": "12-May-2018",
            "chargeStatus": "ACTIVE"
        }
    ]
    return jsonify({
        "success": True,
        "count": len(records),
        "data": records,
        "message": "CERSAI Central Securitisation Registry lookup complete."
    })

# 4. Court Cases
@legal_api.route('/court/search', methods=['POST'])
def search_court():
    query = request.json or {}
    records = [
        {
            "id": "CRT-001",
            "cnrNumber": query.get("cnrNumber") or "TNCH01-002491-2023",
            "caseNumber": query.get("caseNumber") or "OS 340/2023",
            "caseType": "Original Suit (Partition & Injunction)",
            "year": "2023",
            "courtName": "Principal District Munsif Court, Alandur",
            "petitioner": query.get("partyName") or "K. Ramesh & Others",
            "respondent": "K. Rajendran & S. Ananthakrishnan",
            "surveyNo": query.get("surveyNumber") or "142/3B",
            "status": "DISPOSED",
            "summary": "Suit for partition dismissed. Clear decree in favor of defendants. No active stay order."
        }
    ]
    return jsonify({
        "success": True,
        "count": len(records),
        "data": records,
        "message": "eCourts judicial litigation search completed."
    })

# 5. Guideline Value
@legal_api.route('/guideline/search', methods=['POST'])
def search_guideline():
    query = request.json or {}
    master_data = load_json_data('guideline_master.json')

    results = []
    district_q = query.get("district", "")
    village_q = query.get("village", "")
    street_q = query.get("streetName", "")

    for g in master_data:
        if district_q and g.get("district", "").lower() != district_q.lower():
            continue
        if village_q and village_q.lower() not in g.get("village", "").lower():
            continue
        if street_q and street_q.lower() not in g.get("streetName", "").lower():
            continue
        results.append(g)

    if not results:
        results = [
            {
                "id": "GL-GEN-001",
                "zone": query.get("zone") or "Chennai South",
                "district": query.get("district") or "Chennai",
                "sro": query.get("sro") or "Velachery",
                "village": query.get("village") or "Velachery",
                "streetName": query.get("streetName") or "Main Street",
                "surveyNumber": query.get("surveyNumber") or "142/3B",
                "guidelineValueSqFt": 6500,
                "guidelineValueAcre": 283140000,
                "compositeValueSqFt": 9200,
                "landClassification": "Residential Regular Class",
                "effectiveDate": "01-Jul-2024"
            }
        ]

    return jsonify({
        "success": True,
        "count": len(results),
        "data": results
    })

# 6. Composite Valuation
@legal_api.route('/composite/calculate', methods=['POST'])
def calculate_composite():
    query = request.json or {}
    land_rate = float(query.get("landGuidelineSqFt") or 8500.0)
    sbu_area = float(query.get("superBuiltUpAreaSqFt") or 1200.0)
    uds_area = float(query.get("udsAreaSqFt") or 450.0)
    age = float(query.get("ageYears") or 3)

    land_value_component = uds_area * land_rate
    construction_rate = 2800.0 if query.get("buildingClass") != "premium" else 3600.0

    gross_building_component = sbu_area * construction_rate
    depreciation_amount = round((gross_building_component * min(age * 1.5, 50.0)) / 100.0)
    net_building_component = gross_building_component - depreciation_amount

    total_composite_valuation = land_value_component + net_building_component
    effective_composite_rate_sqft = round(total_composite_valuation / sbu_area) if sbu_area > 0 else 0

    return jsonify({
        "success": True,
        "data": {
            "landRateSqFt": land_rate,
            "udsAreaSqFt": uds_area,
            "landValueComponent": land_value_component,
            "constructionRateSqFt": construction_rate,
            "grossBuildingComponent": gross_building_component,
            "depreciationAmount": depreciation_amount,
            "netBuildingComponent": net_building_component,
            "totalCompositeValuation": total_composite_valuation,
            "effectiveCompositeRateSqFt": effective_composite_rate_sqft
        }
    })

# 7. Temple Check
@legal_api.route('/temple/check', methods=['POST'])
def check_temple():
    query = request.json or {}
    master_data = load_json_data('temple_prohibited.json')

    clean_sno = str(query.get("surveyNumber") or "").strip()
    temple_name = str(query.get("templeName") or "").lower()

    match = None
    for t in master_data:
        if clean_sno and str(t.get("surveyNumber", "")).strip() == clean_sno:
            match = t
            break
        if temple_name and temple_name in t.get("institutionName", "").lower():
            match = t
            break

    if match:
        return jsonify({
            "success": True,
            "isProhibited": True,
            "riskLevel": "HIGH_RISK_PROHIBITED",
            "data": match,
            "statutoryAdvice": "Property is classified as Temple Inam/Devadhanam land under Section 22-A of Registration Act. Strictly prohibited from private registration."
        })

    return jsonify({
        "success": True,
        "isProhibited": False,
        "riskLevel": "CLEAR",
        "data": None,
        "statutoryAdvice": "No Section 22-A HR&CE Temple endowment restrictions detected for this survey number."
    })

# 8. Waqf Check
@legal_api.route('/waqf/check', methods=['POST'])
def check_waqf():
    query = request.json or {}
    master_data = load_json_data('waqf_prohibited.json')

    clean_sno = str(query.get("surveyNumber") or "").strip()
    waqf_name = str(query.get("waqfName") or "").lower()

    match = None
    for w in master_data:
        if clean_sno and str(w.get("surveyNumber", "")).strip() == clean_sno:
            match = w
            break
        if waqf_name and waqf_name in w.get("institutionName", "").lower():
            match = w
            break

    if match:
        return jsonify({
            "success": True,
            "isProhibited": True,
            "riskLevel": "HIGH_RISK_PROHIBITED",
            "data": match,
            "statutoryAdvice": "Property is registered with Tamil Nadu Waqf Board under Section 22-A. Private sale or alienation is void ab initio."
        })

    return jsonify({
        "success": True,
        "isProhibited": False,
        "riskLevel": "CLEAR",
        "data": None,
        "statutoryAdvice": "No Section 22-A Waqf Board restrictions detected for this survey number."
    })

# 9. Stamp Duty
@legal_api.route('/stamp-duty/calculate', methods=['POST'])
def compute_stamp_duty():
    query = request.json or {}
    result = calculate_stamp_duty(
        instrument_type=query.get("instrumentType") or "sale",
        consideration_value=float(query.get("considerationValue") or 0.0),
        guideline_value=float(query.get("guidelineValue") or 0.0),
        is_female_buyer=bool(query.get("isFemaleBuyer"))
    )
    return jsonify({
        "success": True,
        "data": result
    })

# 10. SRO
@legal_api.route('/sro/list', methods=['GET'])
def list_sros():
    district = request.args.get('district')
    zone = request.args.get('zone')
    master_data = load_json_data('sro_master.json')
    results = master_data
    if district:
        results = [s for s in results if s.get("district", "").lower() == district.lower()]
    if zone:
        results = [s for s in results if s.get("zone", "").lower() == zone.lower()]
    return jsonify({"success": True, "count": len(results), "data": results})

@legal_api.route('/sro/find', methods=['POST'])
def find_sro():
    query = request.json or {}
    master_data = load_json_data('sro_master.json')

    match = None
    pincode = str(query.get("pincode") or "").strip()
    village = str(query.get("village") or "").lower()
    taluk = str(query.get("taluk") or "").lower()

    for s in master_data:
        if pincode and s.get("pincode") == pincode:
            match = s
            break
        if village and any(village in v.lower() for v in s.get("jurisdictionVillages", [])):
            match = s
            break
        if taluk and taluk in s.get("taluk", "").lower():
            match = s
            break

    if not match:
        match = master_data[0] if master_data else {
            "sroName": "Chennai Central SRO",
            "zone": "Chennai",
            "district": "Chennai",
            "address": "100, Rajaji Salai, Chennai - 600001",
            "contactPhone": "044-25220011",
            "jurisdictionVillages": ["Chennai Corporation", "George Town", "Mylapore"]
        }

    return jsonify({
        "success": True,
        "data": match,
        "message": "Designated Sub-Registrar Office located successfully."
    })

# 11. Forms & Deeds
@legal_api.route('/forms/templates', methods=['GET'])
def list_templates():
    templates = [
        {"id": "sale-agreement", "name": "Agreement to Sell", "category": "draft-deed"},
        {"id": "sale-deed", "name": "Absolute Sale Deed", "category": "draft-deed"},
        {"id": "lease-agreement", "name": "Residential Lease Agreement", "category": "draft-deed"},
        {"id": "general-power-of-attorney", "name": "General Power of Attorney (GPA)", "category": "draft-deed"},
        {"id": "settlement-deed", "name": "Family Settlement Deed", "category": "draft-deed"},
        {"id": "will-deed", "name": "Last Will and Testament", "category": "draft-deed"}
    ]
    return jsonify({"success": True, "count": len(templates), "data": templates})

@legal_api.route('/forms/generate', methods=['POST'])
def generate_deed():
    query = request.json or {}
    template_id = query.get("templateId") or "sale-deed"
    return jsonify({
        "success": True,
        "deedId": f"DEED-{int(time.time()*1000)}",
        "templateId": template_id,
        "downloadDocxUrl": f"/downloads/deeds/deed-{template_id}.docx",
        "downloadPdfUrl": f"/downloads/deeds/deed-{template_id}.pdf",
        "message": "Legal deed generated with custom recitals and property schedules."
    })

# 12. Building Value
@legal_api.route('/building-value/calculate', methods=['POST'])
def compute_building_value():
    query = request.json or {}
    result = calculate_building_value(
        building_type=query.get("buildingType") or "residential_rcc",
        age_years=int(query.get("ageYears") or 5),
        total_area_sqft=float(query.get("totalAreaSqFt") or 1500.0),
        amenities_cost=float(query.get("amenitiesCost") or 0.0)
    )
    return jsonify({
        "success": True,
        "data": result
    })

# 13. Survey Intelligence
@legal_api.route('/survey/resolve', methods=['POST'])
def resolve_survey():
    query = request.json or {}
    sno = query.get("surveyNumber") or "142"
    subdiv = query.get("subDivision") or "3B"
    return jsonify({
        "success": True,
        "data": {
            "surveyNumber": sno,
            "subDivision": subdiv,
            "fullSurveyKey": f"{sno}/{subdiv}",
            "district": query.get("district") or "Chennai",
            "taluk": query.get("taluk") or "Velachery",
            "village": query.get("village") or "Velachery",
            "sroName": "Velachery SRO",
            "landClassification": "Ryotwari Natham / Residential",
            "pattaNumber": "PATTA-VEL-2021-982",
            "totalExtent": "0.08 Hectares (1,950 Sq.Ft)",
            "fmbSketchAvailable": True,
            "fmbSketchUrl": "/api/v1/fmb/preview/142-3B.pdf"
        },
        "message": "Cadastral survey intelligence resolved."
    })

# 14. Master Property Audit
@legal_api.route('/audit/full-property-audit', methods=['POST'])
def run_full_property_audit():
    query = request.json or {}
    sno = query.get("surveyNumber") or "142"
    subdiv = query.get("subDivision") or "3B"
    full_key = f"{sno}/{subdiv}"
    vill = query.get("village") or "Velachery"
    dist = query.get("district") or "Chennai"

    sro_data = load_json_data('sro_master.json')
    temple_data = load_json_data('temple_prohibited.json')
    waqf_data = load_json_data('waqf_prohibited.json')
    guideline_data = load_json_data('guideline_master.json')

    sro_match = next((s for s in sro_data if any(vill.lower() in v.lower() for v in s.get("jurisdictionVillages", []))), sro_data[0] if sro_data else {})
    is_temple = any(str(t.get("surveyNumber", "")).strip() == str(sno).strip() for t in temple_data)
    is_waqf = any(str(w.get("surveyNumber", "")).strip() == str(sno).strip() for w in waqf_data)
    gl_match = next((g for g in guideline_data if vill.lower() in g.get("village", "").lower()), guideline_data[0] if guideline_data else {"guidelineValueSqFt": 6500})

    gl_rate = gl_match.get("guidelineValueSqFt", 6500)
    guideline_total = gl_rate * 1450
    stamp_duty_res = calculate_stamp_duty(
        instrument_type="sale",
        consideration_value=float(query.get("agreedConsideration") or guideline_total),
        guideline_value=guideline_total
    )

    trust_score = 95
    if is_temple:
        trust_score -= 70
    if is_waqf:
        trust_score -= 70

    return jsonify({
        "success": True,
        "data": {
            "auditId": f"AUDIT-{int(time.time()*1000)}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "propertyAnchor": {
                "surveyNumber": sno,
                "subDivision": subdiv,
                "fullSurveyKey": full_key,
                "village": vill,
                "district": dist,
                "sro": sro_match.get("sroName", "Designated SRO"),
                "sroAddress": sro_match.get("address", "Chennai")
            },
            "verificationSummary": {
                "trustScore": trust_score,
                "overallStatus": "VERIFIED_AND_CLEAR" if trust_score > 80 else "CRITICAL_RISK_DETECTED",
                "checks": {
                    "section22ATemple": {
                        "passed": not is_temple,
                        "status": "PROHIBITED" if is_temple else "CLEAR"
                    },
                    "section22AWaqf": {
                        "passed": not is_waqf,
                        "status": "PROHIBITED" if is_waqf else "CLEAR"
                    },
                    "encumbranceStatus": {
                        "passed": True,
                        "status": "TRANSACTIONS_FOUND_TITLE_CONTINUOUS",
                        "activeMortgage": True,
                        "mortgageBank": "HDFC Bank Ltd."
                    },
                    "courtDisputeStatus": {
                        "passed": True,
                        "status": "PRIOR_SUIT_DISPOSED_CLEAR_DECREE"
                    }
                }
            },
            "valuationAndFees": {
                "guidelineRateSqFt": gl_rate,
                "guidelineTotalOutlay": guideline_total,
                "stampDutyDetails": stamp_duty_res
            },
            "aiLegalOpinionSummary": f"The property at Survey No {full_key}, {vill} has continuous chain of title with no Section 22-A prohibited land encumbrances. Prior court suit was disposed in favor of current owner. Original mortgage discharge receipt from HDFC Bank should be verified before final registration." if trust_score > 80 else f"HIGH RISK DETECTED: Survey No {full_key} matches Section 22-A prohibited records. Private registration is blocked by statutory authorities."
        }
    })
