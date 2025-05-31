// 대시보드 화면
import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/authSlice"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { DoctorStackParamList } from "../types/navigation"
import type { RootState } from "../store/store"

type Props = NativeStackScreenProps<DoctorStackParamList, "DashboardScreen">

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const statsData = [
    { title: "오늘 예약", count: "8건", color: "#2563eb" },
    { title: "대기 중", count: "3건", color: "#f59e0b" },
    { title: "완료", count: "5건", color: "#10b981" },
    { title: "총 환자", count: "156명", color: "#8b5cf6" },
  ]

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
      description: "개인 정보를를 관리하세요",
      color: "#f97316", 
      screen: "DoctorProfile" as keyof DoctorStackParamList,
    },
  ]

  const recentNotifications = [
    {
      title: "새로운 예약이 있습니다",
      description: "김영희 환자 - 오후 2:00",
      time: "5분 전",
    },
    {
      title: "진료 결과가 전송되었습니다",
      description: "이철수 환자",
      time: "1시간 전",
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
      // DiagnosisWrite는 파라미터가 필요하므로 임시 데이터 사용
      if (screen === "DiagnosisWrite") {
        navigation.navigate(screen, {
          patientId: "temp",
          appointmentId: "temp",
          patientName: "새 환자",
        })
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
          <View style={styles.notificationCard}>
            {recentNotifications.map((notification, index) => (
              <View
                key={index}
                style={[
                  styles.notificationItem,
                  {
                    borderBottomWidth: index === recentNotifications.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                </View>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            ))}
          </View>
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
})

export default DashboardScreen
