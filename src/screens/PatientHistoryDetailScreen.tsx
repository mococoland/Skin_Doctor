// 환자 상세 기록 화면
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { patientApi, medicalService } from '../services/medicalService';
import { API_CONFIG } from '../config/api';

type Props = NativeStackScreenProps<DoctorStackParamList, 'PatientHistoryDetail'>;

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  firstVisit: string;
  totalVisits: number;
  allergies?: string;
  medicalHistory?: string;
}

interface VisitRecord {
  id: number;
  date: string;
  diagnosis: string;
  treatment: string;
  medication?: string;
  notes?: string;
  precautions?: string;
  status: 'completed';
  appointmentId: number;
}

const TEMP_DOCTOR_ID = 1; // 임시 의사 ID

const PatientHistoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, patientName } = route.params;

  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [visitHistory, setVisitHistory] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      
      // 1. 환자 기본 정보 가져오기 (의사의 환자 목록에서)
      const patients = await patientApi.getDoctorPatients(TEMP_DOCTOR_ID);
      const currentPatient = patients.find(p => p.patientId === patientId);
      
      if (!currentPatient) {
        Alert.alert('오류', '환자 정보를 찾을 수 없습니다.');
        navigation.goBack();
        return;
      }

      // 2. 해당 환자의 모든 예약 기록 가져오기
      const appointments = await medicalService.getAppointments(TEMP_DOCTOR_ID);
      const patientAppointments = appointments.filter(apt => apt.user_id.toString() === patientId);
      
      // 첫 진료일 계산 (가장 오래된 예약)
      const sortedAppointments = patientAppointments.sort((a, b) => 
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
      );
      const firstVisit = sortedAppointments.length > 0 ? sortedAppointments[0].appointment_date : currentPatient.lastVisit;

      // 사용자 이메일 정보 추출 (첫 번째 예약에서)
      const userEmail = patientAppointments.length > 0 && patientAppointments[0].user 
        ? patientAppointments[0].user.email 
        : 'kim@example.com';

      // 환자 기본 정보 설정
      setPatientInfo({
        id: currentPatient.patientId,
        name: currentPatient.patientName,
        age: currentPatient.age,
        gender: currentPatient.gender,
        phone: currentPatient.phone,
        email: userEmail || 'kim@example.com', // 실제 이메일 우선, 없으면 기본값
        firstVisit: firstVisit,
        totalVisits: currentPatient.totalVisits,
        allergies: '정보 없음', // API에서 제공되지 않으므로 기본값
        medicalHistory: '정보 없음', // API에서 제공되지 않으므로 기본값
      });

      // 3. 완료된 예약들의 진료 기록 가져오기
      const completedAppointments = patientAppointments.filter(apt => apt.status === 'completed');
      const visitRecords: VisitRecord[] = [];

      for (const appointment of completedAppointments) {
        try {
          // 각 예약에 대한 진료 기록 조회
          const medicalRecordResponse = await fetch(`${API_CONFIG.BASE_URL}/api/medical/medical-records/appointment/${appointment.id}`);
          const medicalRecordData = await medicalRecordResponse.json();
          
          if (medicalRecordData.exists && medicalRecordData.data) {
            const record = medicalRecordData.data;
            visitRecords.push({
              id: record.id,
              date: appointment.appointment_date,
              diagnosis: record.diagnosis || '진단 정보 없음',
              treatment: record.treatment || '치료 정보 없음',
              medication: record.prescription || '처방 정보 없음',
              notes: record.notes || '메모 없음',
              precautions: record.precautions || '주의사항 없음',
              status: 'completed',
              appointmentId: appointment.id
            });
          } else {
            // 진료 기록이 없는 완료된 예약
            visitRecords.push({
              id: appointment.id,
              date: appointment.appointment_date,
              diagnosis: '진료 기록 없음',
              treatment: '기록되지 않음',
              medication: '처방 정보 없음',
              notes: '진료 기록이 생성되지 않았습니다.',
              precautions: '주의사항 없음',
              status: 'completed',
              appointmentId: appointment.id
            });
          }
        } catch (error) {
          console.error(`예약 ${appointment.id}의 진료 기록 조회 실패:`, error);
        }
      }

      // 날짜순 정렬 (최신 순)
      visitRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setVisitHistory(visitRecords);

      console.log(`✅ 환자 ${patientName} 정보 로드 성공: 총 ${visitRecords.length}개 진료 기록`);
      
    } catch (error) {
      console.error('❌ 환자 데이터 로드 실패:', error);
      Alert.alert('오류', '환자 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderVisitItem = ({ item }: { item: VisitRecord }) => (
    <View style={styles.visitCard}>
      <View style={styles.visitHeader}>
        <Text style={styles.visitDate}>{item.date}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>완료</Text>
        </View>
      </View>
      
      <View style={styles.visitContent}>
        <View style={styles.visitRow}>
          <Text style={styles.visitLabel}>진단:</Text>
          <Text style={styles.visitValue}>{item.diagnosis}</Text>
        </View>
        
        <View style={styles.visitRow}>
          <Text style={styles.visitLabel}>치료:</Text>
          <Text style={styles.visitValue}>{item.treatment}</Text>
        </View>
        
        <View style={styles.visitRow}>
          <Text style={styles.visitLabel}>처방:</Text>
          <Text style={styles.visitValue}>{item.medication}</Text>
        </View>
        
        <View style={styles.visitRow}>
          <Text style={styles.visitLabel}>주의사항:</Text>
          <Text style={styles.visitValue}>{item.precautions}</Text>
        </View>
        
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>의사 메모:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.title}>환자 상세 기록</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>환자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!patientInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.title}>환자 상세 기록</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>환자 정보를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>환자 상세 기록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 환자 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환자 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.patientName}>{patientInfo.name}</Text>
              <Text style={styles.patientAge}>{patientInfo.age}세, {patientInfo.gender}</Text>
            </View>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>연락처</Text>
                <Text style={styles.infoValue}>{patientInfo.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{patientInfo.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>첫 진료</Text>
                <Text style={styles.infoValue}>{patientInfo.firstVisit}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>총 진료 횟수</Text>
                <Text style={styles.infoValue}>{patientInfo.totalVisits}회</Text>
              </View>
            </View>

            <View style={styles.medicalInfo}>
              <View style={styles.medicalItem}>
                <Text style={styles.medicalLabel}>알레르기:</Text>
                <Text style={styles.medicalValue}>{patientInfo.allergies}</Text>
              </View>
              <View style={styles.medicalItem}>
                <Text style={styles.medicalLabel}>과거 병력:</Text>
                <Text style={styles.medicalValue}>{patientInfo.medicalHistory}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 진료 기록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진료 기록</Text>
          {visitHistory.length > 0 ? (
            <FlatList
              data={visitHistory}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 진료 기록이 없습니다.</Text>
            </View>
          )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  backButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  placeholder: {
    width: 60, // backButton과 같은 너비로 중앙 정렬
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
  infoHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  medicalInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  medicalItem: {
    marginBottom: 8,
  },
  medicalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  medicalValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  visitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  visitDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  visitContent: {
    gap: 8,
  },
  visitRow: {
    flexDirection: 'row',
  },
  visitLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 60,
  },
  visitValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  newVisitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newVisitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  messageButtonText: {
    color: '#374151',
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
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default PatientHistoryDetailScreen;