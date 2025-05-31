import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfile } from '../store/authSlice';
import type { RootState } from '../store/store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoctorStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<DoctorStackParamList, 'DoctorProfile'>;

const DoctorProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    hospital: '',
    department: '',
    specialization: '',
    experience: '10년',
    bio: '',
  });

  // Redux store에서 사용자 데이터 로드
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        hospital: user.hospital,
        department: user.department,
        specialization: user.specialization,
        experience: '10년', // 기본값 (추후 user 객체에 추가 가능)
        bio: '피부과 전문의로 다양한 피부 질환 치료에 전념하고 있습니다.', // 기본값
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!profileData.name || !profileData.email) {
      Alert.alert('오류', '이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    // Redux store 업데이트
    dispatch(updateProfile({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      hospital: profileData.hospital,
      department: profileData.department,
      specialization: profileData.specialization,
    }));

    console.log('프로필 저장:', profileData);
    setIsEditing(false);
    Alert.alert('성공', '프로필이 업데이트되었습니다.');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          onPress: () => {
            dispatch(logout());
            // Redux 상태가 변경되면 StackNavigator에서 자동으로 LoginScreen으로 이동
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    // 편집 취소 시 원래 데이터로 복원
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        hospital: user.hospital,
        department: user.department,
        specialization: user.specialization,
        experience: '10년',
        bio: '피부과 전문의로 다양한 피부 질환 치료에 전념하고 있습니다.',
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>사용자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>프로필</Text>
        <TouchableOpacity onPress={() => isEditing ? handleCancel() : setIsEditing(true)}>
          <Text style={styles.editButton}>{isEditing ? '취소' : '편집'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 프로필 사진 영역 */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>
              {profileData.name.charAt(0)}
            </Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>사진 변경</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이름 *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일 *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.email}
                onChangeText={(text) => setProfileData({...profileData, email: text})}
                editable={isEditing}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>연락처</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({...profileData, phone: text})}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* 의료진 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>의료진 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>의사 면허번호</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={profileData.licenseNumber}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>소속 병원</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.hospital}
                onChangeText={(text) => setProfileData({...profileData, hospital: text})}
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>진료과</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.department}
                onChangeText={(text) => setProfileData({...profileData, department: text})}
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>경력</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.experience}
                onChangeText={(text) => setProfileData({...profileData, experience: text})}
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>전문 분야</Text>
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={profileData.specialization}
                onChangeText={(text) => setProfileData({...profileData, specialization: text})}
                editable={isEditing}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>소개</Text>
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({...profileData, bio: text})}
                editable={isEditing}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.settingsCard}>
            <View style={[styles.settingItem, { borderBottomWidth: 1 }]}>
              <Text style={styles.settingLabel}>알림 받기</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={notificationsEnabled ? '#2563eb' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.settingLabel}>자동 응답</Text>
              <Switch
                value={autoReplyEnabled}
                onValueChange={setAutoReplyEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={autoReplyEnabled ? '#2563eb' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.passwordButton}>
            <Text style={styles.passwordButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#2563eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#2563eb',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 16,
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
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#e5e7eb',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  passwordButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorProfileScreen;