def calculate_stamp_duty(instrument_type: str, consideration_value: float, guideline_value: float, is_female_buyer: bool = False):
    taxable_value = max(consideration_value or 0.0, guideline_value or 0.0)
    
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
        "calculationBasis": "Calculated on Agreed Consideration Value (higher than Guideline Value)" if consideration_value > guideline_value else "Calculated on Government Guideline Value (higher than Agreed Consideration)"
    }

def calculate_building_value(building_type: str, age_years: int, total_area_sqft: float, amenities_cost: float = 0.0):
    base_rate = 1800.0
    b_type = (building_type or "residential_rcc").lower()
    if "commercial" in b_type:
        base_rate = 2400.0
    elif "industrial" in b_type:
        base_rate = 1500.0
    elif "tiled" in b_type:
        base_rate = 1100.0

    gross_replacement_value = total_area_sqft * base_rate
    depreciation_pct = min(age_years * 1.5, 60.0)
    depreciation_amount = round((gross_replacement_value * depreciation_pct) / 100.0)
    depreciated_structure_value = gross_replacement_value - depreciation_amount
    net_estimated_value = depreciated_structure_value + (amenities_cost or 0.0)

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