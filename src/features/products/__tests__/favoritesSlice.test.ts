import favoritesReducer, {
  toggleFavorite,
  clearFavorites,
} from '../favoritesSlice';

interface FavoritesState {
  favoriteIds: string[];
}

describe('favoritesSlice', () => {
  const initialState: FavoritesState = {
    favoriteIds: [],
  };

  describe('toggleFavorite', () => {
    it('should add a product to favorites', () => {
      const action = toggleFavorite('product-1');
      const newState = favoritesReducer(initialState, action);

      expect(newState.favoriteIds).toHaveLength(1);
      expect(newState.favoriteIds).toContain('product-1');
    });

    it('should remove a product from favorites if already favorited', () => {
      const stateWithFavorites: FavoritesState = {
        favoriteIds: ['product-1', 'product-2'],
      };

      const action = toggleFavorite('product-1');
      const newState = favoritesReducer(stateWithFavorites, action);

      expect(newState.favoriteIds).toHaveLength(1);
      expect(newState.favoriteIds).toContain('product-2');
      expect(newState.favoriteIds).not.toContain('product-1');
    });

    it('should handle multiple products correctly', () => {
      let state = favoritesReducer(initialState, toggleFavorite('product-1'));
      state = favoritesReducer(state, toggleFavorite('product-2'));
      state = favoritesReducer(state, toggleFavorite('product-3'));

      expect(state.favoriteIds).toHaveLength(3);
      expect(state.favoriteIds).toContain('product-1');
      expect(state.favoriteIds).toContain('product-2');
      expect(state.favoriteIds).toContain('product-3');
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorites', () => {
      const stateWithFavorites: FavoritesState = {
        favoriteIds: ['product-1', 'product-2', 'product-3'],
      };

      const action = clearFavorites();
      const newState = favoritesReducer(stateWithFavorites, action);

      expect(newState.favoriteIds).toHaveLength(0);
    });

    it('should handle clearing empty favorites', () => {
      const action = clearFavorites();
      const newState = favoritesReducer(initialState, action);

      expect(newState.favoriteIds).toHaveLength(0);
    });
  });
});
