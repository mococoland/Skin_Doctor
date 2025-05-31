import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'PatientHistoryDetail'>;

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  firstVisit: string;
  totalVisits: number;
  allergies: string;
  medicalHistory: string;
}

interface VisitRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  notes: string;
  status: 'completed';
}

const PatientHistoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { patientId, patientName } = route.params;

  const patientInfo: PatientInfo = {
    id: patientId,
    name: patientName,
    age: 28,
    gender: '여성',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    firstVisit: '2023-08-15',
    totalVisits: 3,
    allergies: '페니실린, 견과류',
    medicalHistory: '아토피 피부염 (2020년 진단)',
  };

  const visitHistory: VisitRecord[] = [
    {
      id: '1',
      date: '2024-01-20',
      diagnosis: '접촉성 피부염',
      treatment: '스테로이드 연고 처방, 항히스타민제 복용',
      medication: '베타메타손 연고, 세티리진 10mg',
      notes: '증상 호전됨. 2주 후 재진 권장',
      status: 'completed',
    },
    {
      id: '2',
      date: '2023-12-10',
      diagnosis: '아토피 피부염 악화',
      treatment: '보습제 사용법 교육, 면역억제제 처방',
      medication: '타크로리무스 연고, 세라마이드 보습제',
      notes: '스트레스로 인한 악화. 생활습관 개선 필요',
      status: 'completed',
    },
    {
      id: '3',
      date: '2023-08-15',
      diagnosis: '아토피 피부염 초진',
      treatment: '기본 검사, 알레르기 테스트',
      medication: '하이드로코르티손 연고',
      notes: '첫 진료. 환자 교육 실시',
      status: 'completed',
    },
  ];

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
        
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>의사 메모:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
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
          <FlatList
            data={visitHistory}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.newVisitButton}
            onPress={() => navigation.navigate('PatientDetail', {
              patientId,
              appointmentId: `new_${Date.now()}`,
              patientName,
            })}
          >
            <Text style={styles.newVisitButtonText}>새 진료 예약</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>환자에게 메시지 보내기</Text>
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
});

export default PatientHistoryDetailScreen;