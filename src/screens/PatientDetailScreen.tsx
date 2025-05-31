import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'PatientDetail'>;

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies: string;
  currentMedications: string;
  medicalHistory: string;
  symptoms: string;
  symptomDuration: string;
  painLevel: string;
  previousTreatment: string;
  requestDate: string;
  appointmentTime: string;
  images: string[];
}

const PatientDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, appointmentId, patientName } = route.params;

  const patientData: PatientData = {
    id: patientId,
    name: patientName,
    age: 28,
    gender: '여성',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    address: '서울시 강남구 테헤란로 123',
    emergencyContact: '010-9876-5432 (어머니)',
    allergies: '페니실린, 견과류',
    currentMedications: '없음',
    medicalHistory: '아토피 피부염 (2020년 진단)',
    symptoms: '얼굴에 붉은 반점이 생겼습니다. 가려움증도 있어요. 특히 아침에 일어났을 때 더 심해지는 것 같습니다.',
    symptomDuration: '1주일',
    painLevel: '중간 정도',
    previousTreatment: '시중 연고 사용했으나 효과 없음',
    requestDate: '2024-01-20',
    appointmentTime: '09:00',
    images: [
      'https://example.com/skin1.jpg',
      'https://example.com/skin2.jpg',
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>환자 상세정보</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 환자 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환자 기본 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이름:</Text>
              <Text style={styles.infoValue}>{patientData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>나이/성별:</Text>
              <Text style={styles.infoValue}>{patientData.age}세, {patientData.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처:</Text>
              <Text style={styles.infoValue}>{patientData.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이메일:</Text>
              <Text style={styles.infoValue}>{patientData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주소:</Text>
              <Text style={styles.infoValue}>{patientData.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>응급연락처:</Text>
              <Text style={styles.infoValue}>{patientData.emergencyContact}</Text>
            </View>
          </View>
        </View>

        {/* 의료 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>의료 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>알레르기:</Text>
              <Text style={styles.infoValue}>{patientData.allergies}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>복용 중인 약물:</Text>
              <Text style={styles.infoValue}>{patientData.currentMedications}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>과거 병력:</Text>
              <Text style={styles.infoValue}>{patientData.medicalHistory}</Text>
            </View>
          </View>
        </View>

        {/* 진료 요청 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진료 요청 내용</Text>
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestDate}>요청일: {patientData.requestDate}</Text>
              <Text style={styles.appointmentTime}>예약시간: {patientData.appointmentTime}</Text>
            </View>
            
            <View style={styles.symptomSection}>
              <Text style={styles.symptomLabel}>주요 증상:</Text>
              <Text style={styles.symptomText}>{patientData.symptoms}</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>증상 지속 기간:</Text>
                <Text style={styles.detailValue}>{patientData.symptomDuration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>통증 정도:</Text>
                <Text style={styles.detailValue}>{patientData.painLevel}</Text>
              </View>
            </View>

            <View style={styles.treatmentSection}>
              <Text style={styles.treatmentLabel}>이전 치료 경험:</Text>
              <Text style={styles.treatmentText}>{patientData.previousTreatment}</Text>
            </View>
          </View>
        </View>

        {/* 첨부 이미지 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>첨부 이미지</Text>
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>환자가 업로드한 이미지 1</Text>
            </View>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>환자가 업로드한 이미지 2</Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('DiagnosisWrite', {
              patientId,
              appointmentId,
              patientName,
            })}
          >
            <Text style={styles.primaryButtonText}>진료 결과 작성</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>환자에게 메시지 보내기</Text>
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
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  requestDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  symptomSection: {
    marginBottom: 16,
  },
  symptomLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  treatmentSection: {
    marginTop: 8,
  },
  treatmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imagePlaceholder: {
    flex: 1,
    height: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PatientDetailScreen;