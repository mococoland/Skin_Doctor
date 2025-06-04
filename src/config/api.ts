// API 설정
import { Platform } from 'react-native';

// 환경별 API URL 설정
const getApiBaseUrl = () => {
  if (__DEV__) {
    // 개발 환경
    if (Platform.OS === 'android') {
      // 환경변수가 설정되어 있으면 우선 사용
      if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
      }
      
      // ADB reverse를 사용하는 경우: adb reverse tcp:8000 tcp:8000
      // 그러면 실제 기기에서도 localhost:8000 사용 가능
      // return 'http://localhost:8000';
      
      // 에뮬레이터 전용 주소 (ADB reverse 미사용 시)
      return 'http://10.0.2.2:8000';
    } else {
      // iOS 시뮬레이터에서는 localhost 사용 가능
      return process.env.REACT_APP_API_URL || 'http://localhost:8000';
    }
  } else {
    // 운영 환경: 실제 운영 서버
    return process.env.REACT_APP_PROD_API_URL || 'https://your-production-api.com';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
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