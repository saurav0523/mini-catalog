import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../ProductCard';
import cartReducer from '../../features/cart/cartSlice';
import favoritesReducer from '../../features/products/favoritesSlice';

const mockStore = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  description: 'Test description',
  image: 'test-image.jpg',
  category: 'Electronics',
  rating: 4.5,
  reviews: 100,
};

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <ProductCard product={mockProduct} onPress={() => {}} />
      </Provider>
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$29.99')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
  });

  it('should call onPress when product is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <ProductCard product={mockProduct} onPress={mockOnPress} />
      </Provider>
    );

    const productCard = getByTestId('product-card');
    fireEvent.press(productCard);

    expect(mockOnPress).toHaveBeenCalledWith(mockProduct);
  });
});
