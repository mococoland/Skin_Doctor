// 진료 결과 작성 화면
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList, Patient } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DiagnosisWrite'>;

const DiagnosisWriteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, appointmentId, patientName } = route.params;

  // 환자 목록 (실제로는 API에서 가져올 데이터)
  const patientList: Patient[] = [
    {
      id: 'p001',
      name: '김영희',
      age: 28,
      gender: '여성',
      phone: '010-1234-5678',
      email: 'kim@example.com',
    },
    {
      id: 'p002',
      name: '이철수',
      age: 22,
      gender: '남성',
      phone: '010-2345-6789',
      email: 'lee@example.com',
    },
    {
      id: 'p003',
      name: '박민정',
      age: 35,
      gender: '여성',
      phone: '010-3456-7890',
      email: 'park@example.com',
    },
    {
      id: 'p004',
      name: '정수현',
      age: 45,
      gender: '남성',
      phone: '010-4567-8901',
      email: 'jung@example.com',
    },
    {
      id: 'p005',
      name: '최미영',
      age: 31,
      gender: '여성',
      phone: '010-5678-9012',
      email: 'choi@example.com',
    },
  ];

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patientName === '새 환자' ? null : {
      id: patientId,
      name: patientName,
      age: 0,
      gender: '',
      phone: '',
      email: '',
    }
  );
  const [showPatientModal, setShowPatientModal] = useState(false);

  const [diagnosisData, setDiagnosisData] = useState({
    diagnosis: '',
    severity: '',
    treatment: '',
    medication: '',
    dosage: '',
    precautions: '',
    followUp: '',
    nextAppointment: '',
    notes: '',
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(false);
  };

  const handleSave = () => {
    if (!selectedPatient) {
      Alert.alert('오류', '환자를 선택해주세요.');
      return;
    }
    
    if (!diagnosisData.diagnosis || !diagnosisData.treatment) {
      Alert.alert('오류', '진단명과 치료 내용은 필수 입력 항목입니다.');
      return;
    }

    // 진료 결과 저장 로직
    console.log('진료 결과 저장:', { patient: selectedPatient, diagnosis: diagnosisData });
    Alert.alert(
      '저장 완료',
      '진료 결과가 저장되었습니다.',
      [
        { text: '확인', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleSendToPatient = () => {
    if (!selectedPatient) {
      Alert.alert('오류', '환자를 선택해주세요.');
      return;
    }
    
    if (!diagnosisData.diagnosis || !diagnosisData.treatment) {
      Alert.alert('오류', '진단명과 치료 내용은 필수 입력 항목입니다.');
      return;
    }

    Alert.alert(
      '환자에게 전송',
      `${selectedPatient.name} 환자에게 진료 결과를 전송하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전송',
          onPress: () => {
            // 환자에게 전송 로직
            console.log('환자에게 전송:', { patient: selectedPatient, diagnosis: diagnosisData });
            Alert.alert(
              '전송 완료',
              '진료 결과가 환자에게 전송되었습니다.',
              [
                { 
                  text: '확인', 
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'DashboardScreen' }],
                    });
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => handlePatientSelect(item)}
    >
      <View style={styles.patientItemInfo}>
        <Text style={styles.patientItemName}>{item.name}</Text>
        <Text style={styles.patientItemDetails}>
          {item.age}세, {item.gender} | {item.phone}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>       진료 결과 작성</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 환자 선택 영역 */}
        <TouchableOpacity 
          style={styles.patientInfo}
          onPress={() => setShowPatientModal(true)}
        >
          <View style={styles.patientInfoContent}>
            <Text style={styles.patientName}>
              환자: {selectedPatient ? selectedPatient.name : '환자를 선택하세요'}
            </Text>
            {selectedPatient && (
              <Text style={styles.appointmentInfo}>
                {selectedPatient.age}세, {selectedPatient.gender} | {selectedPatient.phone}
              </Text>
            )}
            {!selectedPatient && (
              <Text style={styles.selectPatientHint}>탭하여 환자를 선택하세요</Text>
            )}
          </View>
          <Text style={styles.selectArrow}>›</Text>
        </TouchableOpacity>

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
              value={diagnosisData.medication}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, medication: text})}
              placeholder="처방한 약물명을 기록해주세요"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>용법 및 용량</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.dosage}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, dosage: text})}
              placeholder="복용 방법과 용량을 기록해주세요"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>추후 관리</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosisData.followUp}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, followUp: text})}
              placeholder="재진 일정, 추가 검사 필요성 등을 기록해주세요"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>다음 예약 권장일</Text>
            <TextInput
              style={styles.input}
              value={diagnosisData.nextAppointment}
              onChangeText={(text) => setDiagnosisData({...diagnosisData, nextAppointment: text})}
              placeholder="예: 2주 후"
            />
          </View>
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

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendToPatient}>
            <Text style={styles.sendButtonText}>환자에게 전송</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.draftButton} onPress={handleSave}>
            <Text style={styles.draftButtonText}>임시 저장</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 환자 선택 모달 */}
      <Modal
        visible={showPatientModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPatientModal(false)}>
              <Text style={styles.modalCancelButton}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>환자 선택</Text>
            <View style={styles.modalPlaceholder} />
          </View>
          
          <FlatList
            data={patientList}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.patientList}
          />
        </SafeAreaView>
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
  backButton: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
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
  selectPatientHint: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  selectArrow: {
    fontSize: 20,
    color: '#9ca3af',
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
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  draftButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  draftButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  // 모달 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#2563eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalPlaceholder: {
    width: 40,
  },
  patientList: {
    padding: 16,
  },
  patientItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientItemInfo: {
    flex: 1,
  },
  patientItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  patientItemDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default DiagnosisWriteScreen;