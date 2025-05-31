// 환자 내역 화면
import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation'; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

type Props = NativeStackScreenProps<DoctorStackParamList, 'PatientHistory'>;

interface PatientHistoryItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  lastVisit: string;
  diagnosis: string;
  totalVisits: number;
  phone: string;
  status: 'ongoing' | 'completed';
}

const PatientHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const patientHistory: PatientHistoryItem[] = [
    {
      id: '1',
      patientId: 'p001',
      patientName: '김영희',
      age: 28,
      gender: '여성',
      lastVisit: '2024-01-20',
      diagnosis: '접촉성 피부염',
      totalVisits: 3,
      phone: '010-1234-5678',
      status: 'completed',
    },
    {
      id: '2',
      patientId: 'p002',
      patientName: '이철수',
      age: 22,
      gender: '남성',
      lastVisit: '2024-01-18',
      diagnosis: '여드름',
      totalVisits: 5,
      phone: '010-2345-6789',
      status: 'ongoing',
    },
    {
      id: '3',
      patientId: 'p003',
      patientName: '박민정',
      age: 35,
      gender: '여성',
      lastVisit: '2024-01-15',
      diagnosis: '아토피 피부염',
      totalVisits: 8,
      phone: '010-3456-7890',
      status: 'completed',
    },
    {
      id: '4',
      patientId: 'p004',
      patientName: '정수현',
      age: 45,
      gender: '남성',
      lastVisit: '2024-01-10',
      diagnosis: '건선',
      totalVisits: 12,
      phone: '010-4567-8901',
      status: 'ongoing',
    },
    {
      id: '5',
      patientId: 'p005',
      patientName: '최미영',
      age: 31,
      gender: '여성',
      lastVisit: '2024-01-08',
      diagnosis: '지루성 피부염',
      totalVisits: 2,
      phone: '010-5678-9012',
      status: 'completed',
    },
  ];

  const filteredPatients = patientHistory.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: 'ongoing' | 'completed') => {
    switch (status) {
      case 'ongoing':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: 'ongoing' | 'completed') => {
    switch (status) {
      case 'ongoing':
        return '치료 중';
      case 'completed':
        return '치료 완료';
      default:
        return status;
    }
  };

  const renderPatientItem = ({ item }: { item: PatientHistoryItem }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientHistoryDetail', {
        patientId: item.patientId,
        patientName: item.patientName,
      })}
    >
      <View style={styles.patientHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.patientDetails}>
            {item.age}세, {item.gender} | {item.phone}
          </Text>
        </View>
        <View style={styles.visitBadge}>
          <Text style={styles.visitText}>총 {item.totalVisits}회</Text>
        </View>
      </View>

      <View style={styles.patientBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>최근 진료:</Text>
          <Text style={styles.infoValue}>{item.lastVisit}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>최근 진단:</Text>
          <Text style={styles.infoValue}>{item.diagnosis}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>치료 상태:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => navigation.navigate('PatientHistoryDetail', {
            patientId: item.patientId,
            patientName: item.patientName,
          })}
        >
          <Text style={styles.detailButtonText}>상세 기록</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.newVisitButton}
          onPress={() => navigation.navigate('PatientDetail', {
            patientId: item.patientId,
            appointmentId: `new_${Date.now()}`,
            patientName: item.patientName,
          })}
        >
          <Text style={styles.newVisitButtonText}>진료 요청서</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity >
          <Text style={styles.backButton}></Text>
        </TouchableOpacity>
        <Text style={styles.title}>      환자 내역</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="환자명 또는 진단명으로 검색..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* 통계 정보 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{patientHistory.length}</Text>
          <Text style={styles.statLabel}>총 환자</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {patientHistory.filter(p => p.status === 'ongoing').length}
          </Text>
          <Text style={styles.statLabel}>치료 중</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {patientHistory.filter(p => p.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>치료 완료</Text>
        </View>
      </View>

      {/* 환자 목록 */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        }
      />
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
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: 10, // 터치 영역 확보
},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  patientCard: {
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
  patientHeader: {
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
    color: '#1f2937',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  visitBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
  patientBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  newVisitButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  newVisitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default PatientHistoryScreen;