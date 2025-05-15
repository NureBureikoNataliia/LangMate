import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { getUserProfiles } from '@/services/userService';
import { User as UserType } from '@/types/user';
import { Heart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { toggleFavoriteUser } from '@/services/userService';

export default function PartnersScreen() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUserProfiles();
      
      // Filter out the current user
      const filteredUsers = data.filter((u) => u._id !== user?._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleFavorite = async (userId: string) => {
    try {
      await toggleFavoriteUser(userId);
      
      // Update local state
      setUsers(users.map(u => {
        if (u._id === userId) {
          return { ...u, isFavorite: !u.isFavorite };
        }
        return u;
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleStartChat = (userId: string, userName: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: userId, name: userName }
    });
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.learningLanguages.some(lang => 
        lang.language.toLowerCase().includes(searchLower)
      ) ||
      user.knownLanguages.some(lang => 
        lang.language.toLowerCase().includes(searchLower)
      ) ||
      (user.interests && user.interests.some(interest => 
        interest.toLowerCase().includes(searchLower)
      ))
    );
  });

  const renderLanguageBadge = (language: string, level: string) => {
    const getColor = (level: string) => {
      switch (level.toLowerCase()) {
        case 'beginner': return '#FFD6AD';
        case 'intermediate': return '#C2E0FF';
        case 'advanced': return '#B8E0D2';
        case 'native': return '#D0C9FF';
        default: return '#E5E7EB';
      }
    };
    
    return (
      <View 
        style={[
          styles.languageBadge, 
          { backgroundColor: getColor(level) }
        ]}
      >
        <Text style={styles.languageText}>{language}</Text>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    );
  };

  const renderUserItem = ({ item }: { item: UserType }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ 
              uri: item.photoUrl || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' 
            }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            {item.interests && item.interests.length > 0 && (
              <Text style={styles.interests}>
                {item.interests.slice(0, 2).join(', ')}
                {item.interests.length > 2 ? '...' : ''}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleFavorite(item._id)}
        >
          <Heart 
            size={22} 
            color={item.isFavorite ? '#EF4444' : '#CBD5E1'} 
            fill={item.isFavorite ? '#EF4444' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.languageSection}>
        <Text style={styles.sectionTitle}>Learning:</Text>
        <View style={styles.languagesContainer}>
          {item.learningLanguages.map((lang, index) => (
            <View key={`learning-${index}`}>
              {renderLanguageBadge(lang.language, lang.level)}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.languageSection}>
        <Text style={styles.sectionTitle}>Speaks:</Text>
        <View style={styles.languagesContainer}>
          {item.knownLanguages.map((lang, index) => (
            <View key={`known-${index}`}>
              {renderLanguageBadge(lang.language, lang.level)}
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => handleStartChat(item._id, item.name)}
      >
        <Text style={styles.chatButtonText}>Start Conversation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, language or interest"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F7" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No users match your search criteria' 
                  : 'No language partners available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  interests: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  languageSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  chatButton: {
    backgroundColor: '#3B82F7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});