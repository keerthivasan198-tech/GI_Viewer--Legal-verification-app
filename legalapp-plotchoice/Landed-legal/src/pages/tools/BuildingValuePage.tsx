import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AccordionSection } from '../../components/ui/AccordionSection';
import { RadioGroup } from '../../components/ui/RadioGroup';
import { InfoAlert } from '../../components/ui/InfoAlert';
import { calculateBuildingValuation } from '../../services/buildingValueService';
import { FloorDetail, BuildingValueOutput } from '../../types';
import { Home, Plus, Trash2, Calculator, RotateCcw, Building2 } from 'lucide-react';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';
import { getPropertyContext } from '../../utils/propertyContext';

export const BuildingValuePage: React.FC = () => {
  const ctx = getPropertyContext();
  const defaultArea = ctx.area_sqft || 1774;

  // Base fields
  const [buildingType, setBuildingType] = useState('residential');
  const [region, setRegion] = useState(
    ctx.district?.toLowerCase().includes('trich') ? 'trichy' :
    ctx.district?.toLowerCase().includes('coimb') ? 'coimbatore' :
    ctx.district?.toLowerCase().includes('madur') ? 'madurai' :
    ctx.district?.toLowerCase().includes('salem') ? 'salem' :
    ctx.district?.toLowerCase().includes('tirunel') ? 'tirunelveli' :
    ctx.district?.toLowerCase().includes('chennai') ? 'chennai' : 'trichy'
  );
  const [calculationPeriod, setCalculationPeriod] = useState('2024-2025');
  const [insertionUnit, setInsertionUnit] = useState('sqft');
  const [ageYears, setAgeYears] = useState(5);

  // Floors manager
  const [floors, setFloors] = useState<FloorDetail[]>([
    {
      id: 'f-1',
      floorName: 'Ground Floor (Plinth)',
      areaSqFt: defaultArea,
      materialType: 'RCC Framed Structure',
      woodType: 'Teakwood Doors / Windows',
      roofType: 'RCC Flat Roof'
    }
  ]);

  // Accordion details
  const [floorType, setFloorType] = useState('vitrified');
  const [electricalCost, setElectricalCost] = useState('45000');
  const [waterSupplyCost, setWaterSupplyCost] = useState('25000');
  const [sanitaryCost, setSanitaryCost] = useState('35000');
  const [extraAmenitiesCost, setExtraAmenitiesCost] = useState('50000');
  const [compoundWallLength, setCompoundWallLength] = useState('100');
  const [garageArea, setGarageArea] = useState('150');

  const [valuationResult, setValuationResult] = useState<BuildingValueOutput | null>(null);

  const handleAddFloor = () => {
    const floorIndex = floors.length;
    const names = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor'];
    setFloors([
      ...floors,
      {
        id: `f-${Date.now()}`,
        floorName: names[floorIndex] || `Floor ${floorIndex + 1}`,
        areaSqFt: 1000,
        materialType: 'RCC Framed Structure',
        woodType: 'Country Wood / Teakwood',
        roofType: 'RCC Flat Roof'
      }
    ]);
  };

  const handleRemoveFloor = (id: string) => {
    if (floors.length <= 1) {
      alert('At least one floor specification is required.');
      return;
    }
    setFloors(floors.filter((f) => f.id !== id));
  };

  const handleFloorChange = (id: string, field: keyof FloorDetail, value: any) => {
    setFloors(
      floors.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateBuildingValuation({
      buildingType,
      region,
      calculationPeriod,
      insertionUnit,
      ageYears,
      floors,
      floorType,
      electricalCost: parseFloat(electricalCost) || 0,
      waterSupplyCost: parseFloat(waterSupplyCost) || 0,
      sanitaryCost: parseFloat(sanitaryCost) || 0,
      extraAmenitiesCost: parseFloat(extraAmenitiesCost) || 0,
      compoundWallLength: parseFloat(compoundWallLength) || 0,
      garageArea: parseFloat(garageArea) || 0
    });
    setValuationResult(result);
  };

  const handleReset = () => {
    setBuildingType('residential');
    setRegion('chennai');
    setCalculationPeriod('2024-2025');
    setAgeYears(5);
    setFloors([
      {
        id: 'f-1',
        floorName: 'Ground Floor',
        areaSqFt: 1200,
        materialType: 'RCC Framed Structure',
        woodType: 'Teakwood Doors / Windows',
        roofType: 'RCC Flat Roof'
      }
    ]);
    setValuationResult(null);
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <ToolLayout
      title="Building Value Calculator"
      subtitle="Estimate structural valuation based on PWD Schedule of Rates and annual depreciation rules."
      categoryBadge="STRUCTURAL VALUATION"
      breadcrumbToolName="Building Calculator"
    >
      <div className="space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/building_value_infographic.jpg"
          badgeText="PWD SCHEDULE OF RATES"
          title="Structural Building Valuation & Depreciation Matrix"
          subtitle="Computes replacement cost and depreciated structural value based on official PWD Plinth Area rate sheet (RCC Frame, Masonry, Floor Finish, Plaster & Woodwork)."
          highlights={[
            "Itemized PWD Rate Sheet: RCC Structure (₹1,850/sq.ft), Masonry (₹550), Finishes (₹450), Doors & Windows (₹250)",
            "Depreciation Curve: Age-based reduction (1.5% per annum) calculated up to 60 years lifespan",
            "Formula: [Gross Replacement Cost] - [Depreciation Deduction] = Current Structural Value"
          ]}
        />

        {/* Synchronized GIS Building Banner */}
        {ctx.district && (
          <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl shadow-lg border border-blue-700/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-black rounded-md text-[10px] uppercase tracking-wider">
                  🗺️ CAD-Linked Building
                </span>
                <span className="font-extrabold text-sm text-white">
                  {ctx.door_no ? `${ctx.door_no}, ` : ''}{ctx.road ? `${ctx.road}, ` : ''}{ctx.village || ''} ({ctx.district})
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Survey: <strong className="text-blue-300">{ctx.survey || '479'}/{ctx.subdiv || 'D3'}</strong> &nbsp;|&nbsp; 
                Patta: <strong className="text-blue-300">{ctx.patta || '8412'}</strong> &nbsp;|&nbsp; 
                Owner: <strong className="text-white">{ctx.owner || 'Pattadhar'}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10 shrink-0">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-bold block">Measured Plinth Area</span>
                <span className="text-sm font-black text-emerald-300">{ctx.area_display || `${defaultArea} Sq.Ft`}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modern Two-Panel Layout (Left: Form Inputs, Right: Valuation Summary Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Inputs (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <ToolCard>
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Building Valuation Inputs
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify region, age, multi-floor plinth areas, and interior specifications.
                </p>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Base Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Building Type" required>
                    <SelectInput
                      options={[
                        { value: 'residential', label: 'Residential Villa' },
                        { value: 'apartment', label: 'Apartment Flat' },
                        { value: 'commercial', label: 'Commercial Complex' },
                        { value: 'industrial', label: 'Industrial Shed' }
                      ]}
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Region" required>
                    <SelectInput
                      options={[
                        { value: 'trichy', label: 'Tiruchirappalli (Trichy) Zone' },
                        { value: 'coimbatore', label: 'Coimbatore Area' },
                        { value: 'madurai', label: 'Madurai Zone' },
                        { value: 'salem', label: 'Salem Zone' },
                        { value: 'tirunelveli', label: 'Tirunelveli Zone' },
                        { value: 'vellore', label: 'Vellore Zone' },
                        { value: 'chennai', label: 'Chennai Corporation' },
                        { value: 'other', label: 'Other Special Localities' }
                      ]}
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Period" required>
                    <SelectInput
                      options={[
                        { value: '2024-2025', label: 'Current 2024-2025' },
                        { value: '2023-2024', label: '2023-2024 Rates' }
                      ]}
                      value={calculationPeriod}
                      onChange={(e) => setCalculationPeriod(e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Insertion Unit">
                    <RadioGroup
                      name="insertionUnit"
                      options={[
                        { value: 'sqft', label: 'Square Feet (Sq.Ft)' },
                        { value: 'sqm', label: 'Square Meters (Sq.M)' }
                      ]}
                      selectedValue={insertionUnit}
                      onChange={setInsertionUnit}
                    />
                  </FormField>

                  <FormField label="Age of Building (Years)" required>
                    <TextInput
                      type="number"
                      min="0"
                      max="100"
                      value={ageYears}
                      onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                      placeholder="e.g. 5"
                    />
                  </FormField>
                </div>

                {/* Floors Manager Section */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Floors Specification
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add plinth area and structural specifications for each floor.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFloor}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>Add Floor</span>
                    </button>
                  </div>

                  {/* Floors List */}
                  <div className="space-y-3">
                    {floors.map((flr) => (
                      <div key={flr.id} className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                            {flr.floorName}
                          </span>
                          {floors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFloor(flr.id)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <FormField label="Area (sq.ft)">
                            <TextInput
                              type="number"
                              value={flr.areaSqFt}
                              onChange={(e) =>
                                handleFloorChange(flr.id, 'areaSqFt', parseFloat(e.target.value) || 0)
                              }
                              placeholder="e.g. 1200"
                            />
                          </FormField>

                          <FormField label="Material Type">
                            <SelectInput
                              options={[
                                { value: 'RCC Framed Structure', label: 'RCC Framed' },
                                { value: 'Load Bearing Masonry', label: 'Load Bearing' },
                                { value: 'Steel Structure', label: 'Structural Steel' }
                              ]}
                              value={flr.materialType}
                              onChange={(e) => handleFloorChange(flr.id, 'materialType', e.target.value)}
                            />
                          </FormField>

                          <FormField label="Wood Type">
                            <SelectInput
                              options={[
                                { value: 'Teakwood Doors / Windows', label: 'Teakwood' },
                                { value: 'Country Wood / Padauk', label: 'Country Wood' },
                                { value: 'UPVC / Aluminum Frames', label: 'UPVC / Aluminum' }
                              ]}
                              value={flr.woodType}
                              onChange={(e) => handleFloorChange(flr.id, 'woodType', e.target.value)}
                            />
                          </FormField>

                          <FormField label="Roof Type">
                            <SelectInput
                              options={[
                                { value: 'RCC Flat Roof', label: 'RCC Flat' },
                                { value: 'Tiled Roof / Mangalore Tiles', label: 'Mangalore Tiles' },
                                { value: 'Sheet Roofing', label: 'Metal Sheet' }
                              ]}
                              value={flr.roofType}
                              onChange={(e) => handleFloorChange(flr.id, 'roofType', e.target.value)}
                            />
                          </FormField>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expandable Accordion Sections */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                    Additional Finishes & Amenities
                  </h3>

                  <AccordionSection title="Floor Type" badge="Finishing">
                    <RadioGroup
                      name="floorType"
                      options={[
                        { value: 'vitrified', label: 'Vitrified Tiles' },
                        { value: 'marble', label: 'Italian Marble / Granite' },
                        { value: 'mosaic', label: 'Mosaic / Ceramic Tiles' },
                        { value: 'cement', label: 'Cement Mortar Finish' }
                      ]}
                      selectedValue={floorType}
                      onChange={setFloorType}
                    />
                  </AccordionSection>

                  <AccordionSection title="Electrical Installations" badge="Equipment">
                    <FormField label="Estimated Electrical Installation Value (₹)">
                      <TextInput
                        value={electricalCost}
                        onChange={(e) => setElectricalCost(e.target.value)}
                        placeholder="e.g. 45000"
                      />
                    </FormField>
                  </AccordionSection>

                  <AccordionSection title="Internal Water Supply" badge="Plumbing">
                    <FormField label="Water Supply & Overhead Tank Allowance (₹)">
                      <TextInput
                        value={waterSupplyCost}
                        onChange={(e) => setWaterSupplyCost(e.target.value)}
                        placeholder="e.g. 25000"
                      />
                    </FormField>
                  </AccordionSection>

                  <AccordionSection title="Sanitary Installation" badge="Plumbing">
                    <FormField label="Sanitaryware & Septic Tank Fittings (₹)">
                      <TextInput
                        value={sanitaryCost}
                        onChange={(e) => setSanitaryCost(e.target.value)}
                        placeholder="e.g. 35000"
                      />
                    </FormField>
                  </AccordionSection>

                  <AccordionSection title="Other Extra Amenities" badge="Luxury">
                    <FormField label="Lift, Solar, Interior Woodwork & Extra Amenities (₹)">
                      <TextInput
                        value={extraAmenitiesCost}
                        onChange={(e) => setExtraAmenitiesCost(e.target.value)}
                        placeholder="e.g. 50000"
                      />
                    </FormField>
                  </AccordionSection>

                  <AccordionSection title="Compound Wall" badge="Outer Boundary">
                    <FormField label="Compound Wall Length (Running Feet)">
                      <TextInput
                        value={compoundWallLength}
                        onChange={(e) => setCompoundWallLength(e.target.value)}
                        placeholder="e.g. 100"
                      />
                    </FormField>
                  </AccordionSection>

                  <AccordionSection title="Garage" badge="Parking Shed">
                    <FormField label="Covered Car Parking / Garage Area (sq.ft)">
                      <TextInput
                        value={garageArea}
                        onChange={(e) => setGarageArea(e.target.value)}
                        placeholder="e.g. 150"
                      />
                    </FormField>
                  </AccordionSection>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <PrimaryButton type="submit" icon={<Calculator className="w-4 h-4" />}>
                      Calculate Building Value
                    </PrimaryButton>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-1.5 px-6 h-12 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </ToolCard>
          </div>

          {/* Right Panel: Calculation Summary Card (5 columns on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-indigo-200/90 rounded-2xl p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Valuation Report
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  PWD RATE MODEL
                </span>
              </div>

              {valuationResult ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Total Built-up Plinth Area</span>
                    <span className="font-bold text-slate-900">{valuationResult.totalAreaSqFt} Sq.Ft</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Base PWD Plinth Rate</span>
                    <span className="font-bold text-indigo-700">₹ {valuationResult.basePlinthRate} / Sq.Ft</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Depreciated Structure Value</span>
                    <span className="font-bold text-slate-900">{formatCurrency(valuationResult.depreciatedValue)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Fittings & Amenities Total</span>
                    <span className="font-bold text-slate-900">{formatCurrency(valuationResult.amenitiesTotal)}</span>
                  </div>

                  {/* Prominent Total Highlight Card */}
                  <div className="p-5 bg-[#3730A3] text-white rounded-xl shadow-md">
                    <div className="text-xs font-bold text-indigo-200 uppercase tracking-wide">
                      Estimated Building Valuation
                    </div>
                    <div className="text-2xl font-black mt-1 text-white">
                      {formatCurrency(valuationResult.estimatedBuildingValue)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200/60">
                  <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No Valuation Computed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Calculate Building Value" to generate valuation.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                *Note: Valuation estimates computed per Public Works Department plinth rates and statutory depreciation rules.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
