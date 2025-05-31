// 예약목록(예약관리) 화면
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList, Appointment } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'AppointmentList'>;

const AppointmentListScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'waiting' | 'completed' | 'upcoming'>('all');

  const appointments: Appointment[] = [
    {
      id: '1',
      patientId: 'p001',
      patientName: '김영희',
      age: 28,
      gender: '여성',
      time: '09:00',
      status: 'waiting',
      symptoms: '얼굴에 붉은 반점이 생겼습니다. 가려움증도 있어요.',
      phone: '010-1234-5678',
    },
    {
      id: '2',
      patientId: 'p002',
      patientName: '이철수',
      age: 22,
      gender: '남성',
      time: '10:30',
      status: 'completed',
      symptoms: '여드름이 심해져서 상담받고 싶습니다.',
      phone: '010-2345-6789',
    },
    {
      id: '3',
      patientId: 'p003',
      patientName: '박민정',
      age: 35,
      gender: '여성',
      time: '14:00',
      status: 'upcoming',
      symptoms: '아토피 증상이 악화되었습니다. 약 처방 부탁드립니다.',
      phone: '010-3456-7890',
    },
    {
      id: '4',
      patientId: 'p004',
      patientName: '정수현',
      age: 45,
      gender: '남성',
      time: '15:30',
      status: 'waiting',
      symptoms: '건선 증상이 재발했습니다.',
      phone: '010-4567-8901',
    },
  ];

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'waiting':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'upcoming':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'waiting':
        return '대기 중';
      case 'completed':
        return '완료';
      case 'upcoming':
        return '예정';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'all') return true;
    return appointment.status === selectedTab;
  });

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('PatientDetail', {
        patientId: item.patientId,
        appointmentId: item.id,
        patientName: item.patientName,
      })}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.patientDetails}>
            {item.age}세, {item.gender} | {item.time}
          </Text>
          <Text style={styles.phoneNumber}>{item.phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsLabel}>진료 요청 내용:</Text>
        <Text style={styles.symptomsText}>{item.symptoms}</Text>
      </View>

      <View style={styles.actionButtons}>
        {item.status === 'waiting' && (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('PatientDetail', {
              patientId: item.patientId,
              appointmentId: item.id,
              patientName: item.patientName,
            })}
          >
            <Text style={styles.startButtonText}>진료 시작</Text>
          </TouchableOpacity>
        )}
        {item.status === 'completed' && (
          <TouchableOpacity 
            style={styles.resultButton}
            onPress={() => navigation.navigate('DiagnosisWrite', {
              patientId: item.patientId,
              appointmentId: item.id,
              patientName: item.patientName,
            })}
          >
            <Text style={styles.resultButtonText}>결과 보기</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => navigation.navigate('PatientDetail', {
            patientId: item.patientId,
            appointmentId: item.id,
            patientName: item.patientName,
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
        return '대기 중';
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
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 예약 목록 */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
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
    flex: 1,              // 남은 공간을 모두 차지
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',  // 텍스트 중앙 정렬
},
 
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
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
    color: '#1f2937',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  symptomsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  symptomsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  resultButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resultButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#374151',
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

export default AppointmentListScreen;