//로그인 화면
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'LoginScreen'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 실제 로그인 API 호출 로직
      console.log('로그인 시도:', { email, password });
      
      // 로그인 검증 로직 (실제로는 서버에서 검증)
      const isValidLogin = email === '123' && password === '123';
      
      if (!isValidLogin) {
        // 로그인 실패 - 현재 화면에 머물면서 에러 표시
        Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
        setIsLoading(false);
        return;
      }
      
      // 로그인 성공 데이터
      const mockUserData = {
        user: {
          id: '1',
          name: '홍길동',
          email: email,
          licenseNumber: '제12345호',
          hospital: '서울대학교병원',
          department: '피부과',
          phone: '010-1234-5678',
          specialization: '아토피, 여드름, 피부암',
        },
        token: 'mock-jwt-token',
      };

      // Redux 상태 업데이트
      dispatch(login(mockUserData));
      
      // 로그인 성공 시에만 대시보드로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'DashboardScreen' }],
      });
      
    } catch (error) {
      // 네트워크 오류 등의 예외 상황
      Alert.alert('오류', '네트워크 연결을 확인해주세요.');
      console.error('로그인 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <TouchableOpacity style={styles.backButton} >
        
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>의사 로그인</Text>
          <Text style={styles.subtitle}>Skin Doctor 의사용 앱</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.links}>
          <View style={styles.linkRow}>
            <TouchableOpacity onPress={() => navigation.navigate('FindIdScreen')}>
              <Text style={styles.linkText}>아이디 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorFindPassword')}>
              <Text style={styles.linkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerLink}>
            <Text style={styles.registerText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorRegister')}>
              <Text style={styles.registerLinkText}>회원가입</Text>
            </TouchableOpacity>
          </View>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;