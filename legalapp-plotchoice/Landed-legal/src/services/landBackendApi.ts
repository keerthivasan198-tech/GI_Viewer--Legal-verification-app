export interface ApiDistrict {
  id: string;
  name: string;
}

export interface ApiTaluk {
  id: string;
  name: string;
  districtId: string;
}

export interface ApiVillage {
  id: string;
  name: string;
  talukId: string;
  districtId: string;
}

export interface ApiSurveyItem {
  id: string;
  surveyNumber: string;
  subDivision?: string;
}

export interface LiveLandRecord {
  surveyNumber: string;
  subDivision?: string;
  district: string;
  taluk: string;
  village: string;
  pattaNumber?: string;
  classification?: string;
  landType?: string;
  extent?: string;
  recordStatus?: string;
  aRegisterInfo?: string;
  fmbAvailable?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dataSource: string;
  retrievedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  liveDataAvailable: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface VerificationResponse {
  success: boolean;
  liveDataAvailable: boolean;
  record?: LiveLandRecord;
  error?: string;
  message?: string;
  timestamp: string;
}

const API_BASE_URL = '/api/land';

export const fetchDistrictsFromApi = async (): Promise<ApiResponse<ApiDistrict[]>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/districts`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        liveDataAvailable: false,
        error: errJson.error || 'Live land-record service is currently unavailable.',
        message: errJson.message || 'Unable to connect to live districts API.'
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      liveDataAvailable: false,
      error: 'Unable to connect to the live land-record service.',
      message: err.message || 'Network connection failed.'
    };
  }
};

export const fetchTaluksFromApi = async (districtId: string): Promise<ApiResponse<ApiTaluk[]>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/taluks?district_id=${encodeURIComponent(districtId)}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        liveDataAvailable: false,
        error: errJson.error || 'Unable to load taluks from live source.',
        message: errJson.message
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      liveDataAvailable: false,
      error: 'Unable to connect to the live land-record service.',
      message: err.message
    };
  }
};

export const fetchVillagesFromApi = async (districtId: string, talukId: string): Promise<ApiResponse<ApiVillage[]>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/villages?district_id=${encodeURIComponent(districtId)}&taluk_id=${encodeURIComponent(talukId)}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        liveDataAvailable: false,
        error: errJson.error || 'Unable to load villages from live source.',
        message: errJson.message
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      liveDataAvailable: false,
      error: 'Unable to connect to the live land-record service.',
      message: err.message
    };
  }
};

export const fetchSurveysFromApi = async (districtId: string, talukId: string, villageId: string): Promise<ApiResponse<ApiSurveyItem[]>> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/survey-numbers?district_id=${encodeURIComponent(districtId)}&taluk_id=${encodeURIComponent(talukId)}&village_id=${encodeURIComponent(villageId)}`
    );
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        liveDataAvailable: false,
        error: errJson.error || 'Unable to load survey numbers from live source.',
        message: errJson.message
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      liveDataAvailable: false,
      error: 'Unable to connect to the live land-record service.',
      message: err.message
    };
  }
};

export const verifySurveyNumberLive = async (params: {
  districtId: string;
  talukId: string;
  villageId: string;
  surveyNumber: string;
}): Promise<VerificationResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        district_id: params.districtId,
        taluk_id: params.talukId,
        village_id: params.villageId,
        survey_number: params.surveyNumber
      })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      liveDataAvailable: false,
      error: 'Unable to connect to the live land-record service.',
      message: 'Network connection failed while connecting to live verification backend.',
      timestamp: new Date().toISOString()
    };
  }
};
