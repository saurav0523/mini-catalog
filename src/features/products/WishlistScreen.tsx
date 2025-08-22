import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleFavorite } from './favoritesSlice';
import { addToCart } from '../cart/cartSlice';
import WishlistCard from '../../components/WishlistCard';
import EmptyState from '../../components/EmptyState';
import { Product } from '../../api/products';
import { fetchProducts } from '../../api/products';
import Loader from '../../components/Loader';
import { useTheme } from '../../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

const WishlistScreen = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds
  );
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Wishlist focused - clearing navigation cache');
    });

    return unsubscribe;
  }, [navigation]);

  const {
    data: allProducts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const favoriteProducts =
    allProducts?.filter(product => favoriteIds.includes(product.id)) || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails' as never, { product } as never);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    // Provide subtle haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(toggleFavorite(productId));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 16,
    },
    listContainer: {
      padding: 16,
    },
    skeletonSearchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    skeletonSearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      paddingHorizontal: 12,
      height: 40,
    },
    skeletonSearchIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.divider,
      marginRight: 8,
    },
    skeletonSearchInput: {
      flex: 1,
      height: 16,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
    },
    skeletonClearButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.divider,
      marginLeft: 8,
    },
    skeletonGrid: {
      padding: 16,
    },
    skeletonWishlistItem: {
      marginBottom: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      overflow: 'hidden',
    },
    skeletonCard: {
      height: 140,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
    },
    skeletonActions: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    skeletonActionButton: {
      flex: 1,
      height: 40,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <View style={styles.loaderContainer}>
          <Ionicons
            name="heart-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.loadingText}>{t('loading_wishlist')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title={t('empty_wishlist')}
          message={t('empty_wishlist_message')}
          icon="heart-outline"
          actionText={t('browse_products')}
          onAction={() => {
            navigation.navigate('Products' as never);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={refreshing ? [] : favoriteProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WishlistCard
            product={item}
            onPress={() => handleProductPress(item)}
            onAddToCart={() => handleAddToCart(item)}
            onRemoveFromWishlist={() => handleRemoveFromWishlist(item.id)}
          />
        )}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          refreshing ? (
            <>
              <View style={styles.skeletonSearchContainer}>
                <View style={styles.skeletonSearchBar}>
                  <View style={styles.skeletonSearchIcon} />
                  <View style={styles.skeletonSearchInput} />
                  <View style={styles.skeletonClearButton} />
                </View>
              </View>

              <View style={styles.skeletonGrid}>
                <View style={styles.skeletonWishlistItem}>
                  <View style={styles.skeletonCard}>
                    <Loader height={140} />
                  </View>
                  <View style={styles.skeletonActions}>
                    <View style={styles.skeletonActionButton}>
                      <Loader height={40} />
                    </View>
                    <View style={styles.skeletonActionButton}>
                      <Loader height={40} />
                    </View>
                  </View>
                </View>

                <View style={styles.skeletonWishlistItem}>
                  <View style={styles.skeletonCard}>
                    <Loader height={140} />
                  </View>
                  <View style={styles.skeletonActions}>
                    <View style={styles.skeletonActionButton}>
                      <Loader height={40} />
                    </View>
                    <View style={styles.skeletonActionButton}>
                      <Loader height={40} />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default WishlistScreen;
