import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DoctorFindPassword'>;

const FindPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLicenseNumber = (licenseNumber: string) => {
    const licensePattern = /^제\d+호$/;
    return licensePattern.test(licenseNumber.trim());
  };

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return false;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    if (!licenseNumber.trim()) {
      Alert.alert('오류', '의사 면허번호를 입력해주세요.');
      return false;
    }

    if (!validateLicenseNumber(licenseNumber)) {
      Alert.alert('오류', '면허번호 형식이 올바르지 않습니다. (예: 제12345호)');
      return false;
    }

    return true;
  };

  const handleFindPassword = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setIsEmailSent(false);

    try {
      // 실제 API 호출 로직
      console.log('비밀번호 찾기 요청:', { 
        email: email.trim(), 
        licenseNumber: licenseNumber.trim() 
      });
      
      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 임시 로직: 특정 조건에서만 성공
      if (email.trim() === 'doc@example.com' && licenseNumber.trim() === '제12345호') {
        setIsEmailSent(true);
      } else {
        setNotFound(true);
      }
      
    } catch (error) {
      console.error('비밀번호 찾기 오류:', error);
      Alert.alert(
        '오류', 
        '서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      // 이메일 재발송 로직
      console.log('이메일 재발송:', { email: email.trim() });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('성공', '이메일을 다시 발송했습니다.');
      
    } catch (error) {
      console.error('이메일 재발송 오류:', error);
      Alert.alert('오류', '이메일 재발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setLicenseNumber('');
    setIsEmailSent(false);
    setNotFound(false);
  };

  const renderForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일 *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="doctor@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>의사 면허번호 *</Text>
        <TextInput
          style={styles.input}
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="제12345호"
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.findButton, isLoading && styles.findButtonDisabled]} 
        onPress={handleFindPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.findButtonText}>처리 중...</Text>
          </View>
        ) : (
          <Text style={styles.findButtonText}>비밀번호 재설정 이메일 발송</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSuccessResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.successBox}>
        <Text style={styles.successTitle}>📧 이메일을 발송했습니다!</Text>
        <Text style={styles.successText}>
          <Text style={styles.emailHighlight}>{email}</Text>로{'\n'}
          비밀번호 재설정 링크를 발송했습니다.{'\n'}
          이메일을 확인해주세요.
        </Text>
        <Text style={styles.helpText}>
          이메일이 오지 않았다면 스팸함을 확인해주세요.
        </Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.loginButtonText}>로그인으로 돌아가기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.resendButton, isLoading && styles.resendButtonDisabled]} 
          onPress={handleResendEmail}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.resendButtonText}>발송 중...</Text>
            </View>
          ) : (
            <Text style={styles.resendButtonText}>이메일 다시 받기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotFoundResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>❌ 계정을 찾을 수 없습니다</Text>
        <Text style={styles.errorText}>
          입력하신 이메일과 면허번호와 일치하는{'\n'}
          계정이 없습니다.{'\n'}
          정보를 다시 확인해주세요.
        </Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleReset}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={() => navigation.navigate('DoctorRegister')}
        >
          <Text style={styles.registerButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerBackText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.subtitle}>
            이메일과 의사 면허번호를 입력하여{'\n'}비밀번호를 재설정하세요
          </Text>
        </View>

        {!isEmailSent && !notFound && renderForm()}
        {isEmailSent && renderSuccessResult()}
        {notFound && renderNotFoundResult()}

        <View style={styles.helpSection}>
          <Text style={styles.helpSectionText}>다른 도움이 필요하신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FindIdScreen')}>
            <Text style={styles.helpLink}>아이디 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerBackButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  headerBackText: {
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
  findButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  findButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  findButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successBox: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#1e40af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  emailHighlight: {
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  resendButtonDisabled: {
    borderColor: '#9ca3af',
  },
  resendButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  helpSectionText: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  helpLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FindPasswordScreen;