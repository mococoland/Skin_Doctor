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
      {/* 공통 화면 - 인증 여부와 관계없이 접근 가능 */}
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
      />

      {!isAuthenticated ? (
        // 비인증 상태의 스택
        <>
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
          />
          <Stack.Screen 
            name="DoctorRegister" 
            component={RegisterScreen} 
          />
          <Stack.Screen 
            name="FindIdScreen" 
            component={FindIdScreen}
          />
          <Stack.Screen
            name="DoctorFindPassword"
            component={FindPasswordScreen}
          />
        </>
      ) : (
        // 인증 상태의 스택
        <>
          <Stack.Screen 
            name="DashboardScreen" 
            component={DashboardScreen} 
          />
          <Stack.Screen
            name="AppointmentList"
            component={AppointmentListScreen}
          />
          <Stack.Screen 
            name="PatientDetail" 
            component={PatientDetailScreen} 
          />
          <Stack.Screen 
            name="DiagnosisWrite" 
            component={DiagnosisWriteScreen} 
          />
          <Stack.Screen 
            name="PatientHistory" 
            component={PatientHistoryScreen} 
          />
          <Stack.Screen
            name="PatientHistoryDetail"
            component={PatientHistoryDetailScreen}
          />
          <Stack.Screen 
            name="DoctorProfile" 
            component={DoctorProfileScreen} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;