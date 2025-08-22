import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface WishlistCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
  };
  onPress: () => void;
  onAddToCart: () => void;
  onRemoveFromWishlist: () => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isProductInCart = cartItems.some(item => item.id === product.id);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      padding: 16,
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    productInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 22,
    },
    category: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textTransform: 'capitalize',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 4,
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
    },
    actions: {
      flexDirection: 'row',
      padding: 16,
      paddingTop: 0,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
    addToCartButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    moveToCartButton: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    addToCartText: {
      color: theme.colors.onPrimary,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    removeButton: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.error,
    },
    removeButtonText: {
      color: theme.colors.error,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.productInfo}>
          <View>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category}>{product.category}</Text>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={theme.colors.warning} />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviews}>({product.reviews})</Text>
            </View>
          </View>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isProductInCart ? styles.moveToCartButton : styles.addToCartButton,
          ]}
          onPress={() => {
            if (isProductInCart) {
              // If product is already in cart, navigate to cart
              navigation.navigate('Cart' as never);
            } else {
              // If product is not in cart, add it
              onAddToCart();
            }
          }}
        >
          <Ionicons
            name={isProductInCart ? 'cart' : 'cart-outline'}
            size={18}
            color={theme.colors.onPrimary}
          />
          <Text style={styles.addToCartText}>
            {isProductInCart ? t('move_to_cart') : t('add_to_cart')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={onRemoveFromWishlist}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
          <Text style={styles.removeButtonText}>{t('remove')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default WishlistCard;
