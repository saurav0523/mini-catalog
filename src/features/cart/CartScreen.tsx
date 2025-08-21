import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from './cartSlice';
import QuantityStepper from '../../components/QuantityStepper';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';

const promoCodeSchema = yup.object({
  promoCode: yup
    .string()
    .required('Promo code is required')
    .min(3, 'Promo code must be at least 3 characters')
    .max(20, 'Promo code must be less than 20 characters'),
});

type PromoCodeFormData = yup.InferType<typeof promoCodeSchema>;

const CartScreen = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.total);
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Clear navigation cache when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Cart focused - clearing navigation cache');
      // Clear any nested navigation stack to ensure we're at the root
      // Note: popToTop is not available in this context
    });

    return unsubscribe;
  }, [navigation]);

  console.log('CartScreen - cartItems:', cartItems);
  console.log('CartScreen - subtotal:', subtotal);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - in real app, this would reload data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromoCodeFormData>({
    resolver: yupResolver(promoCodeSchema),
    defaultValues: {
      promoCode: '',
    },
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity reaches 0 or below, remove item from cart
      dispatch(removeFromCart(itemId));
    } else {
      // Update quantity normally
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const onSubmitPromo = (data: PromoCodeFormData) => {
    if (data.promoCode.toUpperCase() === 'SAVE10') {
      if (appliedPromo) {
        Alert.alert('Promo Code', 'Promo code is already applied!');
        return;
      }

      const discountAmount = subtotal * 0.1; // 10% discount
      setDiscount(discountAmount);
      setAppliedPromo(true);
      reset();
      Alert.alert('Success', 'Promo code SAVE10 applied! 10% discount added.');
    } else {
      Alert.alert(
        'Invalid Code',
        'Please enter a valid promo code. Try SAVE10 for 10% off.'
      );
    }
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedPromo(false);
    reset();
  };

  const total = subtotal - discount;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContainer: {
      padding: 16,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 16,
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    itemPrice: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 12,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    removeButton: {
      padding: 8,
    },
    promoSection: {
      backgroundColor: theme.colors.card,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    promoInputContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    promoInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      marginRight: 12,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
    },
    promoInputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 14,
      marginBottom: 8,
    },
    applyButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      justifyContent: 'center',
    },
    applyButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    removePromoButton: {
      backgroundColor: theme.colors.error,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      justifyContent: 'center',
    },
    removePromoButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    promoApplied: {
      fontSize: 14,
      color: theme.colors.success,
      fontWeight: '500',
    },
    summarySection: {
      backgroundColor: theme.colors.card,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    summaryValueDiscount: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.success,
    },
    summaryTotal: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    checkoutContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    checkoutButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    skeletonGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    skeletonCartItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      width: '48%',
      height: 120,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    skeletonItemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: theme.colors.divider,
    },
    skeletonItemContent: {
      flex: 1,
    },
    skeletonItemName: {
      width: '80%',
      height: 20,
      backgroundColor: theme.colors.divider,
      marginBottom: 4,
      borderRadius: 4,
    },
    skeletonItemPrice: {
      width: '60%',
      height: 18,
      backgroundColor: theme.colors.divider,
      marginBottom: 12,
      borderRadius: 4,
    },
    skeletonItemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skeletonQuantityStepper: {
      width: 80,
      height: 40,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
    },
    skeletonRemoveButton: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
    },
    skeletonSearchContainer: {
      marginBottom: 12,
    },
    skeletonSearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    skeletonSearchIcon: {
      width: 20,
      height: 20,
      backgroundColor: theme.colors.divider,
      borderRadius: 10,
      marginRight: 10,
    },
    skeletonSearchInput: {
      flex: 1,
      height: 20,
      backgroundColor: theme.colors.divider,
      borderRadius: 4,
    },
    skeletonClearButton: {
      width: 20,
      height: 20,
      backgroundColor: theme.colors.divider,
      borderRadius: 10,
    },
  });

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        <View style={styles.itemActions}>
          <QuantityStepper
            quantity={item.quantity}
            onQuantityChange={quantity =>
              handleQuantityChange(item.id, quantity)
            }
            minQuantity={1}
            maxQuantity={99}
            onMinusClick={() => handleRemoveItem(item.id)}
          />

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title={t('empty_cart')}
          message={t('empty_cart_message')}
          icon="cart-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={refreshing ? [] : cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          refreshing ? (
            <>
              {/* Search Bar Skeleton for Refresh */}
              <View style={styles.skeletonSearchContainer}>
                <View style={styles.skeletonSearchBar}>
                  <View style={styles.skeletonSearchIcon} />
                  <View style={styles.skeletonSearchInput} />
                  <View style={styles.skeletonClearButton} />
                </View>
              </View>
              
              <View style={styles.skeletonGrid}>
                {/* First Skeleton Item */}
                <View style={styles.skeletonCartItem}>
                  <View style={styles.skeletonItemImage}>
                    <Loader height={80} />
                  </View>
                  <View style={styles.skeletonItemContent}>
                    <View style={styles.skeletonItemName}>
                      <Loader height={20} />
                    </View>
                    <View style={styles.skeletonItemPrice}>
                      <Loader height={18} />
                    </View>
                    <View style={styles.skeletonItemActions}>
                      <View style={styles.skeletonQuantityStepper}>
                        <Loader height={40} />
                      </View>
                      <View style={styles.skeletonRemoveButton}>
                        <Loader height={40} />
                      </View>
                    </View>
                  </View>
                </View>
                {/* Second Skeleton Item */}
                <View style={styles.skeletonCartItem}>
                  <View style={styles.skeletonItemImage}>
                    <Loader height={80} />
                  </View>
                  <View style={styles.skeletonItemContent}>
                    <View style={styles.skeletonItemName}>
                      <Loader height={20} />
                    </View>
                    <View style={styles.skeletonItemPrice}>
                      <Loader height={18} />
                    </View>
                    <View style={styles.skeletonItemActions}>
                      <View style={styles.skeletonQuantityStepper}>
                        <Loader height={40} />
                      </View>
                      <View style={styles.skeletonRemoveButton}>
                        <Loader height={40} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : null
        }
      />

      {/* Promo Code Section */}
      <View style={styles.promoSection}>
        <Text style={styles.sectionTitle}>{t('promo_code')}</Text>

        <Controller
          control={control}
          name="promoCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.promoInputContainer}>
              <TextInput
                style={[
                  styles.promoInput,
                  errors.promoCode && styles.promoInputError,
                ]}
                placeholder="Enter promo code (try SAVE10)"
                placeholderTextColor={theme.colors.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!appliedPromo}
              />
              {!appliedPromo ? (
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleSubmit(onSubmitPromo)}
                >
                  <Text style={styles.applyButtonText}>{t('apply')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.removePromoButton}
                  onPress={handleRemovePromo}
                >
                  <Text style={styles.removePromoButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {errors.promoCode && (
          <Text style={styles.errorText}>{errors.promoCode.message}</Text>
        )}

        {appliedPromo && (
          <Text style={styles.promoApplied}>
            Promo code SAVE10 applied! 10% discount: -${discount.toFixed(2)}
          </Text>
        )}
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>

        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('discount')}</Text>
            <Text style={styles.summaryValueDiscount}>
              -${discount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('total')}</Text>
          <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>{t('checkout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default CartScreen;
