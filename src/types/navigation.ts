// 공통 인터페이스들
export interface Appointment {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: string
  time: string
  status: "waiting" | "completed" | "upcoming" | "cancelled"
  symptoms: string
  phone: string
  email?: string
  appointmentType?: "consultation" | "follow-up" | "emergency"
  priority?: "low" | "medium" | "high"
  notes?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address?: string
  emergencyContact?: string
  emergencyContactPhone?: string
  allergies?: string
  currentMedications?: string
  medicalHistory?: string
  bloodType?: string
  height?: string
  weight?: string
  insuranceNumber?: string
  registrationDate?: string
  lastVisit?: string
}

export interface DiagnosisRecord {
  id: string
  patientId: string
  appointmentId: string
  date: string
  diagnosis: string
  severity?: "mild" | "moderate" | "severe"
  treatment: string
  medication: string
  dosage?: string
  precautions?: string
  followUp?: string
  nextAppointment?: string
  notes: string
  doctorId: string
  doctorName?: string
  status?: "draft" | "sent" | "completed"
}

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  hospital: string
  department: string
  specialization: string
  experience?: string
  bio?: string
  profileImage?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface User extends Doctor {
  // User는 Doctor의 모든 속성을 포함
  role: "doctor" | "admin"
  lastLogin?: string
  preferences?: {
    notifications: boolean
    autoReply: boolean
    theme?: "light" | "dark"
    language?: string
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "appointment" | "diagnosis" | "system" | "reminder"
  isRead: boolean
  createdAt: string
  data?: any
}

export interface Statistics {
  todayAppointments: number
  waitingPatients: number
  completedToday: number
  totalPatients: number
  thisWeekAppointments: number
  thisMonthAppointments: number
  averageWaitTime?: number
  patientSatisfaction?: number
}

// 네비게이션 파라미터 타입
export type DoctorStackParamList = {
  // 홈 및 인증
  HomeScreen: undefined
  LoginScreen: undefined
  DoctorRegister: undefined
  FindIdScreen: undefined
  DoctorFindPassword: undefined

  // 메인 앱
  DashboardScreen: undefined
  AppointmentList: {
    initialTab?: 'all' | 'waiting' | 'completed' | 'upcoming'
  }
  PatientDetail: {
    patientId: string
    appointmentId: string
    patientName: string
    diagnosisRequestId?: number
  }
  DiagnosisWrite: {
    patientId: string
    appointmentId: string
    patientName: string
    diagnosisRequestId?: number
  }
  MedicalRecordView: {
    appointmentId: string
    patientName: string
  }
  DiagnosisRequestDetail: {
    requestId: number
    patientId: string
  }
  PatientHistory: undefined
  PatientHistoryDetail: {
    patientId: string
    patientName: string
    recordId?: string
  }
  DoctorProfile: undefined

  // 설정 및 보안
  ChangePassword: undefined
  NotificationSettings?: undefined
  PrivacySettings?: undefined

  // 추가 기능 (향후 확장용)
  PatientSearch?: {
    searchQuery?: string
  }
  AppointmentDetail?: {
    appointmentId: string
  }
  DiagnosisHistory?: {
    patientId: string
  }
  Settings?: undefined
  Help?: undefined
  About?: undefined
}

// 폼 데이터 타입들
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  licenseNumber: string
  hospital: string
  department: string
  specialization: string
  agreeToTerms: boolean
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface DiagnosisFormData {
  diagnosis: string
  severity: string
  treatment: string
  medication: string
  dosage: string
  precautions: string
  followUp: string
  nextAppointment: string
  notes: string
}

// API 응답 타입들
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// 필터 및 정렬 타입들
export interface AppointmentFilter {
  status?: Appointment["status"]
  date?: string
  patientName?: string
  priority?: Appointment["priority"]
}

export interface PatientFilter {
  name?: string
  age?: {
    min?: number
    max?: number
  }
  gender?: string
  lastVisit?: string
}

export interface SortOption {
  field: string
  direction: "asc" | "desc"
}

// 상태 관리 타입들
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  filter: AppointmentFilter
  sortBy: SortOption
}

export interface PatientState {
  patients: Patient[]
  currentPatient: Patient | null
  loading: boolean
  error: string | null
  filter: PatientFilter
}

export interface DiagnosisState {
  records: DiagnosisRecord[]
  currentRecord: DiagnosisRecord | null
  loading: boolean
  error: string | null
}

// React Navigation 타입 확장
declare global {
  namespace ReactNavigation {
    interface RootParamList extends DoctorStackParamList {}
  }
}

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// 상수 타입들
export const APPOINTMENT_STATUS = {
  WAITING: "waiting",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
  CANCELLED: "cancelled",
} as const

export const PATIENT_GENDER = {
  MALE: "남성",
  FEMALE: "여성",
  OTHER: "기타",
} as const

export const DIAGNOSIS_SEVERITY = {
  MILD: "mild",
  MODERATE: "moderate",
  SEVERE: "severe",
} as const

export const NOTIFICATION_TYPES = {
  APPOINTMENT: "appointment",
  DIAGNOSIS: "diagnosis",
  SYSTEM: "system",
  REMINDER: "reminder",
} as const

// 에러 타입들
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  code: number
  message: string
  details?: any
}

// 이벤트 타입들
export interface AppointmentEvent {
  type: "created" | "updated" | "cancelled" | "completed"
  appointmentId: string
  timestamp: string
  data?: any
}

export interface DiagnosisEvent {
  type: "created" | "updated" | "sent"
  diagnosisId: string
  patientId: string
  timestamp: string
  data?: any
}
