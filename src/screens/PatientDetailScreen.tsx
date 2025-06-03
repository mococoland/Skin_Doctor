// 환자 상세정보 화면
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
  Modal,
  TextInput,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { diagnosisApi, appointmentApi, medicalRecordApi, notificationApi } from '../services/medicalService';

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
  diagnosisRequestId?: number;
  status?: string;
}

interface AppointmentData {
  id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  hasMedicalRecord?: boolean;
  medicalRecordId?: number;
}

const PatientDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, appointmentId, patientName, diagnosisRequestId } = route.params;
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchPatientDetail();
    fetchAppointmentDetail();
    
    // 예약 알림 읽음 처리
    if (appointmentId) {
      markAppointmentNotificationRead();
    }
  }, []);

  const fetchAppointmentDetail = async () => {
    try {
      console.log('📅 예약 정보 조회:', appointmentId);
      const response = await appointmentApi.getAppointmentDetail(parseInt(appointmentId));
      
      // 진료 기록 존재 여부 확인
      const hasMedicalRecord = await medicalRecordApi.checkMedicalRecordExists(parseInt(appointmentId));
      
      setAppointmentData({
        id: response.id,
        status: response.status,
        hasMedicalRecord,
        medicalRecordId: response.medicalRecordId,
      });
      
      console.log('✅ 예약 정보 조회 성공:', response.status, '진료기록:', hasMedicalRecord);
    } catch (error) {
      console.error('❌ 예약 정보 조회 실패:', error);
    }
  };

  const fetchPatientDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // diagnosisRequestId가 있으면 해당 진료 요청서 기반으로 정보 조회
      if (diagnosisRequestId) {
        console.log('📋 진료 요청서 기반 환자 정보 조회:', diagnosisRequestId);
        const response = await diagnosisApi.getPatientDetail(diagnosisRequestId);
        
        if (response.success) {
          setPatientData(response.data);
          console.log('✅ 환자 정보 조회 성공:', response.data.name);
        } else {
          throw new Error('환자 정보를 가져올 수 없습니다');
        }
      } else {
        // diagnosisRequestId가 없으면 기본 더미 데이터 사용 (이전 방식)
        console.log('⚠️ diagnosisRequestId가 없어서 기본 데이터 사용');
        setPatientData({
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
        });
      }
    } catch (err) {
      console.error('❌ 환자 정보 조회 실패:', err);
      setError(err instanceof Error ? err.message : '환자 정보를 가져오는데 실패했습니다');
      
      // 에러 발생 시에도 기본 정보는 표시
      setPatientData({
        id: patientId,
        name: patientName,
        age: 0,
        gender: '정보 없음',
        phone: '정보 없음',
        email: '정보 없음',
        address: '정보 없음',
        emergencyContact: '정보 없음',
        allergies: '정보 없음',
        currentMedications: '정보 없음',
        medicalHistory: '정보 없음',
        symptoms: '정보 없음',
        symptomDuration: '정보 없음',
        painLevel: '정보 없음',
        previousTreatment: '정보 없음',
        requestDate: new Date().toISOString().split('T')[0],
        appointmentTime: '정보 없음',
        images: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const markAppointmentNotificationRead = async () => {
    try {
      const response = await notificationApi.markAppointmentNotificationRead(parseInt(appointmentId));
      if (response.readCount > 0) {
        console.log(`✅ 예약 ${appointmentId}의 알림 ${response.readCount}개 읽음 처리 완료`);
      }
    } catch (error) {
      console.error('❌ 알림 읽음 처리 실패:', error);
      // 에러가 발생해도 화면 표시에는 영향을 주지 않음
    }
  };

  // 예약 확정
  const handleConfirmAppointment = async () => {
    try {
      await appointmentApi.confirmAppointment(parseInt(appointmentId));
      Alert.alert('성공', '예약이 확정되었습니다.');
      fetchAppointmentDetail(); // 상태 새로고침
    } catch (error) {
      console.error('예약 확정 실패:', error);
      Alert.alert('오류', '예약 확정에 실패했습니다.');
    }
  };

  // 진료 완료
  const handleCompleteAppointment = async () => {
    try {
      await appointmentApi.completeAppointment(parseInt(appointmentId));
      Alert.alert('성공', '진료가 완료되었습니다.');
      fetchAppointmentDetail(); // 상태 새로고침
    } catch (error) {
      console.error('진료 완료 실패:', error);
      Alert.alert('오류', '진료 완료에 실패했습니다.');
    }
  };

  // 예약 취소
  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('알림', '취소 사유를 입력해주세요.');
      return;
    }

    try {
      await appointmentApi.cancelAppointmentWithReason(
        parseInt(appointmentId), 
        cancelReason,
        'doctor'  // 의사가 취소하는 경우
      );
      Alert.alert('성공', '예약이 취소되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
      setCancelModalVisible(false);
      setCancelReason('');
    } catch (error) {
      console.error('예약 취소 실패:', error);
      Alert.alert('오류', '예약 취소에 실패했습니다.');
    }
  };

  const handleRetry = () => {
    fetchPatientDetail();
  };

  // 액션 버튼 렌더링
  const renderActionButtons = () => {
    if (!appointmentData) {
      return (
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('DiagnosisWrite', {
            patientId,
            appointmentId,
            patientName: patientData?.name || patientName,
            diagnosisRequestId: patientData?.diagnosisRequestId,
          })}
        >
          <Text style={styles.primaryButtonText}>진료 결과 작성</Text>
        </TouchableOpacity>
      );
    }

    switch (appointmentData.status) {
      case 'pending':
        return (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setCancelModalVisible(true)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirmAppointment}
            >
              <Text style={styles.confirmButtonText}>예약 확정</Text>
            </TouchableOpacity>
          </View>
        );

      case 'confirmed':
        return (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setCancelModalVisible(true)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleCompleteAppointment}
            >
              <Text style={styles.completeButtonText}>진료 완료</Text>
            </TouchableOpacity>
          </View>
        );

      case 'completed':
        return (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('DiagnosisWrite', {
              patientId,
              appointmentId,
              patientName: patientData?.name || patientName,
              diagnosisRequestId: patientData?.diagnosisRequestId,
            })}
          >
            <Text style={styles.primaryButtonText}>
              {appointmentData.hasMedicalRecord ? '진료 기록 확인' : '진료 기록 작성'}
            </Text>
          </TouchableOpacity>
        );

      case 'cancelled':
        return (
          <View style={styles.infoMessage}>
            <Text style={styles.infoMessageText}>이 예약은 취소되었습니다.</Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.title}>예약 상세 정보</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>환자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !patientData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.title}>예약 상세 정보</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!patientData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>예약 상세 정보</Text>
        <View style={styles.placeholder} />
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ 일부 정보를 불러올 수 없습니다</Text>
        </View>
      )}

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
              <Text style={styles.infoValue}>
                {patientData.age > 0 ? `${patientData.age}세` : '정보 없음'}, {patientData.gender}
              </Text>
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
            {patientData.images && patientData.images.length > 0 ? (
              patientData.images.map((image, index) => (
                <View key={index} style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>환자가 업로드한 이미지 {index + 1}</Text>
                </View>
              ))
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>첨부된 이미지가 없습니다</Text>
              </View>
            )}
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          {renderActionButtons()}
        </View>
      </ScrollView>

      {/* 취소 모달 */}
      <Modal
        visible={cancelModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>예약 취소 사유</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="취소 사유를 입력해주세요"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleCancelAppointment}
              >
                <Text style={styles.modalConfirmText}>예약 취소</Text>
              </TouchableOpacity>
            </View>
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
  backButton: {
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',  // 텍스트 중앙 정렬
    flex: 1, 
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#dc2626',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#22c55e',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoMessage: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoMessageText: {
    color: '#dc2626',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  reasonInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PatientDetailScreen;