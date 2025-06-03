// API 설정
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:8000',
  ENDPOINTS: {
    // 인증 관련
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
    
    // 의료진 관련 (현재 백엔드에 이미 구현되어 있음)
    HOSPITALS: '/api/medical/hospitals',
    DOCTORS: '/api/medical/doctors',
    APPOINTMENTS: '/api/medical/appointments',
    DIAGNOSIS_REQUESTS: '/api/medical/diagnosis-requests',
    
    // 사용자 관련
    USERS: '/api/users',
    
    // 의료 기록 관련
    MEDICAL_RECORDS: '/api/medical/medical-records',
    DOCTOR_REVIEWS: '/api/medical/reviews',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API 호출 헬퍼 함수
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      // 422 에러인 경우 응답 본문을 로그로 출력
      if (response.status === 422) {
        try {
          const errorText = await response.text();
          console.error(`422 에러 - URL: ${url}`);
          console.error(`422 에러 - 요청 본문:`, options.body);
          console.error(`422 에러 - 응답 본문:`, errorText);
        } catch (textError) {
          console.error('422 에러 본문 읽기 실패:', textError);
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
}; 