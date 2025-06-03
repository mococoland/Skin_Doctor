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
  user_id: number;
  doctor_id: number;
  hospital_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
  diagnosis?: string;
  doctor?: Doctor;
  hospital?: Hospital;
  diagnosis_request_id?: number;
  hasMedicalRecord?: boolean;
  medicalRecordId?: number;
  user?: {
    id: number;
    username: string;
    email?: string;
    phone_number?: string;
    age?: number;
    gender?: string;
  };
  cancellation_reason?: string;
  cancelled_by?: 'user' | 'doctor';
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
  // 예약 목록 조회 (의사별)
  getAppointments: async (doctorId?: number, skip: number = 0, limit: number = 100): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    if (doctorId) params.append('doctor_id', doctorId.toString());
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}?${params.toString()}`);
    return response; // 백엔드에서 직접 배열을 반환하므로 response.data가 아닌 response 직접 반환
  },

  // 예약 상세 조회
  getAppointmentDetail: async (appointmentId: number): Promise<any> => {
    try {
      const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`);
      return response; // .data를 제거하고 response 직접 반환
    } catch (error) {
      console.error('예약 상세 정보 조회 실패:', error);
      throw error;
    }
  },

  // 예약 생성
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

  // 예약 취소
  cancelAppointment: async (appointmentId: number): Promise<void> => {
    await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
      method: 'DELETE',
    });
  },

  // 예약 상태 업데이트
  updateAppointmentStatus: async (appointmentId: number, status: string): Promise<Appointment> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  // 예약 확정 (pending → confirmed)
  confirmAppointment: async (appointmentId: number): Promise<any> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}/confirm`, {
      method: 'PATCH',
    });
    return response.data;
  },

  // 진료 완료 (confirmed → completed)
  completeAppointment: async (appointmentId: number): Promise<any> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}/complete`, {
      method: 'PATCH',
    });
    return response.data;
  },

  // 예약 취소 (의사측)
  cancelAppointmentWithReason: async (appointmentId: number, reason: string, cancelledBy: 'doctor' | 'user'): Promise<any> => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        cancellation_reason: reason,
        cancelled_by: cancelledBy
      }),
    });
    return response.data;
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

  // 환자 상세 정보 가져오기 (DiagnosisRequest + User 정보 조인)
  getPatientDetail: async (diagnosisRequestId: number) => {
    const response = await apiCall(`${API_CONFIG.ENDPOINTS.DIAGNOSIS_REQUESTS}/${diagnosisRequestId}/patient-detail`);
    return response; // 전체 응답 반환 (response.data가 아니라)
  },
};

// ⭐ 진료 기록 관련 API
export const medicalRecordApi = {
  // 진료 기록 생성
  createMedicalRecord: async (data: any): Promise<any> => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.MEDICAL_RECORDS, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error: any) {
      console.error('진료 기록 생성 실패:', error);
      throw error;
    }
  },

  // 특정 예약에 대한 진료 기록 존재 여부 확인
  checkMedicalRecordExists: async (appointmentId: number): Promise<boolean> => {
    try {
      const response = await apiCall(`/api/medical/medical-records/appointment/${appointmentId}`);
      return response.exists === true;
    } catch (error: any) {
      console.error('진료 기록 확인 오류:', error);
      return false;
    }
  },

  // 특정 예약에 대한 진료 기록 전체 정보 조회
  getMedicalRecordByAppointment: async (appointmentId: number) => {
    try {
      const response = await apiCall(`/api/medical/medical-records/appointment/${appointmentId}`);
      return response; // 전체 응답 반환 (exists, recordId, data 포함)
    } catch (error: any) {
      console.error('진료 기록 조회 오류:', error);
      throw error;
    }
  },
};

