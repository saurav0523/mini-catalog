import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  onMinusClick?: () => void; // Custom handler for minus button at minimum
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 99,
  onMinusClick,
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    } else if (onMinusClick) {
      // When quantity reaches minimum, call custom handler
      onMinusClick();
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          quantity <= minQuantity && !onMinusClick && styles.buttonDisabled,
        ]}
        onPress={handleDecrease}
        disabled={quantity <= minQuantity && !onMinusClick}
      >
        <Ionicons
          name="remove"
          size={20}
          color={quantity <= minQuantity && !onMinusClick ? '#C7C7CC' : '#007AFF'}
        />
      </TouchableOpacity>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          quantity >= maxQuantity && styles.buttonDisabled,
        ]}
        onPress={handleIncrease}
        disabled={quantity >= maxQuantity}
      >
        <Ionicons
          name="add"
          size={20}
          color={quantity >= maxQuantity ? '#C7C7CC' : '#007AFF'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 4,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#F2F2F7',
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityContainer: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

export default QuantityStepper;
