// 비밀번호 변경 화면
import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native"
import { useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { DoctorStackParamList } from "../types/navigation"

type Props = NativeStackScreenProps<DoctorStackParamList, "ChangePassword">

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch()

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChangePassword = () => {
    // 입력 검증
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Alert.alert("오류", "모든 필드를 입력해주세요.")
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert("오류", "새 비밀번호가 일치하지 않습니다.")
      return
    }

    if (passwords.newPassword.length < 8) {
      Alert.alert("오류", "새 비밀번호는 8자 이상이어야 합니다.")
      return
    }

    // 비밀번호 변경 로직 (실제로는 API 호출)
    console.log("비밀번호 변경:", {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    })

    // 비밀번호 변경 성공 후 로그아웃 및 로그인 화면으로 이동
    Alert.alert("비밀번호 변경 완료", "비밀번호가 성공적으로 변경되었습니다.\n보안을 위해 다시 로그인해주세요.", [
      {
        text: "확인",
        onPress: () => {
          // 로그아웃 처리
          dispatch(logout())
          // 로그인 화면으로 이동
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          })
        },
      },
    ])
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} >
          
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 변경</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>보안을 위해 정기적으로 비밀번호를 변경해주세요.</Text>
          <Text style={styles.infoSubText}>
            새 비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함하는 것을 권장합니다.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* 현재 비밀번호 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>현재 비밀번호 *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={passwords.currentPassword}
                onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
                placeholder="현재 비밀번호를 입력하세요"
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => togglePasswordVisibility("current")}>
                <Text style={styles.eyeButtonText}>{showPasswords.current ? "숨기기" : "보기"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 새 비밀번호 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>새 비밀번호 *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={passwords.newPassword}
                onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
                placeholder="새 비밀번호를 입력하세요"
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => togglePasswordVisibility("new")}>
                <Text style={styles.eyeButtonText}>{showPasswords.new ? "숨기기" : "보기"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 새 비밀번호 확인 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>새 비밀번호 확인 *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={passwords.confirmPassword}
                onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
                placeholder="새 비밀번호를 다시 입력하세요"
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => togglePasswordVisibility("confirm")}>
                <Text style={styles.eyeButtonText}>{showPasswords.confirm ? "숨기기" : "보기"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 비밀번호 강도 표시 */}
          {passwords.newPassword.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthLabel}>비밀번호 강도:</Text>
              <View style={styles.passwordStrengthBar}>
                <View
                  style={[
                    styles.passwordStrengthFill,
                    {
                      width: `${Math.min((passwords.newPassword.length / 12) * 100, 100)}%`,
                      backgroundColor:
                        passwords.newPassword.length < 6
                          ? "#ef4444"
                          : passwords.newPassword.length < 8
                            ? "#f59e0b"
                            : passwords.newPassword.length < 10
                              ? "#10b981"
                              : "#059669",
                    },
                  ]}
                />
              </View>
              <Text style={styles.passwordStrengthText}>
                {passwords.newPassword.length < 6
                  ? "약함"
                  : passwords.newPassword.length < 8
                    ? "보통"
                    : passwords.newPassword.length < 10
                      ? "강함"
                      : "매우 강함"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
            <Text style={styles.changeButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#2563eb",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoSubText: {
    fontSize: 14,
    color: "#3730a3",
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eyeButtonText: {
    fontSize: 14,
    color: "#2563eb",
  },
  passwordStrengthContainer: {
    marginTop: 12,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 4,
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    color: "#6b7280",
  },
  buttonContainer: {
    gap: 12,
  },
  changeButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  changeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default ChangePasswordScreen