// 환자 목록 관련 타입
export interface PatientHistoryItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  diagnosis: string;
  totalVisits: number;
  status: 'ongoing' | 'completed';
  latestAppointmentId: number;
  hasDiagnosisRequest: boolean;
  diagnosisRequestId?: number;
  symptoms: string;
}

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
    return response; // 백엔드에서 직접 배열을 반환하므로 response.data가 아닌 response 직접 반환
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

  // 예약 상세 정보 조회
  getAppointmentDetail: async (appointmentId: number): Promise<any> => {
    try {
      const response = await apiCall(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`);
      return response; // .data를 제거하고 response 직접 반환
    } catch (error) {
      console.error('예약 상세 정보 조회 실패:', error);
      throw error;
    }
  },

  // 진료 기록 생성
  createMedicalRecord: async (data: any): Promise<any> => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.MEDICAL_RECORDS, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error: any) {
      console.error('진료 기록 생성 실패:', error);
      
      // 422 에러인 경우 응답 본문 확인
      if (error.message && error.message.includes('422')) {
        console.error('422 에러 - 요청 데이터:', JSON.stringify(data, null, 2));
        try {
          // fetch 응답에서 에러 본문 추출
          const errorResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDICAL_RECORDS}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (!errorResponse.ok) {
            const errorText = await errorResponse.text();
            console.error('422 에러 응답 본문:', errorText);
          }
        } catch (fetchError) {
          console.error('에러 본문 조회 실패:', fetchError);
        }
      }
      
      throw error;
    }
  },
};

// ⭐ 새로운 알림 인터페이스
export interface DoctorNotification {
  id: number;
  appointmentId: number;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  formattedTime?: string; // "오전 9:00" 형태의 포맷된 시간
  cancellationReason: string;
  cancelledAt: string;
  symptoms: string;
}

// ⭐ 환자 인터페이스 (Patient)
export interface Patient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  diagnosis: string;
  totalVisits: number;
  status: 'ongoing' | 'completed';
  latestAppointmentId: number;
  hasDiagnosisRequest: boolean;
  diagnosisRequestId?: number;
  symptoms: string;
}

export const notificationApi = {
  // 의사 알림 목록 조회
  getDoctorNotifications: async (doctorId: number): Promise<DoctorNotification[]> => {
    console.log(`🔔 알림 API 호출 시작: doctorId=${doctorId}`);
    try {
      const response = await apiCall(`/api/medical/doctors/${doctorId}/notifications`);
      console.log(`📡 알림 API 원시 응답:`, response);
      console.log(`📡 응답 타입:`, typeof response);
      console.log(`📡 응답 키들:`, Object.keys(response || {}));
      
      // 응답 구조 확인
      if (response && response.success && response.data) {
        console.log(`📊 알림 데이터:`, response.data);
        console.log(`📊 알림 개수: ${response.data.length}`);
        return response.data;
      } else if (Array.isArray(response)) {
        console.log(`📊 직접 배열 응답, 알림 개수: ${response.length}`);
        return response;
      } else {
        console.log(`⚠️ 예상하지 못한 응답 구조:`, response);
        return [];
      }
    } catch (error) {
      console.error(`❌ 알림 API 호출 실패:`, error);
      console.error(`❌ 에러 타입:`, typeof error);
      console.error(`❌ 에러 메시지:`, error instanceof Error ? error.message : String(error));
      return []; // 에러 시 빈 배열 반환
    }
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId: number): Promise<void> => {
    await apiCall(`/api/medical/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  // 예약 기반 알림 읽음 처리 (예약 상세 화면 접근 시)
  markAppointmentNotificationRead: async (appointmentId: number): Promise<{readCount: number}> => {
    const response = await apiCall(`/api/medical/appointments/${appointmentId}/mark-notification-read`, {
      method: 'PATCH',
    });
    return response;
  },
};

// 환자 관련 API
export const patientApi = {
  // 의사의 환자 목록 조회
  getDoctorPatients: async (doctorId: number): Promise<Patient[]> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${doctorId}/patients`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('환자 목록 조회 실패:', error);
      throw error;
    }
  },
}; 