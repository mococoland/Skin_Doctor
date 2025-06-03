// 예약목록(예약관리) 화면
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { medicalService, Appointment as AppointmentData, medicalRecordApi, appointmentApi } from '../services/medicalService';

type Props = NativeStackScreenProps<DoctorStackParamList, 'AppointmentList'>;

const AppointmentListScreen: React.FC<Props> = ({ navigation, route }) => {
  // route params에서 초기 탭 가져오기 (기본값: 'all')
  const initialTab = route.params?.initialTab || 'all';
  const [selectedTab, setSelectedTab] = useState<'all' | 'waiting' | 'completed' | 'upcoming'>(initialTab);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicalRecordStatus, setMedicalRecordStatus] = useState<Record<number, boolean>>({});

  // 임시 의사 ID (실제로는 로그인 상태에서 가져와야 함)
  const TEMP_DOCTOR_ID = 1;

  useEffect(() => {
    loadAppointments();
  }, []);

  // 화면이 focus될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await medicalService.getAppointments(TEMP_DOCTOR_ID);
      setAppointments(data);

      // completed 상태인 예약들에 대해 진료 기록 존재 여부 확인
      const completedAppointments = data.filter(apt => apt.status === 'completed');
      const recordStatus: Record<number, boolean> = {};
      
      await Promise.all(
        completedAppointments.map(async (appointment) => {
          if (appointment.id) {
            try {
              const hasRecord = await medicalRecordApi.checkMedicalRecordExists(appointment.id);
              recordStatus[appointment.id] = hasRecord;
            } catch (error) {
              console.error(`진료 기록 확인 실패 (예약 ID: ${appointment.id}):`, error);
              recordStatus[appointment.id] = false;
            }
          }
        })
      );

      setMedicalRecordStatus(recordStatus);
    } catch (error) {
      console.error('예약 목록 로딩 실패:', error);
      Alert.alert('오류', '예약 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 예약 확정 처리
  const handleConfirmAppointment = async (appointmentId: number) => {
    try {
      await appointmentApi.confirmAppointment(appointmentId);
      Alert.alert('성공', '예약이 확정되었습니다.');
      loadAppointments(); // 목록 새로고침
    } catch (error) {
      console.error('예약 확정 실패:', error);
      Alert.alert('오류', '예약 확정에 실패했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // 주황색 - 대기 중
      case 'confirmed':
        return '#3b82f6'; // 파란색 - 확정됨  
      case 'completed':
        return '#10b981'; // 초록색 - 완료
      case 'cancelled':
        return '#ef4444'; // 빨간색 - 취소됨
      default:
        return '#6b7280'; // 회색 - 기본
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기 중';
      case 'confirmed':
        return '확정됨';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'waiting') return appointment.status === 'pending';
    if (selectedTab === 'completed') return appointment.status === 'completed';
    if (selectedTab === 'upcoming') return appointment.status === 'confirmed';
    return false;
  });

  const renderAppointmentItem = ({ item }: { item: AppointmentData }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('PatientDetail', {
        patientId: (item.user_id || 0).toString(),
        appointmentId: (item.id || 0).toString(),
        patientName: item.user?.username || '환자',
        diagnosisRequestId: item.diagnosis_request_id,
      })}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.user?.username || `환자 ID: ${item.user_id || 'N/A'}`}</Text>
          <Text style={styles.patientDetails}>
            {item.appointment_date} | {item.appointment_time}
          </Text>
          <Text style={styles.consultationType}>📱 비대면 화상 진료</Text>
          <Text style={styles.consultationFee}>진료비: {item.doctor?.consultation_fee?.toLocaleString() || '0'}원</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsLabel}>진료 요청 내용:</Text>
        <Text style={styles.symptomsText}>{item.symptoms || '증상 정보 없음'}</Text>
      </View>

      {/* 진료 요청서 정보 표시 */}
      {item.diagnosis_request_id && (
        <View style={styles.diagnosisRequestContainer}>
          <Text style={styles.diagnosisRequestLabel}>📋 진료 요청서 첨부됨</Text>
          <TouchableOpacity 
            style={styles.viewRequestButton}
            onPress={() => {
              if (item.diagnosis_request_id && item.user_id) {
                navigation.navigate('DiagnosisRequestDetail', {
                  requestId: item.diagnosis_request_id,
                  patientId: (item.user_id || 0).toString(),
                })
              }
            }}
          >
            <Text style={styles.viewRequestButtonText}>상세 보기</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
              Alert.alert(
                '예약 확정',
                '이 예약을 확정하시겠습니까?',
                [
                  { text: '취소', style: 'cancel' },
                  { 
                    text: '확정', 
                    onPress: () => handleConfirmAppointment(item.id) 
                  }
                ]
              );
            }}
          >
            <Text style={styles.confirmButtonText}>예약 확정</Text>
          </TouchableOpacity>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('PatientDetail', {
              patientId: (item.user_id || 0).toString(),
              appointmentId: (item.id || 0).toString(),
              patientName: item.user?.username || '환자',
              diagnosisRequestId: item.diagnosis_request_id,
            })}
          >
            <Text style={styles.startButtonText}>진료 시작</Text>
          </TouchableOpacity>
        )}
        {item.status === 'completed' && (
          <TouchableOpacity 
            style={styles.resultButton}
            onPress={() => {
              if (medicalRecordStatus[item.id] === true) {
                // 진료 기록이 있는 경우 조회 화면으로
                navigation.navigate('MedicalRecordView', {
                  appointmentId: (item.id || 0).toString(),
                  patientName: item.user?.username || '환자',
                });
              } else {
                // 진료 기록이 없는 경우 작성 화면으로
                navigation.navigate('DiagnosisWrite', {
                  patientId: (item.user_id || 0).toString(),
                  appointmentId: (item.id || 0).toString(),
                  patientName: item.user?.username || '환자',
                  diagnosisRequestId: item.diagnosis_request_id,
                });
              }
            }}
          >
            <Text style={styles.resultButtonText}>
              {medicalRecordStatus[item.id] === true ? '결과 보기' : '결과 작성'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => navigation.navigate('PatientDetail', {
            patientId: (item.user_id || 0).toString(),
            appointmentId: (item.id || 0).toString(),
            patientName: item.user?.username || '환자',
            diagnosisRequestId: item.diagnosis_request_id,
          })}
        >
          <Text style={styles.detailButtonText}>상세 정보</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getTabLabel = (tab: 'waiting' | 'completed' | 'upcoming') => {
    switch (tab) {
      case 'waiting':
        return '대기 중인';
      case 'completed':
        return '완료된';
      case 'upcoming':
        return '예정된';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>예약 관리</Text>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        {[
          { key: 'all' as const, label: '전체' },
          { key: 'waiting' as const, label: '대기 중' },
          { key: 'upcoming' as const, label: '예정' },
          { key: 'completed' as const, label: '완료' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 예약 목록 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B4D8" />
          <Text style={styles.loadingText}>예약 목록을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => (item.id || 0).toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedTab === 'all' ? '예약이 없습니다.' : `${getTabLabel(selectedTab)} 예약이 없습니다.`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#00B4D8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
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
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consultationType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consultationFee: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: '600',
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
  symptomsContainer: {
    marginBottom: 12,
  },
  symptomsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  diagnosisRequestContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diagnosisRequestLabel: {
    fontSize: 14,
    color: '#0369a1',
    fontWeight: '600',
  },
  viewRequestButton: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewRequestButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AppointmentListScreen;