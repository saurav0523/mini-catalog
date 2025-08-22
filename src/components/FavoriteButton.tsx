import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../features/products/favoritesSlice';

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds
  );
  const isFavorite = favoriteIds.includes(productId);

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(productId));
  };

  return (
    <TouchableOpacity
      style={styles.favoriteButton}
      onPress={handleFavoriteToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? '#FF3B30' : '#1C1C1E'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default FavoriteButton;
