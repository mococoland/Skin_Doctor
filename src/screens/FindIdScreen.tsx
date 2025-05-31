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

type Props = NativeStackScreenProps<DoctorStackParamList, 'FindIdScreen'>;

const FindIdScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return false;
    }

    if (!licenseNumber.trim()) {
      Alert.alert('오류', '의사 면허번호를 입력해주세요.');
      return false;
    }

    // 면허번호 형식 검증 (예: 제12345호)
    const licensePattern = /^제\d+호$/;
    if (!licensePattern.test(licenseNumber.trim())) {
      Alert.alert('오류', '면허번호 형식이 올바르지 않습니다. (예: 제12345호)');
      return false;
    }

    return true;
  };

  const handleFindId = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setFoundEmail('');

    try {
      // 실제 API 호출 로직
      console.log('아이디 찾기 요청:', { name: name.trim(), licenseNumber: licenseNumber.trim() });
      
      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 임시 로직: 특정 조건에서만 성공
      if (name.trim() === '홍길동' && licenseNumber.trim() === '제12345호') {
        setFoundEmail('doc***@example.com');
      } else {
        setNotFound(true);
      }
      
    } catch (error) {
      console.error('아이디 찾기 오류:', error);
      Alert.alert(
        '오류', 
        '서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setLicenseNumber('');
    setFoundEmail('');
    setNotFound(false);
  };

  const renderForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이름 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="홍길동"
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
        onPress={handleFindId}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.findButtonText}>검색 중...</Text>
          </View>
        ) : (
          <Text style={styles.findButtonText}>아이디 찾기</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSuccessResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.successBox}>
        <Text style={styles.successTitle}>✅ 아이디를 찾았습니다!</Text>
        <Text style={styles.successText}>
          회원님의 아이디는{'\n'}
          <Text style={styles.emailText}>{foundEmail}</Text>{'\n'}
          입니다.
        </Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.loginButtonText}>로그인하기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>다시 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotFoundResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>❌ 아이디를 찾을 수 없습니다</Text>
        <Text style={styles.errorText}>
          입력하신 정보와 일치하는 계정이 없습니다.{'\n'}
          이름과 면허번호를 다시 확인해주세요.
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
          <Text style={styles.title}>아이디 찾기</Text>
          <Text style={styles.subtitle}>
            이름과 의사 면허번호를 입력하여{'\n'}아이디를 찾으세요
          </Text>
        </View>

        {!foundEmail && !notFound && renderForm()}
        {foundEmail && renderSuccessResult()}
        {notFound && renderNotFoundResult()}

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>도움이 필요하신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorFindPassword')}>
            <Text style={styles.helpLink}>비밀번호 찾기</Text>
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
    backgroundColor: '#dcfce7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: 'bold',
    fontSize: 18,
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
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  resetButtonText: {
    color: '#374151',
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
  helpText: {
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

export default FindIdScreen;