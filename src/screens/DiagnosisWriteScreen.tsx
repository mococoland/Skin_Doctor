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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DiagnosisWrite'>;

const DiagnosisWriteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, appointmentId, patientName } = route.params;

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

  const handleSave = () => {
    if (!diagnosisData.diagnosis || !diagnosisData.treatment) {
      Alert.alert('오류', '진단명과 치료 내용은 필수 입력 항목입니다.');
      return;
    }

    // 진료 결과 저장 로직
    console.log('진료 결과 저장:', diagnosisData);
    Alert.alert(
      '저장 완료',
      '진료 결과가 저장되었습니다.',
      [
        { text: '확인', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleSendToPatient = () => {
    if (!diagnosisData.diagnosis || !diagnosisData.treatment) {
      Alert.alert('오류', '진단명과 치료 내용은 필수 입력 항목입니다.');
      return;
    }

    Alert.alert(
      '환자에게 전송',
      '진료 결과를 환자에게 전송하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전송',
          onPress: () => {
            // 환자에게 전송 로직
            console.log('환자에게 전송:', diagnosisData);
            Alert.alert(
              '전송 완료',
              '진료 결과가 환자에게 전송되었습니다.',
              [
                { text: '확인', onPress: () => navigation.navigate('HomeScreen') }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>       진료 결과 작성</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>환자: {patientName}</Text>
          <Text style={styles.appointmentInfo}>예약 ID: {appointmentId}</Text>
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
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,              // 남은 공간을 모두 차지
    textAlign: 'center',  // 텍스트 중앙 정렬
   
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
});

export default DiagnosisWriteScreen;