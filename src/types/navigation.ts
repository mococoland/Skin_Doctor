// 공통 인터페이스들
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  time: string;
  status: 'waiting' | 'completed' | 'upcoming';
  symptoms: string;
  phone: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  currentMedications?: string;
  medicalHistory?: string;
}

export interface DiagnosisRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  notes: string;
  doctorId: string;
}

// 네비게이션 파라미터 타입
export type DoctorStackParamList = {
  // 홈 및 인증
  HomeScreen: undefined;
  LoginScreen: undefined;
  DoctorRegister: undefined;
  FindIdScreen: undefined;
  DoctorFindPassword: undefined;
  
  // 메인 앱
  DashboardScreen: undefined;
  AppointmentList: undefined;
  PatientDetail: {
    patientId: string;
    appointmentId: string;
    patientName: string;
  };
  DiagnosisWrite: {
    patientId: string;
    appointmentId: string;
    patientName: string;
  };
  PatientHistory: undefined;
  PatientHistoryDetail: {
    patientId: string;
    patientName: string;
  };
  DoctorProfile: undefined;
};

// React Navigation 타입 확장
declare global {
  namespace ReactNavigation {
    interface RootParamList extends DoctorStackParamList {}
  }
}