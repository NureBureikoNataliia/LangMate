import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Camera, Plus, X } from 'lucide-react-native';

const LANGUAGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Native'];

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [knownLanguages, setKnownLanguages] = useState(user?.knownLanguages || []);
  const [learningLanguages, setLearningLanguages] = useState(user?.learningLanguages || []);
  const [interests, setInterests] = useState(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const handleSave = async () => {
    try {
      await updateProfile({
        name,
        knownLanguages,
        learningLanguages,
        interests,
      });
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addKnownLanguage = () => {
    setKnownLanguages([...knownLanguages, { language: '', level: 'Intermediate' }]);
  };

  const updateKnownLanguage = (index: number, field: 'language' | 'level', value: string) => {
    const updated = [...knownLanguages];
    updated[index] = { ...updated[index], [field]: value };
    setKnownLanguages(updated);
  };

  const removeKnownLanguage = (index: number) => {
    setKnownLanguages(knownLanguages.filter((_, i) => i !== index));
  };

  const addLearningLanguage = () => {
    setLearningLanguages([...learningLanguages, { language: '', level: 'Beginner' }]);
  };

  const updateLearningLanguage = (index: number, field: 'language' | 'level', value: string) => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.photoSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: user?.photoUrl || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' 
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages I Speak</Text>
        {knownLanguages.map((lang, index) => (
          <View key={index} style={styles.languageContainer}>
            <View style={styles.languageHeader}>
              <TextInput
                style={styles.languageInput}
                value={lang.language}
                onChangeText={(value) => updateKnownLanguage(index, 'language', value)}
                placeholder="Language name"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeKnownLanguage(index)}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <View style={styles.levelButtons}>
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
                      styles.levelButtonText,
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
        <TouchableOpacity style={styles.addButton} onPress={addKnownLanguage}>
          <Plus size={20} color="#3B82F7" />
          <Text style={styles.addButtonText}>Add Language</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages I'm Learning</Text>
        {learningLanguages.map((lang, index) => (
          <View key={index} style={styles.languageContainer}>
            <View style={styles.languageHeader}>
              <TextInput
                style={styles.languageInput}
                value={lang.language}
                onChangeText={(value) => updateLearningLanguage(index, 'language', value)}
                placeholder="Language name"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeLearningLanguage(index)}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <View style={styles.levelButtons}>
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
                      styles.levelButtonText,
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
        <TouchableOpacity style={styles.addButton} onPress={addLearningLanguage}>
          <Plus size={20} color="#3B82F7" />
          <Text style={styles.addButtonText}>Add Language</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E5',
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
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
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
  languageContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  removeButton: {
    padding: 12,
  },
  levelButtons: {
    flexDirection: 'row',
    padding: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: '#EFF6FF',
  },
  levelButtonText: {
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
    paddingVertical: 6,
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
  saveButton: {
    backgroundColor: '#3B82F7',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
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