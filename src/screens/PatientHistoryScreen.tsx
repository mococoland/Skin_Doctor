// 환자 내역 화면
import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { patientApi, type PatientHistoryItem } from '../services/medicalService';

type Props = NativeStackScreenProps<DoctorStackParamList, 'PatientHistory'>;

const TEMP_DOCTOR_ID = 1; // 임시 의사 ID

const PatientHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patientHistory, setPatientHistory] = useState<PatientHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPatientHistory();
  }, []);

  const loadPatientHistory = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getDoctorPatients(TEMP_DOCTOR_ID);
      setPatientHistory(data);
      console.log('✅ 환자 목록 로드 성공:', data.length + '명');
    } catch (error) {
      console.error('❌ 환자 목록 로드 실패:', error);
      Alert.alert('오류', '환자 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadPatientHistory();
    } catch (error) {
      console.error('❌ 새로고침 실패:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
            {item.age > 0 ? `${item.age}세` : '나이 정보 없음'}, {item.gender} | {item.phone}
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
          style={[
            styles.requestButton,
            !item.hasDiagnosisRequest && styles.requestButtonDisabled
          ]}
          onPress={() => {
            if (item.hasDiagnosisRequest && item.diagnosisRequestId) {
              navigation.navigate('PatientDetail', {
                patientId: item.patientId,
                appointmentId: item.latestAppointmentId.toString(),
                patientName: item.patientName,
                diagnosisRequestId: item.diagnosisRequestId,
              });
            } else {
              Alert.alert('알림', '환자가 진료 요청서를 제출하지 않았습니다.');
            }
          }}
        >
          <Text style={[
            styles.requestButtonText,
            !item.hasDiagnosisRequest && styles.requestButtonTextDisabled
          ]}>
            {item.hasDiagnosisRequest ? '진료 요청서' : '요청서 없음'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity >
            <Text style={styles.backButton}></Text>
          </TouchableOpacity>
          <Text style={styles.title}>      환자 내역</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>환자 목록을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* 환자 목록 */}
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
            </Text>
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
  requestButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  requestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  requestButtonTextDisabled: {
    color: '#6b7280',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});

export default PatientHistoryScreen;