import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeFromCart } from '../cart/cartSlice';
import QuantityStepper from '../../components/QuantityStepper';
import { RootState } from '../../store';
import { store } from '../../store';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface RouteParams {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    rating: number;
    reviews: number;
  };
}

const ProductDetailsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { product } = route.params as RouteParams;
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);


  const cartItems = useSelector((state: RootState) => state.cart.items);
  const existingCartItem = cartItems.find((item: any) => item.id === product.id);
  const isInCart = !!existingCartItem;


  React.useEffect(() => {
    console.log('useEffect running - cartItems:', cartItems);
    console.log('existingCartItem:', existingCartItem);
    console.log('isInCart:', isInCart);
    
    if (isInCart && existingCartItem) {
      console.log('Setting quantity stepper visible with quantity:', existingCartItem.quantity);
      setShowQuantity(true);
      setQuantity(existingCartItem.quantity);
    } else {
      console.log('Hiding quantity stepper');
      setShowQuantity(false);
      setQuantity(1);
    }
  }, [cartItems, existingCartItem, isInCart]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused - updating cart state');

      const currentCartItems = store.getState().cart.items;
      const currentCartItem = currentCartItems.find((item: any) => item.id === product.id);
      
      if (currentCartItem) {
        console.log('Product found in cart, showing quantity stepper');
        setShowQuantity(true);
        setQuantity(currentCartItem.quantity);
      } else {
        console.log('Product not in cart, hiding quantity stepper');
        setShowQuantity(false);
        setQuantity(1);
      }
    });

    return unsubscribe;
  }, [navigation, product.id]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('Screen blurred - clearing navigation state');

      setShowQuantity(false);
      setQuantity(1);
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddToCart = () => {
    console.log('handleAddToCart clicked, product:', product.id);
    

    if (isInCart && existingCartItem) {
      console.log('Product already in cart, showing quantity stepper');
      setShowQuantity(true);
      setQuantity(existingCartItem.quantity);
    } else {
      console.log('Adding new product to cart');

      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      );
      setShowQuantity(true);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {

      dispatch(removeFromCart(product.id));
      setShowQuantity(false);
      setQuantity(1);
    } else {

      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
      setQuantity(newQuantity);
    }
  };

  const handleConfirmAddToCart = () => {
    console.log('handleConfirmAddToCart called');
    
    if (isInCart) {

      dispatch(updateQuantity({ id: product.id, quantity }));
    } else {

      dispatch(addToCart({ ...product, quantity }));
    }
    

    setShowQuantity(false);
    setQuantity(1);
    
    
    try {
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProductList' }],
      });
      
      
      setTimeout(() => {
        navigation.navigate('Cart' as never);
      }, 100);
    } catch (error) {
      console.log('Navigation reset failed, using fallback:', error);
      
      navigation.navigate('Cart' as never);
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.id));
    setShowQuantity(false);
    setQuantity(1);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    image: {
      width: width,
      height: width * 0.8,
      resizeMode: 'cover',
    },
    content: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 32,
    },
    category: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textTransform: 'capitalize',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    rating: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 8,
    },
    reviews: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    price: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
      marginBottom: 24,
    },
    quantitySection: {
      marginBottom: 24,
    },
    quantityLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    quantityStepperContainer: {
      alignItems: 'center',
    },
    addToCartButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    cartIcon: {
      marginRight: 8,
    },
    addToCartText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    imageContainer: {
      width: '100%',
      height: width * 0.8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    name: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
      lineHeight: 30,
    },
    starsContainer: {
      flexDirection: 'row',
      marginRight: 8,
    },
    ratingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    confirmButton: {
      backgroundColor: theme.colors.success,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <Ionicons
                  key={star}
                  name={star <= product.rating ? 'star' : 'star-outline'}
                  size={16}
                  color={star <= product.rating ? '#FFD700' : '#C7C7CC'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} {t('reviews')})
            </Text>
          </View>

          <Text style={styles.category}>{product.category}</Text>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <Text style={styles.description}>{product.description}</Text>

          
          {showQuantity && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <QuantityStepper
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                minQuantity={1}
                maxQuantity={99}
                onMinusClick={handleRemoveFromCart}
              />
            </View>
          )}

            
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              showQuantity && styles.confirmButton
            ]}
            onPress={showQuantity ? handleConfirmAddToCart : handleAddToCart}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showQuantity ? "cart" : "cart-outline"}
              size={20}
              color="white"
              style={styles.cartIcon}
            />
            <Text style={styles.addToCartText}>
              {showQuantity ? 'Move to Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
