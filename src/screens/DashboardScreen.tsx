// 대시보드 화면
import React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useFocusEffect } from '@react-navigation/native'
import { logout } from "../store/authSlice"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { DoctorStackParamList } from "../types/navigation"
import type { RootState } from "../store/store"
import { appointmentApi, diagnosisApi, doctorApi, notificationApi, type Appointment, type DiagnosisRequest, type DoctorNotification } from "../services/medicalService"

type Props = NativeStackScreenProps<DoctorStackParamList, "DashboardScreen">

const DashboardScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  
  // 상태 관리
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [diagnosisRequests, setDiagnosisRequests] = useState<DiagnosisRequest[]>([])
  const [notifications, setNotifications] = useState<DoctorNotification[]>([])
  const [stats, setStats] = useState({
    today_appointments: 0,
    pending_appointments: 0,
    completed_appointments: 0,
    total_patients: 0
  })
  const [loading, setLoading] = useState(true)
  const [notificationLoading, setNotificationLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statsData = [
    { title: "오늘 예약", count: `${stats.today_appointments}건`, color: "#2563eb" },
    { title: "대기 중", count: `${stats.pending_appointments}건`, color: "#f59e0b" },
    { title: "완료", count: `${stats.completed_appointments}건`, color: "#10b981" },
    { title: "총 환자", count: `${stats.total_patients}명`, color: "#8b5cf6" },
  ]

  // 데이터 로드 함수
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 의사 ID 고정 (1번)
      const doctorId = 1
      
      // 통계 데이터와 진단 요청 데이터를 병렬로 로드
      const [statsData, diagnosisData] = await Promise.all([
        doctorApi.getDashboardStats(doctorId),
        diagnosisApi.getDiagnosisRequests(doctorId)
      ])
      
      setStats(statsData)
      setDiagnosisRequests(diagnosisData)
    } catch (err) {
      console.error('대시보드 데이터 로드 오류:', err)
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // ⭐ 알림 데이터 로드 함수
  const loadNotifications = async () => {
    try {
      console.log('🔔 알림 데이터 로딩 시작...')
      setNotificationLoading(true)
      const doctorId = 1
      const notificationData = await notificationApi.getDoctorNotifications(doctorId)
      console.log('📝 받은 알림 데이터:', notificationData)
      console.log('📊 알림 데이터 타입:', typeof notificationData)
      console.log('📊 알림 배열 여부:', Array.isArray(notificationData))
      console.log('📊 알림 개수:', notificationData?.length)
      
      // 모든 알림 표시 (slice 제거)
      console.log('✂️ 전체 알림 데이터:', notificationData)
      console.log('✂️ 전체 알림 개수:', notificationData.length)
      
      setNotifications(notificationData) // 모든 알림 표시
      console.log('✅ 알림 상태 업데이트 완료')
    } catch (error) {
      console.error('❌ 알림 데이터 로드 실패:', error)
    } finally {
      setNotificationLoading(false)
      console.log('🏁 알림 로딩 상태 해제 완료')
    }
  }

  // ⭐ 알림 클릭 처리
  const handleNotificationPress = (notification: DoctorNotification) => {
    Alert.alert(
      '알림', 
      `${notification.patientName}님의 취소된 예약으로 이동하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '이동', 
          onPress: () => {
            // 예약 상세 화면으로 이동 (읽음 처리는 PatientDetailScreen에서 자동 처리됨)
            navigation.navigate('PatientDetail', {
              patientId: '',
              appointmentId: notification.appointmentId.toString(),
              patientName: notification.patientName,
              diagnosisRequestId: undefined,
            })
            
            // 로컬 상태 제거 코드 제거 - 화면 포커스 시 자동으로 새로고침됨
          }
        }
      ]
    )
  }

  // 화면이 포커스될 때마다 모든 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 DashboardScreen 포커스됨 - 모든 데이터 새로고침')
      loadDashboardData()
      loadNotifications()
    }, [])
  )

  // 새로고침 함수
  const handleRefresh = () => {
    loadDashboardData()
  }

  const quickActions = [
    {
      title: "예약 관리",
      description: "환자 예약 현황을 확인하고 진료요청서를 검토하세요",
      color: "#2563eb",
      screen: "AppointmentList" as keyof DoctorStackParamList,
    },
    {
      title: "진료 결과 작성",
      description: "진료 완료 후 결과를 작성하여 환자에게 전달하세요",
      color: "#10b981",
      screen: "DiagnosisWrite" as keyof DoctorStackParamList,
    },
    {
      title: "환자 내역",
      description: "진료한 환자들의 기록을 조회하고 관리하세요",
      color: "#8b5cf6",
      screen: "PatientHistory" as keyof DoctorStackParamList,
    },
    {
      title: "프로필",
      description: "개인 정보를 관리하세요",
      color: "#f97316", 
      screen: "DoctorProfile" as keyof DoctorStackParamList,
    },
  ]

  const handleLogout = () => {
    dispatch(logout())
    // 홈스크린으로 이동하도록 변경
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    })
  }

  const handleQuickAction = (screen: keyof DoctorStackParamList) => {
    try {
      // DiagnosisWrite는 특정 예약에서만 접근 가능하므로 AppointmentList의 완료 탭으로 이동
      if (screen === "DiagnosisWrite") {
        navigation.navigate("AppointmentList", { initialTab: 'completed' });
      } else {
        navigation.navigate(screen as any)
      }
    } catch (error) {
      console.error("네비게이션 오류:", error)
      // 오류 발생 시 AppointmentList로 이동
      navigation.navigate("AppointmentList")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>의사 대시보드</Text>
            <Text style={styles.subtitle}>{user?.name || "홍길동"} 의사님, 안녕하세요!</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={[styles.statCount, { color: stat.color }]}>{stat.count}</Text>
            </View>
          ))}
        </View>

        {/* 빠른 작업 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관리 기능</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard} onPress={() => handleQuickAction(action.screen)}>
              <View style={styles.actionContent}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]} />
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 최근 알림 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 알림</Text>
          {notificationLoading ? (
            <View style={styles.notificationCard}>
              <ActivityIndicator size="small" color="#6b7280" />
              <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 8 }}>알림을 불러오는 중...</Text>
            </View>
          ) : notifications.length > 0 ? (
            <ScrollView 
              style={styles.notificationScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.notificationCard}>
                {notifications.map((notification, index) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      {
                        borderBottomWidth: index === notifications.length - 1 ? 0 : 1,
                      },
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>예약이 취소되었습니다</Text>
                      <Text style={styles.notificationDescription}>
                        {notification.patientName} - {notification.formattedTime || notification.appointmentTime}
                      </Text>
                    </View>
                    <Text style={styles.notificationTime}>{notification.cancelledAt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.notificationCard}>
              <Text style={{ textAlign: 'center', color: '#6b7280' }}>새로운 알림이 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  profileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#f97316", // 오렌지 색상
    borderRadius: 8,
    backgroundColor: "#fff7ed", // 연한 오렌지 배경
  },
  profileButtonText: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
  },
  logoutText: {
    color: "#374151",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  statCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
  arrow: {
    fontSize: 20,
    color: "#9ca3af",
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomColor: "#f3f4f6",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  notificationTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  notificationScrollView: {
    maxHeight: 200,
  },
})

export default DashboardScreen
