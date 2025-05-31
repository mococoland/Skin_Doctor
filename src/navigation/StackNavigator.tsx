import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { DoctorStackParamList } from '../types/navigation';

// 화면 컴포넌트들
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FindIdScreen from "../screens/FindIdScreen";
import FindPasswordScreen from "../screens/FindPasswordScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AppointmentListScreen from "../screens/AppointmentListScreen";
import PatientDetailScreen from "../screens/PatientDetailScreen";
import DiagnosisWriteScreen from "../screens/DiagnosisWriteScreen";
import PatientHistoryScreen from "../screens/PatientHistoryScreen";
import PatientHistoryDetailScreen from "../screens/PatientHistoryDetailScreen";
import DoctorProfileScreen from "../screens/DoctorProfileScreen";

const Stack = createNativeStackNavigator<DoctorStackParamList>();

const StackNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "DashboardScreen" : "HomeScreen"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      {/* 모든 화면을 항상 포함 */}
      
      {/* 공통 화면 */}
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: '홈' }}
      />

      {/* 인증 관련 화면 */}
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen}
        options={{ title: '로그인' }}
      />
      <Stack.Screen 
        name="DoctorRegister" 
        component={RegisterScreen}
        options={{ title: '회원가입' }}
      />
      <Stack.Screen 
        name="FindIdScreen" 
        component={FindIdScreen}
        options={{ title: '아이디 찾기' }}
      />
      <Stack.Screen
        name="DoctorFindPassword"
        component={FindPasswordScreen}
        options={{ title: '비밀번호 찾기' }}
      />

      {/* 메인 앱 화면 */}
      <Stack.Screen 
        name="DashboardScreen" 
        component={DashboardScreen}
        options={{ title: '대시보드' }}
      />
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentListScreen}
        options={{ title: '예약 관리' }}
      />
      <Stack.Screen 
        name="PatientDetail" 
        component={PatientDetailScreen}
        options={{ title: '환자 상세' }}
      />
      <Stack.Screen 
        name="DiagnosisWrite" 
        component={DiagnosisWriteScreen}
        options={{ title: '진료 기록' }}
      />
      <Stack.Screen 
        name="PatientHistory" 
        component={PatientHistoryScreen}
        options={{ title: '환자 기록' }}
      />
      <Stack.Screen
        name="PatientHistoryDetail"
        component={PatientHistoryDetailScreen}
        options={{ title: '환자 기록 상세' }}
      />
      <Stack.Screen 
        name="DoctorProfile" 
        component={DoctorProfileScreen}
        options={{ title: '프로필 설정' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;