import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image,
  Platform
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import { User } from '@/types/user';
import { Plus, X, Camera } from 'lucide-react-native';

type Language = {
  language: string;
  level: string;
};

const LANGUAGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Native'];

export default function EditProfileScreen() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [knownLanguages, setKnownLanguages] = useState<Language[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<Language[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [partnerPreferences, setPartnerPreferences] = useState('');

  useEffect(() => {
    if (authUser?._id) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const loadUserProfile = async () => {
    try {
      if (authUser?._id) {
        const profile = await getUserProfile(authUser._id);
        
        if (profile) {
          setName(profile.name || '');
          setEmail(profile.email || '');
          setPhotoUrl(profile.photoUrl || '');
          setKnownLanguages(profile.knownLanguages || []);
          setLearningLanguages(profile.learningLanguages || []);
          setInterests(profile.interests || []);
          setPartnerPreferences(profile.partnerPreferences || '');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      setSaving(true);
      
      const updatedProfile: Partial<User> = {
        name,
        email,
        photoUrl,
        knownLanguages,
        learningLanguages,
        interests,
        partnerPreferences,
      };
      
      await updateUserProfile(updatedProfile);
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addKnownLanguage = () => {
    setKnownLanguages([
      ...knownLanguages,
      { language: '', level: 'Intermediate' }
    ]);
  };

  const updateKnownLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...knownLanguages];
    updated[index] = { ...updated[index], [field]: value };
    setKnownLanguages(updated);
  };

  const removeKnownLanguage = (index: number) => {
    setKnownLanguages(knownLanguages.filter((_, i) => i !== index));
  };

  const addLearningLanguage = () => {
    setLearningLanguages([
      ...learningLanguages,
      { language: '', level: 'Beginner' }
    ]);
  };

  const updateLearningLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...learningLanguages];
    updated[index] = { ...updated[index], [field]: value };
    setLearningLanguages(updated);
  };

  const removeLearningLanguage = (index: number) => {
    setLearningLanguages(learningLanguages.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (!newInterest.trim()) return;
    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const uploadPhoto = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Feature unavailable', 'Photo uploads are not available on web.');
      return;
    }
    
    // This is a placeholder for photo upload functionality
    // In a real app, you would implement camera/gallery access
    Alert.alert('Feature coming soon', 'Photo upload will be implemented in a future update');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F7" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Edit Profile',
          headerShown: true,
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={uploadPhoto}
            >
              <Camera size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              editable={false}
              keyboardType="email-address"
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Languages I Speak</Text>
          
          {knownLanguages.map((lang, index) => (
            <View key={`known-${index}`} style={styles.languageContainer}>
              <View style={styles.languageInputRow}>
                <View style={styles.languageNameContainer}>
                  <TextInput
                    style={styles.languageInput}
                    value={lang.language}
                    onChangeText={(value) => updateKnownLanguage(index, 'language', value)}
                    placeholder="Language name"
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeKnownLanguage(index)}
                >
                  <X size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.levelsContainer}>
                {LANGUAGE_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      lang.level === level && styles.selectedLevel,
                    ]}
                    onPress={() => updateKnownLanguage(index, 'level', level)}
                  >
                    <Text
                      style={[
                        styles.levelText,
                        lang.level === level && styles.selectedLevelText,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addKnownLanguage}
          >
            <Plus size={20} color="#3B82F7" />
            <Text style={styles.addButtonText}>Add Language</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Languages I'm Learning</Text>
          
          {learningLanguages.map((lang, index) => (
            <View key={`learning-${index}`} style={styles.languageContainer}>
              <View style={styles.languageInputRow}>
                <View style={styles.languageNameContainer}>
                  <TextInput
                    style={styles.languageInput}
                    value={lang.language}
                    onChangeText={(value) => updateLearningLanguage(index, 'language', value)}
                    placeholder="Language name"
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeLearningLanguage(index)}
                >
                  <X size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.levelsContainer}>
                {LANGUAGE_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      lang.level === level && styles.selectedLevel,
                    ]}
                    onPress={() => updateLearningLanguage(index, 'level', level)}
                  >
                    <Text
                      style={[
                        styles.levelText,
                        lang.level === level && styles.selectedLevelText,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addLearningLanguage}
          >
            <Plus size={20} color="#3B82F7" />
            <Text style={styles.addButtonText}>Add Language</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Interests (Optional)</Text>
          
          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestBadge}>
                <Text style={styles.interestText}>{interest}</Text>
                <TouchableOpacity
                  style={styles.removeInterestButton}
                  onPress={() => removeInterest(index)}
                >
                  <X size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.addInterestContainer}>
            <TextInput
              style={styles.interestInput}
              value={newInterest}
              onChangeText={setNewInterest}
              placeholder="Add an interest"
              onSubmitEditing={addInterest}
            />
            <TouchableOpacity 
              style={styles.addInterestButton}
              onPress={addInterest}
              disabled={!newInterest.trim()}
            >
              <Plus size={20} color={newInterest.trim() ? '#3B82F7' : '#CBD5E1'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Partner Preferences (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={partnerPreferences}
            onChangeText={setPartnerPreferences}
            placeholder="Describe what you're looking for in a language partner"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F8FAFC',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  languageContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  languageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageNameContainer: {
    flex: 1,
  },
  languageInput: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  removeButton: {
    padding: 12,
  },
  levelsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  selectedLevel: {
    backgroundColor: '#EFF6FF',
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  selectedLevelText: {
    color: '#3B82F7',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F7',
    marginLeft: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#3B82F7',
    marginRight: 4,
  },
  removeInterestButton: {
    padding: 2,
  },
  addInterestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  interestInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  addInterestButton: {
    padding: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F8FAFC',
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#3B82F7',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    height: 40,
  },
});