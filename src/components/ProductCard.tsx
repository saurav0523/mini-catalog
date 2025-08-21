import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart, updateQuantity, removeFromCart } from '../features/cart/cartSlice';
import { toggleFavorite } from '../features/products/favoritesSlice';
import { Product } from '../api/products';
import { useTheme } from '../theme/ThemeContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favoriteIds);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isFavorite = favorites.includes(product.id);
  const isInCart = cartItems.some(item => item.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const buttonAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(product.id));
    
    // Haptic feedback for favorite toggle
    if (isFavorite) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAddToCart = () => {
    if (isInCart) {
      // If already in cart, increase quantity
      dispatch(
        updateQuantity({
          id: product.id,
          quantity: cartItem?.quantity || 1,
        })
      );
      
      // Haptic feedback for quantity increase
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // If not in cart, add new item
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      );
      
      // Haptic feedback for adding new item
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Button transition animation
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(
        updateQuantity({
          id: product.id,
          quantity: newQuantity,
        })
      );
    }
  };

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    imageContainer: {
      position: 'relative',
    },
    content: {
      padding: 12,
      flex: 1,
      justifyContent: 'space-between',
    },
    productInfo: {
      marginBottom: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    ratingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    reviews: {
      fontSize: 12,
      color: theme.colors.textTertiary,
      marginLeft: 4,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    addButton: {
      backgroundColor: isInCart ? theme.colors.success : theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    addButtonInCart: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    addButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 8,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 10,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      minWidth: 30,
      textAlign: 'center',
    },
    quantityButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    wishlistOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderRadius: 12,
      zIndex: 5,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      testID="product-card"
    >
      <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          testID="favorite-button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.productInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.addButton, 
            isInCart && styles.addButtonInCart
          ]} 
          onPress={handleAddToCart}
        >
          <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
            {isInCart ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                  ]}
                  onPress={() => {
                    if (cartItem && cartItem.quantity > 1) {
                      dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 }));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } else if (cartItem && cartItem.quantity === 1) {
                      dispatch(removeFromCart(product.id));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                  }}
                >
                  <Ionicons 
                    name="remove" 
                    size={16} 
                    color={theme.colors.onPrimary}
                  />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{cartItem?.quantity || 1}</Text>
                
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                  ]}
                  onPress={() => {
                    if (cartItem && cartItem.quantity < 99) {
                      dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 }));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                >
                  <Ionicons 
                    name="add" 
                    size={16} 
                    color={theme.colors.onPrimary} 
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.addButtonText}>
                  {t('add_to_cart')}
                </Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
