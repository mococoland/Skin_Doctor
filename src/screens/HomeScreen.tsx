// 맨 처음 화면
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { 
  Stethoscope, 
  UserPlus, 
  Calendar, 
  FileText, 
  Users,
  Heart
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<DoctorStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [backPressCount, setBackPressCount] = useState(0);

  // 홈 화면에서만 뒤로가기 처리 (화면이 포커스 상태일 때만)
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show('한 번 더 누르면 앱이 종료됩니다.', ToastAndroid.SHORT);
          
          // 2초 후 카운트 리셋
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000);
          
          return true; // 기본 뒤로가기 동작 방지
        } else {
          BackHandler.exitApp(); // 앱 종료
          return false;
        }
      });

      return () => backHandler.remove();
    }, [backPressCount])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Heart size={40} color="#2563eb" />
            <Text style={styles.title}>DOCTOR</Text>
          </View>
          <Text style={styles.subtitle}>피부과 의사를 위한 진료 관리 시스템</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Stethoscope size={40} color="#2563eb" />
            <Text style={styles.cardTitle}>의사 로그인</Text>
            <Text style={styles.cardDescription}>
              기존 계정으로 로그인하여 진료를 시작하세요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DoctorRegister')}
          >
            <UserPlus size={40} color="#16a34a" />
            <Text style={styles.cardTitle}>신규 가입</Text>
            <Text style={styles.cardDescription}>
              새로운 의사 계정을 생성하세요
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>주요 기능</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Calendar size={30} color="#2563eb" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>예약 관리</Text>
              <Text style={styles.featureDescription}>
                환자 예약 현황을 실시간으로 확인
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <FileText size={30} color="#16a34a" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>진료 기록</Text>
              <Text style={styles.featureDescription}>
                진료 결과 작성 및 관리
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Users size={30} color="#7c3aed" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>환자 관리</Text>
              <Text style={styles.featureDescription}>
                진료한 환자 내역 조회
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            안전하고 효율적인 진료 관리를 위한 솔루션
          </Text>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;