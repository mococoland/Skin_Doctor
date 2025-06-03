// 진료 기록 조회 화면
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { medicalRecordApi } from '../services/medicalService';
import { medicalService } from '../services/medicalService';

type Props = NativeStackScreenProps<DoctorStackParamList, 'MedicalRecordView'>;

interface MedicalRecordInfo {
  id: number;
  appointment_id: number;
  diagnosis: string;
  severity: string;
  treatment: string;
  prescription: string;
  precautions: string;
  next_visit_date: string;
  notes: string;
  created_at: string;
  // 예약 정보도 포함
  patientName: string;
  patientAge: number;
  patientGender: string;
  symptoms: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
}

const MedicalRecordViewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appointmentId, patientName } = route.params;

  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalRecord();
  }, [appointmentId]);

  const loadMedicalRecord = async () => {
    try {
      setLoading(true);
      // 1. 진료 기록 조회
      const recordResponse = await medicalRecordApi.getMedicalRecordByAppointment(parseInt(appointmentId));
      
      if (recordResponse.exists && recordResponse.data) {
        // 2. 예약 정보도 함께 조회하여 환자 정보 가져오기
        try {
          const appointmentResponse = await medicalService.getAppointmentDetail(parseInt(appointmentId));
          
          console.log('🔍 MedicalRecordView - 예약 정보 응답:', JSON.stringify(appointmentResponse, null, 2));
          console.log('🔍 MedicalRecordView - 진료 기록 데이터:', JSON.stringify(recordResponse.data, null, 2));
          
          // DiagnosisWriteScreen과 동일한 환자 정보 처리 로직 적용
          const userObj = appointmentResponse.user;
          
          // 나이 정보 추출 (user 객체 우선, 없으면 기존 필드)
          const patientAge = (userObj?.age && typeof userObj.age === 'number' && userObj.age > 0) ? userObj.age :
                            (appointmentResponse.userAge && typeof appointmentResponse.userAge === 'number' && appointmentResponse.userAge > 0) ? appointmentResponse.userAge : null;
          
          // 성별 정보 추출 (user 객체 우선, 없으면 기존 필드)
          const userGender = userObj?.gender || appointmentResponse.userGender;
          const patientGender = userGender === 'male' ? '남성' : 
                               userGender === 'female' ? '여성' : '성별 정보 없음';
          
          // 이름 정보 추출 (user 객체 우선, 없으면 기존 필드)
          const userName = userObj?.username || appointmentResponse.userName;
          const finalPatientName = userName && userName.trim() !== '' ? userName : (patientName || '환자');
          
          // 중증도 확인 로그 추가
          console.log('🔍 MedicalRecordView - 중증도 원본:', recordResponse.data.severity);
          console.log('🔍 MedicalRecordView - 진료 유형 원본:', appointmentResponse.consultationType);
          
          console.log('🔍 MedicalRecordView - 최종 환자 정보:', {
            finalPatientName,
            patientAge,
            patientGender,
            userObj,
            originalUserName: appointmentResponse.userName,
            originalUserAge: appointmentResponse.userAge,
            originalUserGender: appointmentResponse.userGender
          });
          
          setMedicalRecord({
            id: recordResponse.data.id,
            appointment_id: recordResponse.data.appointment_id,
            diagnosis: recordResponse.data.diagnosis || "진단 정보 없음",
            severity: recordResponse.data.severity || "정보 없음",
            treatment: recordResponse.data.treatment || "치료 정보 없음",
            prescription: recordResponse.data.prescription || "",
            precautions: recordResponse.data.precautions || "",
            next_visit_date: recordResponse.data.next_visit_date || "",
            notes: recordResponse.data.notes || "",
            created_at: recordResponse.data.createdAt || new Date().toISOString(),
            // 수정된 환자 정보 사용
            patientName: finalPatientName,
            patientAge: patientAge || 0,
            patientGender: patientGender,
            symptoms: appointmentResponse.symptoms || "증상 정보 없음",
            appointmentDate: appointmentResponse.date || "날짜 정보 없음",
            appointmentTime: appointmentResponse.time || "시간 정보 없음",
            consultationType: appointmentResponse.consultationType || "일반진료"
          });
        } catch (appointmentError) {
          console.warn('예약 정보 조회 실패, 기본값 사용:', appointmentError);
          // 예약 정보 조회 실패 시 진료 기록만 표시
          setMedicalRecord({
            id: recordResponse.data.id,
            appointment_id: recordResponse.data.appointment_id,
            diagnosis: recordResponse.data.diagnosis || "진단 정보 없음",
            severity: recordResponse.data.severity || "정보 없음",
            treatment: recordResponse.data.treatment || "치료 정보 없음",
            prescription: recordResponse.data.prescription || "",
            precautions: recordResponse.data.precautions || "",
            next_visit_date: recordResponse.data.next_visit_date || "",
            notes: recordResponse.data.notes || "",
            created_at: recordResponse.data.createdAt || new Date().toISOString(),
            patientName: patientName || "환자",
            patientAge: 0,
            patientGender: "정보 없음",
            symptoms: "증상 정보 없음",
            appointmentDate: "날짜 정보 없음",
            appointmentTime: "시간 정보 없음",
            consultationType: "진료 유형 정보 없음"
          });
        }
      } else {
        // 진료 기록이 없는 경우
        Alert.alert('알림', '해당 예약에 대한 진료 기록이 없습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('진료 기록 로드 실패:', error);
      Alert.alert('오류', '진료 기록을 불러올 수 없습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '경증':
      case 'mild':
        return '#10b981';
      case '중등도':
      case 'moderate':
        return '#f59e0b';
      case '중증':
      case 'severe':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // 중증도 영어 → 한글 변환 함수 추가
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild':
        return '경증';
      case 'moderate':
        return '중등도';
      case 'severe':
        return '중증';
      default:
        return severity || '정보 없음';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B4D8" />
          <Text style={styles.loadingText}>진료 기록을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!medicalRecord) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>진료 기록을 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>진료 기록 조회</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 환자 정보 */}
        <View style={styles.patientInfo}>
          <View style={styles.patientInfoContent}>
            <Text style={styles.patientName}>
              환자: {medicalRecord.patientName}
            </Text>
            <Text style={styles.appointmentInfo}>
              {medicalRecord.patientAge > 0 ? `${medicalRecord.patientAge}세` : '나이 정보 없음'}, {medicalRecord.patientGender}
            </Text>
            <Text style={styles.consultationType}>
              진료 유형: {medicalRecord.consultationType}
            </Text>
          </View>
        </View>

        {/* 진료 일시 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진료 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>진료 일시:</Text>
            <Text style={styles.infoValue}>
              {new Date(medicalRecord.created_at).toLocaleString('ko-KR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>주요 증상:</Text>
            <Text style={styles.infoValue}>{medicalRecord.symptoms}</Text>
          </View>
        </View>

        {/* 진단 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진단 정보</Text>
          
          <View style={styles.diagnosisContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>진단명:</Text>
              <Text style={styles.diagnosisText}>{medicalRecord.diagnosis}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>중증도:</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(medicalRecord.severity) }]}>
                <Text style={styles.severityText}>{getSeverityText(medicalRecord.severity)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 치료 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>치료 내용</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{medicalRecord.treatment}</Text>
          </View>
        </View>

        {/* 처방전 */}
        {medicalRecord.prescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>처방전</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{medicalRecord.prescription}</Text>
            </View>
          </View>
        )}

        {/* 주의사항 */}
        {medicalRecord.precautions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>주의사항 및 관리</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{medicalRecord.precautions}</Text>
            </View>
          </View>
        )}

        {/* 다음 방문일 */}
        {medicalRecord.next_visit_date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>다음 방문 예정일</Text>
            <View style={styles.infoRow}>
              <Text style={styles.nextVisitText}>
                📅 {new Date(medicalRecord.next_visit_date).toLocaleDateString('ko-KR')}
              </Text>
            </View>
          </View>
        )}

        {/* 의사 메모 */}
        {medicalRecord.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>의사 메모</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{medicalRecord.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
  },
  patientInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientInfoContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appointmentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  consultationType: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  diagnosisContainer: {
    gap: 8,
  },
  diagnosisText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  nextVisitText: {
    fontSize: 16,
    color: '#00B4D8',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedicalRecordViewScreen; 