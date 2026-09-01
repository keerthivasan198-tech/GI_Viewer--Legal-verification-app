export interface ActivePropertyContext {
  district?: string;
  taluk?: string;
  village?: string;
  road?: string;
  door_no?: string;
  street_address?: string;
  survey?: string;
  subdiv?: string;
  patta?: string;
  owner?: string;
  owner_tamil?: string;
  category?: string;
  type?: string;
  area_sqft?: number;
  area_sqm?: number;
  area_cents?: number;
  area_display?: string;
  postcode?: string;
  lat?: number;
  lng?: number;
  zone?: string;
  districtKey?: string;
  sroKey?: string;
  villageKey?: string;
}

export function resolveTnRegistrationHierarchy(districtInput?: string, talukInput?: string, villageInput?: string) {
  const d = (districtInput || '').toLowerCase().trim();
  
  if (d.includes('trich') || d.includes('tiruchirappalli')) {
    return { zone: 'trichy', districtKey: 'trichy', sroKey: 'trichy_joint_1', villageKey: 'tharanallur' };
  } else if (d.includes('coimbatore')) {
    return { zone: 'coimbatore', districtKey: 'coimbatore', sroKey: 'coimbatore_joint_1', villageKey: 'ramanathapuram_cbe' };
  } else if (d.includes('madurai')) {
    return { zone: 'madurai', districtKey: 'madurai', sroKey: 'madurai_joint_1', villageKey: 'madurai_north_v' };
  } else if (d.includes('salem')) {
    return { zone: 'salem', districtKey: 'salem', sroKey: 'salem_west', villageKey: 'suramangalam' };
  } else if (d.includes('chengalpattu')) {
    return { zone: 'chennai', districtKey: 'chengalpattu', sroKey: 'chengalpattu_joint_1', villageKey: 'chengalpattu_town' };
  } else if (d.includes('kanchipuram')) {
    return { zone: 'chennai', districtKey: 'kanchipuram', sroKey: 'kanchipuram_joint_1', villageKey: 'kanchipuram_town' };
  } else if (d.includes('tirunelveli')) {
    return { zone: 'tirunelveli', districtKey: 'tirunelveli', sroKey: 'tirunelveli_joint_1', villageKey: 'palayamkottai_v' };
  } else if (d.includes('thanjavur')) {
    return { zone: 'thanjavur', districtKey: 'thanjavur', sroKey: 'thanjavur_joint_1', villageKey: 'thanjavur_town' };
  } else if (d.includes('vellore')) {
    return { zone: 'vellore', districtKey: 'vellore', sroKey: 'vellore_joint_1', villageKey: 'vellore_town' };
  } else if (d.includes('cuddalore')) {
    return { zone: 'cuddalore', districtKey: 'cuddalore', sroKey: 'cuddalore_joint_1', villageKey: 'cuddalore_ot' };
  } else if (d.includes('erode')) {
    return { zone: 'coimbatore', districtKey: 'erode', sroKey: 'erode_joint_1', villageKey: 'erode_town' };
  } else if (d.includes('tiruppur')) {
    return { zone: 'coimbatore', districtKey: 'tiruppur', sroKey: 'tiruppur_joint_1', villageKey: 'tiruppur_town' };
  } else if (d.includes('dindigul')) {
    return { zone: 'madurai', districtKey: 'dindigul', sroKey: 'dindigul_joint_1', villageKey: 'dindigul_town' };
  }

  return { zone: 'chennai', districtKey: 'chennai_central', sroKey: 't_nagar', villageKey: 't_nagar_v' };
}

export function getPropertyContext(): ActivePropertyContext {
  let ctx: ActivePropertyContext = {};
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("tngis_current_property") : null;
    if (raw) {
      ctx = JSON.parse(raw);
    }
  } catch (e) {}

  if (typeof window !== "undefined" && window.location) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("district")) ctx.district = params.get("district")!;
    if (params.get("taluk")) ctx.taluk = params.get("taluk")!;
    if (params.get("village")) ctx.village = params.get("village")!;
    if (params.get("road")) ctx.road = params.get("road")!;
    if (params.get("survey")) ctx.survey = params.get("survey")!;
    if (params.get("subdiv")) ctx.subdiv = params.get("subdiv")!;
    if (params.get("patta")) ctx.patta = params.get("patta")!;
    if (params.get("owner")) ctx.owner = params.get("owner")!;
    if (params.get("owner_tamil")) ctx.owner_tamil = params.get("owner_tamil")!;
    if (params.get("category")) ctx.category = params.get("category")!;
    if (params.get("type")) ctx.type = params.get("type")!;
    if (params.get("postcode")) ctx.postcode = params.get("postcode")!;
    if (params.get("area")) ctx.area_display = params.get("area")!;
  }

  const h = resolveTnRegistrationHierarchy(ctx.district, ctx.taluk, ctx.village);
  ctx.zone = h.zone;
  ctx.districtKey = h.districtKey;
  ctx.sroKey = h.sroKey;
  ctx.villageKey = h.villageKey;

  return ctx;
}
