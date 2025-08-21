import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';
import { clearCart } from '../features/cart/cartSlice';

const CartClearAllButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    Alert.alert(
      t('clear_cart'),
      t('clear_cart_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear_all'),
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  };

  // Don't show button if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      <Text style={styles.clearButtonText}>{t('clear_all')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default CartClearAllButton;
