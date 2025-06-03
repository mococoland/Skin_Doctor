import { API_CONFIG, apiCall } from '../config/api';

// 타입 정의
export interface Doctor {
  id: number;
  name: string;
  hospital_id: number;
  specialty: string;
  license_number: string;
  experience_years: number;
  consultation_fee: number;
  bio?: string;
  hospital?: Hospital;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  departments: string[];
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms?: string;
  diagnosis?: string;
  doctor?: Doctor;
  hospital?: Hospital;
  diagnosis_request_id?: number;
}

export interface DiagnosisRequest {
  id: number;
  userId: number;
  userName: string;
  userAge: number;
  userGender: string;
  userPhone: string;
  userEmail: string;
  symptoms: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  previousTreatment: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  additionalNotes: string;
  images: string[];
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: string;
  reviewedByDoctorId?: number;
  reviewNotes?: string;
  reviewedAt?: string;
}

// 의사 관련 API
export const doctorApi = {
  // 모든 의사 목록 조회
  getAllDoctors: async (skip = 0, limit = 100): Promise<Doctor[]> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DOCTORS}?skip=${skip}&limit=${limit}`);
    return response.data || [];
  },

  // 특정 의사 정보 조회
  getDoctorById: async (doctorId: number): Promise<Doctor> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DOCTORS}/${doctorId}`);
    return response.data;
  },

  // 의사 가능 시간 조회
  getDoctorAvailableTimes: async (doctorId: number, date: string): Promise<string[]> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DOCTORS}/${doctorId}/available-times?date=${date}`);
    return response.data.available_times || [];
  },

  // 의사 대시보드 통계 조회
  getDashboardStats: async (doctorId: number): Promise<{
    today_appointments: number;
    pending_appointments: number;
    completed_appointments: number;
    total_patients: number;
  }> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DOCTORS}/${doctorId}/dashboard-stats`);
    return response.data;
  },
};

// 병원 관련 API
export const hospitalApi = {
  // 모든 병원 목록 조회
  getAllHospitals: async (skip = 0, limit = 100): Promise<Hospital[]> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.HOSPITALS}?skip=${skip}&limit=${limit}`);
    return response.data || [];
  },

  // 특정 병원 정보 조회
  getHospitalById: async (hospitalId: number): Promise<Hospital> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.HOSPITALS}/${hospitalId}`);
    return response.data;
  },
};

// 예약 관련 API
export const appointmentApi = {
  // 예약 목록 조회 (의사용)
  getAppointments: async (doctorId?: number, skip = 0, limit = 100): Promise<Appointment[]> => {
    let url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS}?skip=${skip}&limit=${limit}`;
    if (doctorId) {
      url += `&doctor_id=${doctorId}`;
    }
    const response = await apiCall(url);
    return response.data || [];
  },

  // 새 예약 생성
  createAppointment: async (appointmentData: {
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    symptoms?: string;
  }): Promise<Appointment> => {
    const response = await apiCall(API_CONFIG.ENDPOINTS.APPOINTMENTS, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    return response.data;
  },

  // 예약 상태 업데이트
  updateAppointmentStatus: async (appointmentId: number, status: string, diagnosis?: string): Promise<Appointment> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, diagnosis }),
    });
    return response.data;
  },

  // 예약 취소
  cancelAppointment: async (appointmentId: number): Promise<void> => {
    await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
      method: 'DELETE',
    });
  },
};

// 진단 요청 관련 API
export const diagnosisApi = {
  // 진단 요청 목록 조회
  getDiagnosisRequests: async (doctorId?: number): Promise<DiagnosisRequest[]> => {
    let url = API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS;
    if (doctorId) {
      url += `?doctor_id=${doctorId}`;
    }
    const response = await apiCall(url);
    return response.data || [];
  },

  // 진단 요청 상태 업데이트
  updateDiagnosisRequest: async (requestId: number, data: {
    status?: string;
    doctor_id?: number;
    diagnosis?: string;
  }): Promise<DiagnosisRequest> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS}/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

// 대시보드 통계 타입
export interface DashboardStats {
  today_appointments: number;
  pending_appointments: number;
  completed_appointments: number;
  total_patients: number;
}

export const medicalService = {
  // 의사 대시보드 통계 조회
  getDashboardStats: async (doctorId: number): Promise<DashboardStats> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DOCTORS}/${doctorId}/dashboard-stats`);
    return response.data;
  },

  // 예약 목록 조회 (의사별)
  getAppointments: async (doctorId: number): Promise<Appointment[]> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}?doctor_id=${doctorId}`);
    return response;
  },

  // 진료 요청서 상세 조회
  getDiagnosisRequest: async (requestId: number): Promise<DiagnosisRequest> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS}/${requestId}`);
    return response.data;
  },

  // 진료 요청서 목록 조회
  getDiagnosisRequests: async (skip: number = 0, limit: number = 100): Promise<DiagnosisRequest[]> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // 진료 요청서 상태 업데이트
  updateDiagnosisRequestStatus: async (requestId: number, data: {
    status?: string;
    reviewedByDoctorId?: number;
    reviewNotes?: string;
  }): Promise<DiagnosisRequest> => {
    const response = await apiCall(
      `${API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS}/${requestId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
}; 