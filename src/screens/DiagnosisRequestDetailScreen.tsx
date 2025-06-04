// 진료 요청서 상세 화면
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { medicalService, DiagnosisRequest } from '../services/medicalService';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DiagnosisRequestDetail'>;

const DiagnosisRequestDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { requestId, patientId } = route.params;
  const [request, setRequest] = useState<DiagnosisRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // 임시 의사 ID (실제로는 로그인 상태에서 가져와야 함)
  const TEMP_DOCTOR_ID = 1;

  useEffect(() => {
    loadDiagnosisRequest();
  }, [requestId]);

  const loadDiagnosisRequest = async () => {
    try {
      setLoading(true);
      const data = await medicalService.getDiagnosisRequest(requestId);
      setRequest(data);
    } catch (error) {
      console.error('진료 요청서 로딩 실패:', error);
      Alert.alert('오류', '진료 요청서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (status: string, reviewNotes?: string) => {
    try {
      await medicalService.updateDiagnosisRequestStatus(requestId, {
        status,
        reviewedByDoctorId: TEMP_DOCTOR_ID,
        reviewNotes,
      });
      
      // 상태 업데이트 후 다시 로드
      loadDiagnosisRequest();
      Alert.alert('성공', '진료 요청서 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      Alert.alert('오류', '상태 업데이트에 실패했습니다.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return '#10b981';
      case 'moderate':
        return '#f59e0b';
      case 'severe':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild':
        return '경미';
      case 'moderate':
        return '보통';
      case 'severe':
        return '심각';
      default:
        return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'reviewed':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '검토 대기';
      case 'reviewed':
        return '검토 완료';
      case 'completed':
        return '진료 완료';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.title}>진료 요청서</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B4D8" />
          <Text style={styles.loadingText}>진료 요청서를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.title}>진료 요청서</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>진료 요청서를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDiagnosisRequest}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>진료 요청서</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환자 정보</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이름:</Text>
              <Text style={styles.infoValue}>{request.userName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>나이:</Text>
              <Text style={styles.infoValue}>{request.userAge}세</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>성별:</Text>
              <Text style={styles.infoValue}>{request.userGender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처:</Text>
              <Text style={styles.infoValue}>{request.userPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이메일:</Text>
              <Text style={styles.infoValue}>{request.userEmail}</Text>
            </View>
          </View>
        </View>

        {/* 상태 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청 상태</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
              <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
            </View>
            <Text style={styles.createDate}>작성일: {new Date(request.createdAt).toLocaleDateString('ko-KR')}</Text>
          </View>
        </View>

        {/* 증상 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>증상 정보</Text>
          <View style={styles.symptomContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주요 증상:</Text>
              <Text style={styles.infoValue}>{request.symptoms}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>지속 기간:</Text>
              <Text style={styles.infoValue}>{request.duration}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>심각도:</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(request.severity) }]}>
                <Text style={styles.severityText}>{getSeverityText(request.severity)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 병력 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>병력 정보</Text>
          <View style={styles.historyContainer}>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>과거 치료 이력:</Text>
              <Text style={styles.historyText}>{request.previousTreatment || '없음'}</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>알레르기:</Text>
              <Text style={styles.historyText}>{request.allergies || '없음'}</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>복용 중인 약물:</Text>
              <Text style={styles.historyText}>{request.medications || '없음'}</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>과거 병력:</Text>
              <Text style={styles.historyText}>{request.medicalHistory || '없음'}</Text>
            </View>
          </View>
        </View>

        {/* 추가 메모 */}
        {request.additionalNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>추가 메모</Text>
            <Text style={styles.notesText}>{request.additionalNotes}</Text>
          </View>
        )}

        {/* 의사 검토 정보 */}
        {request.reviewedByDoctorId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>의사 검토</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewLabel}>검토 의사 ID: {request.reviewedByDoctorId}</Text>
              {request.reviewedAt && (
                <Text style={styles.reviewDate}>검토일: {new Date(request.reviewedAt).toLocaleDateString('ko-KR')}</Text>
              )}
              {request.reviewNotes && (
                <Text style={styles.reviewNotes}>{request.reviewNotes}</Text>
              )}
            </View>
          </View>
        )}

        {/* 액션 버튼 */}
        <View style={styles.actionSection}>
          {request.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={styles.reviewButton}
                onPress={() => updateRequestStatus('reviewed', '검토 완료')}
              >
                <Text style={styles.reviewButtonText}>검토 완료</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => updateRequestStatus('completed', '진료 완료')}
              >
                <Text style={styles.completeButtonText}>진료 완료</Text>
              </TouchableOpacity>
            </>
          )}
          {request.status === 'reviewed' && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => updateRequestStatus('completed', '진료 완료')}
            >
              <Text style={styles.completeButtonText}>진료 완료</Text>
            </TouchableOpacity>
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    fontSize: 16,
    color: '#00B4D8',
    fontWeight: '600',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  createDate: {
    fontSize: 14,
    color: '#666',
  },
  symptomContainer: {
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  historyContainer: {
    gap: 16,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  reviewContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#0369a1',
    marginBottom: 8,
  },
  reviewNotes: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  actionSection: {
    margin: 16,
    gap: 12,
  },
  reviewButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiagnosisRequestDetailScreen; 