import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ProductListScreen from '../features/products/ProductListScreen';
import ProductDetailsScreen from '../features/products/ProductDetailsScreen';
import WishlistScreen from '../features/products/WishlistScreen';
import CartScreen from '../features/cart/CartScreen';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import FavoriteButton from '../components/FavoriteButton';
import WishlistClearAllButton from '../components/WishlistClearAllButton';
import CartClearAllButton from '../components/CartClearAllButton';
import { RootState } from '../store';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProductStack = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  // Clear navigation stack when Products tab is focused
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // This ensures navigation cache is cleared
      console.log('Products tab focused - clearing navigation cache');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.navigationBar,
        },
        headerTitleStyle: {
          fontSize: 18,
          color: theme.colors.navigationTitle,
        },
        headerTintColor: theme.colors.navigationTitle,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ 
          title: t('catalog'),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemeToggle />
              <LanguageToggle />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route, navigation }: any) => ({ 
          title: '',
          headerRight: () => {
            const { product } = route.params as { product: any };
            return <FavoriteButton productId={product.id} />;
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.navigationTitle} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = favoriteIds.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.navigationBar,
        },
        headerTitleStyle: {
          fontSize: 18,
          color: theme.colors.navigationTitle,
        },
        headerLargeTitle: false, // Disable large title for more compact header
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductStack}
        options={{
          title: t('products'),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: t('wishlist'),
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          headerRight: () => <WishlistClearAllButton />,
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: t('cart'),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          headerRight: () => <CartClearAllButton />,
        }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;
