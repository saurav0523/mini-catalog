import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from '../cartSlice';

describe('cartSlice', () => {
  const initialState = {
    items: [],
    total: 0,
  };

  const mockProduct: CartItem = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: 'test-image.jpg',
    quantity: 1,
  };

  const mockProduct2: CartItem = {
    id: '2',
    name: 'Test Product 2',
    price: 19.99,
    image: 'test-image-2.jpg',
    quantity: 1,
  };

  describe('addToCart', () => {
    it('should add a new product to cart', () => {
      const action = addToCart(mockProduct);
      const newState = cartReducer(initialState, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockProduct);
      expect(newState.total).toBe(29.99);
    });

    it('should increase quantity if product already exists', () => {
      const stateWithProduct = {
        items: [mockProduct],
        total: 29.99,
      };

      const action = addToCart({ ...mockProduct, quantity: 2 });
      const newState = cartReducer(stateWithProduct, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(3);
      expect(newState.total).toBe(89.97); // 29.99 * 3
    });

    it('should calculate total correctly for multiple products', () => {
      const action1 = addToCart(mockProduct);
      const action2 = addToCart(mockProduct2);

      let state = cartReducer(initialState, action1);
      state = cartReducer(state, action2);

      expect(state.items).toHaveLength(2);
      expect(state.total).toBe(49.98); // 29.99 + 19.99
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const stateWithProducts = {
        items: [mockProduct, mockProduct2],
        total: 49.98,
      };

      const action = removeFromCart('1');
      const newState = cartReducer(stateWithProducts, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe('2');
      expect(newState.total).toBe(19.99);
    });

    it('should handle removing non-existent product', () => {
      const stateWithProduct = {
        items: [mockProduct],
        total: 29.99,
      };

      const action = removeFromCart('999');
      const newState = cartReducer(stateWithProduct, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.total).toBe(29.99);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const stateWithProduct = {
        items: [mockProduct],
        total: 29.99,
      };

      const action = updateQuantity({ id: '1', quantity: 3 });
      const newState = cartReducer(stateWithProduct, action);

      expect(newState.items[0].quantity).toBe(3);
      expect(newState.total).toBe(89.97); // 29.99 * 3
    });

    it('should remove product when quantity is 0', () => {
      const stateWithProduct = {
        items: [mockProduct],
        total: 29.99,
      };

      const action = updateQuantity({ id: '1', quantity: 0 });
      const newState = cartReducer(stateWithProduct, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.total).toBe(0);
    });

    it('should handle negative quantity', () => {
      const stateWithProduct = {
        items: [mockProduct],
        total: 29.99,
      };

      const action = updateQuantity({ id: '1', quantity: -1 });
      const newState = cartReducer(stateWithProduct, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.total).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const stateWithProducts = {
        items: [mockProduct, mockProduct2],
        total: 49.98,
      };

      const action = clearCart();
      const newState = cartReducer(stateWithProducts, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.total).toBe(0);
    });
  });
});
