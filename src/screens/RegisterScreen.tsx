// 회원가입화면
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DoctorRegister'>;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  hospital: string;
  department: string;
  phone: string;
  specialization: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    hospital: '',
    department: '',
    phone: '',
    specialization: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLicenseNumber = (licenseNumber: string) => {
    const licensePattern = /^제\d+호$/;
    return licensePattern.test(licenseNumber.trim());
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return false;
    }

    if (!validateEmail(formData.email.trim())) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    if (!formData.password) {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('오류', '비밀번호는 6자 이상이어야 합니다.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (!formData.licenseNumber.trim()) {
      Alert.alert('오류', '의사 면허번호를 입력해주세요.');
      return false;
    }

    if (!validateLicenseNumber(formData.licenseNumber)) {
      Alert.alert('오류', '면허번호 형식이 올바르지 않습니다. (예: 제12345호)');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출 로직
      console.log('회원가입 데이터:', formData);
      
      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('성공', '회원가입이 완료되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('LoginScreen') }
      ]);
      
    } catch (error) {
      console.error('회원가입 오류:', error);
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          
          <Text style={styles.title}>의사 회원가입</Text>
          <Text style={styles.subtitle}>
            피부과 의사 계정을 생성하여 진료 관리 시스템을 이용하세요
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이름 *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="홍길동"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일 *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="doctor@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 * (6자 이상)</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="비밀번호"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인 *</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              placeholder="비밀번호 확인"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>의사 면허번호 *</Text>
            <TextInput
              style={styles.input}
              value={formData.licenseNumber}
              onChangeText={(text) => updateFormData('licenseNumber', text)}
              placeholder="예: 제12345호"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>소속 병원</Text>
            <TextInput
              style={styles.input}
              value={formData.hospital}
              onChangeText={(text) => updateFormData('hospital', text)}
              placeholder="○○병원"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>진료과</Text>
            <TextInput
              style={styles.input}
              value={formData.department}
              onChangeText={(text) => updateFormData('department', text)}
              placeholder="피부과"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>연락처</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="010-1234-5678"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>전문 분야</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.specialization}
              onChangeText={(text) => updateFormData('specialization', text)}
              placeholder="아토피, 여드름, 피부암 등"
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.registerButtonText}>가입 중...</Text>
              </View>
            ) : (
              <Text style={styles.registerButtonText}>회원가입</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLinkText}>로그인</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;