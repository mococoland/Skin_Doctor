// 진료 결과 작성 화면
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { medicalService } from '../services/medicalService';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DiagnosisWrite'>;

interface AppointmentInfo {
  id: number;
  patientName: string;
  patientAge: number | null;
  patientGender: string | null;
  symptoms: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
}

const DiagnosisWriteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appointmentId } = route.params;

  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [diagnosisData, setDiagnosisData] = useState({
    diagnosis: '',
    severity: '',
    treatment: '',
    prescription: '', // medication + dosage 통합
    precautions: '',
    nextAppointment: '',
    notes: '',
  });

  // 다음 예정 진료일 관련 상태
  const [nextVisitType, setNextVisitType] = useState<'none' | 'date'>('none'); // 'none': 다시 진료 안함, 'date': 날짜 선택
  const [nextVisitDate, setNextVisitDate] = useState<Date>(new Date());
  const [showDateModal, setShowDateModal] = useState(false);

  // 예약 정보 로드
  useEffect(() => {
    loadAppointmentInfo();
  }, [appointmentId]);

  const loadAppointmentInfo = async () => {
    try {
      setLoading(true);
      const response = await medicalService.getAppointmentDetail(parseInt(appointmentId));
      
      console.log('🔍 예약 정보 전체 응답:', JSON.stringify(response, null, 2));
      
      // 안전한 데이터 처리 - user 객체와 기존 필드에서 모두 시도
      const userObj = response.user;
      
      // 나이 정보 추출 (user 객체 우선, 없으면 기존 필드)
      const patientAge = (userObj?.age && typeof userObj.age === 'number' && userObj.age > 0) ? userObj.age :
                        (response.userAge && typeof response.userAge === 'number' && response.userAge > 0) ? response.userAge : null;
      
      // 성별 정보 추출 (user 객체 우선, 없으면 기존 필드)
      const userGender = userObj?.gender || response.userGender;
      const patientGender = userGender === 'male' ? '남성' : 
                           userGender === 'female' ? '여성' : null;
      
      // 이름 정보 추출 (user 객체 우선, 없으면 기존 필드)
      const userName = userObj?.username || response.userName;
      const patientName = userName && userName.trim() !== '' ? userName : '환자';
      
      setAppointmentInfo({
        id: response.id,
        patientName: patientName,
        patientAge: patientAge,
        patientGender: patientGender,
        symptoms: response.symptoms || '',
        appointmentDate: response.date,
        appointmentTime: response.time,
        consultationType: response.consultationType || '일반진료'
      });
      
      console.log('🔍 최종 설정된 환자 정보:', {
        patientName: patientName,
        patientAge: patientAge,
        patientGender: patientGender,
        userObj: userObj,
        originalUserName: response.userName,
        originalUserAge: response.userAge,
        originalUserGender: response.userGender
      });
      
    } catch (error) {
      console.error('예약 정보 로드 실패:', error);
      Alert.alert('오류', '예약 정보를 불러올 수 없습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appointmentInfo) {
      Alert.alert('오류', '예약 정보가 없습니다.');
      return;
    }
    
    if (!diagnosisData.diagnosis.trim() || !diagnosisData.treatment.trim()) {
      Alert.alert('오류', '진단명과 치료 내용은 필수 입력 항목입니다.');
      return;
    }

    try {
      // 빈 문자열을 null로 변환하는 함수
      const cleanString = (value: string) => {
        const trimmed = value.trim();
        return trimmed === '' ? null : trimmed;
      };

      // 중증도 한글 → 영어 변환
      const severityMapping: { [key: string]: string } = {
        '경증': 'mild',
        '중등도': 'moderate',
        '중증': 'severe'
      };

      // 다음 예정 진료일 처리
      let nextVisitDateStr = null;
      if (nextVisitType === 'date') {
        nextVisitDateStr = nextVisitDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      }

      const medicalRecordData = {
        appointment_id: parseInt(appointmentId),
        diagnosis: cleanString(diagnosisData.diagnosis),
        severity: diagnosisData.severity ? severityMapping[diagnosisData.severity] || 'mild' : null,
        treatment: cleanString(diagnosisData.treatment),
        prescription: cleanString(diagnosisData.prescription),
        precautions: cleanString(diagnosisData.precautions),
        next_visit_date: nextVisitDateStr,
        notes: cleanString(diagnosisData.notes),
      };

      console.log('🔍 전송할 진료 기록 데이터 (변환 후):', medicalRecordData);
      
      // 필수 필드 재검증
      if (!medicalRecordData.diagnosis || !medicalRecordData.treatment) {
        Alert.alert('오류', '진단명과 치료 내용을 입력해주세요.');
        return;
      }

      await medicalService.createMedicalRecord(medicalRecordData);
      
      Alert.alert(
        '저장 완료',
        '진료 결과가 저장되었습니다.',
        [
          { 
            text: '확인', 
            onPress: () => {
              // AppointmentList completed 탭으로 이동
              navigation.navigate('AppointmentList', { 
                initialTab: 'completed'
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('진료 결과 저장 실패:', error);
      Alert.alert('오류', '진료 결과 저장에 실패했습니다.');
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleDateSelect = (days: number) => {
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + days);
    setNextVisitDate(selectedDate);
    setShowDateModal(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>예약 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointmentInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>예약 정보를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>진료 결과 작성</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 환자 정보 표시 (선택 불가) */}
        <View style={styles.patientInfo}>
          <View style={styles.patientInfoContent}>
            <Text style={styles.patientName}>
              환자: {appointmentInfo.patientName}
            </Text>
            <Text style={styles.appointmentInfo}>
              {appointmentInfo.patientAge ? `${appointmentInfo.patientAge}세` : '나이 정보 없음'}, {appointmentInfo.patientGender || '성별 정보 없음'} | {appointmentInfo.appointmentDate} {appointmentInfo.appointmentTime}
            </Text>
            <Text style={styles.consultationType}>
              진료 유형: {appointmentInfo.consultationType}
            </Text>
          </View>
        </View>

        {/* 진단 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진단 정보</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>진단명 *</Text>
            <TextInput
              style={styles.input}
              value={diagnosisData.diagnosis}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, diagnosis: text})}
              placeholder="예: 접촉성 피부염"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>중증도</Text>
            <View style={styles.severityContainer}>
              {['경증', '중등도', '중증'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    diagnosisData.severity === level && styles.severityButtonActive
                  ]}
                  onPress={() => setDiagnosisData({...diagnosisData, severity: level})}
                >
                  <Text style={[
                    styles.severityButtonText,
                    diagnosisData.severity === level && styles.severityButtonTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 치료 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>치료 내용</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>실시한 치료 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.treatment}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, treatment: text})}
              placeholder="실시한 치료 내용을 상세히 기록해주세요"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* 처방 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>처방 정보</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>처방 약물</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.prescription}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, prescription: text})}
              placeholder="처방한 약물명을 기록해주세요"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* 주의사항 및 관리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주의사항 및 관리</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>주의사항</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.precautions}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, precautions: text})}
              placeholder="환자가 주의해야 할 사항들을 기록해주세요"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* 다음 예정 진료일 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다음 예정 진료일</Text>
          
          <View style={styles.nextVisitContainer}>
            <TouchableOpacity
              style={[
                styles.nextVisitOption,
                nextVisitType === 'none' && styles.nextVisitOptionActive
              ]}
              onPress={() => setNextVisitType('none')}
            >
              <Text style={[
                styles.nextVisitOptionText,
                nextVisitType === 'none' && styles.nextVisitOptionTextActive
              ]}>
                다시 진료 안함 (완치)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.nextVisitOption,
                nextVisitType === 'date' && styles.nextVisitOptionActive
              ]}
              onPress={() => setNextVisitType('date')}
            >
              <Text style={[
                styles.nextVisitOptionText,
                nextVisitType === 'date' && styles.nextVisitOptionTextActive
              ]}>
                날짜 선택
              </Text>
            </TouchableOpacity>
          </View>

          {nextVisitType === 'date' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>다음 진료 예정일</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={styles.datePickerButtonText}>
                  📅 {formatDate(nextVisitDate)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 추가 메모 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가 메모</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>의사 메모</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.notes}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, notes: text})}
              placeholder="추가적인 관찰 사항이나 메모를 기록해주세요"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* 날짜 선택 모달 */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>다음 진료 예정일 선택</Text>
            
            <ScrollView style={styles.dateOptions}>
              {[
                { label: '1주일 후', days: 7 },
                { label: '2주일 후', days: 14 },
                { label: '3주일 후', days: 21 },
                { label: '1개월 후', days: 30 },
                { label: '6주일 후', days: 42 },
                { label: '2개월 후', days: 60 },
                { label: '3개월 후', days: 90 },
              ].map((option) => (
                <TouchableOpacity
                  key={option.days}
                  style={styles.dateOption}
                  onPress={() => handleDateSelect(option.days)}
                >
                  <Text style={styles.dateOptionText}>{option.label}</Text>
                  <Text style={styles.dateOptionSubtext}>
                    {formatDate(new Date(Date.now() + option.days * 24 * 60 * 60 * 1000))}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDateModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  saveButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientInfoContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  consultationType: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  severityButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  severityButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  severityButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  nextVisitContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nextVisitOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  nextVisitOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  nextVisitOptionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  nextVisitOptionTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateOptions: {
    maxHeight: 300,
  },
  dateOption: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dateOptionSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#6b7280',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiagnosisWriteScreen;