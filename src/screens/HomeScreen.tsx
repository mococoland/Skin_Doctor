// 맨 처음 화면
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Skin Doctor</Text>
          <Text style={styles.subtitle}>피부과 의사를 위한 진료 관리 시스템</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Icon name="local-hospital" size={40} color="#2563eb" />
            <Text style={styles.cardTitle}>의사 로그인</Text>
            <Text style={styles.cardDescription}>
              기존 계정으로 로그인하여 진료를 시작하세요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DoctorRegister')}
          >
            <Icon name="person-add" size={40} color="#16a34a" />
            <Text style={styles.cardTitle}>신규 가입</Text>
            <Text style={styles.cardDescription}>
              새로운 의사 계정을 생성하세요
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>주요 기능</Text>
          
          <View style={styles.featureItem}>
            <Icon name="schedule" size={30} color="#2563eb" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>예약 관리</Text>
              <Text style={styles.featureDescription}>
                환자 예약 현황을 실시간으로 확인
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="assignment" size={30} color="#16a34a" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>진료 기록</Text>
              <Text style={styles.featureDescription}>
                진료 결과 작성 및 관리
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="people" size={30} color="#7c3aed" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>환자 관리</Text>
              <Text style={styles.featureDescription}>
                진료한 환자 내역 조회
              </Text>
            </View>
          </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
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
});

export default HomeScreen;