import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { fetchProducts, Product } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import LanguageToggle from '../../components/LanguageToggle';
import { useTheme } from '../../theme/ThemeContext';

const ProductListScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProductList focused - clearing navigation cache');

    });

    return unsubscribe;
  }, [navigation]);

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });


  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
    );
  }, [products, searchQuery]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const showSearchResults = searchQuery.trim().length > 0;
  const searchResultsCount = filteredProducts.length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      paddingHorizontal: 12,
      height: 40,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 8,
    },
    clearButton: {
      padding: 4,
    },
    searchResultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    searchResultsText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    clearSearchButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    clearSearchText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    listContainer: {
      padding: 16,
    },
    skeletonSearchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    skeletonSearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      paddingHorizontal: 12,
      height: 40,
    },
    skeletonSearchIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.divider,
      marginRight: 8,
    },
    skeletonSearchInput: {
      flex: 1,
      height: 16,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
    },
    skeletonClearButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.divider,
      marginLeft: 8,
    },
    skeletonGrid: {
      padding: 16,
    },
    skeletonRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    skeletonCard: {
      flex: 1,
      height: 280,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    skeletonImage: {
      height: 150,
      backgroundColor: theme.colors.divider,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    skeletonContent: {
      padding: 12,
    },
    skeletonText: {
      height: 16,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
      marginBottom: 8,
    },
    skeletonButton: {
      height: 40,
      backgroundColor: theme.colors.divider,
      borderRadius: 8,
      marginTop: 8,
    },
    row: {
      justifyContent: 'space-between',
    },
    loaderContainer: {
      flex: 1,
      padding: 16,
      gap: 16,
    },
  });

  if (isLoading || isRefetching) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.skeletonSearchContainer}>
          <View style={styles.skeletonSearchBar}>
            <View style={styles.skeletonSearchIcon} />
            <View style={styles.skeletonSearchInput} />
            <View style={styles.skeletonClearButton} />
          </View>
        </View>
        
        <View style={styles.skeletonGrid}>

          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
          </View>

          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
          </View>
      
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title={t('error')}
          message="Failed to load products. Please try again."
          icon="alert-circle-outline"
          actionText={t('retry')}
          onAction={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={() => {}} 
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showSearchResults && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            {searchResultsCount} {t('search_results_count')}
          </Text>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchText}>{t('clear_search')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={isRefetching ? [] : filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          isRefetching ? (
            <>

              <View style={styles.skeletonSearchContainer}>
                <View style={styles.skeletonSearchBar}>
                  <View style={styles.skeletonSearchIcon} />
                  <View style={styles.skeletonSearchInput} />
                  <View style={styles.skeletonClearButton} />
                </View>
              </View>
              
              <View style={styles.skeletonGrid}>

                <View style={styles.skeletonRow}>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                </View>

                <View style={styles.skeletonRow}>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                </View>

                <View style={styles.skeletonRow}>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                  <View style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonText} />
                      <View style={styles.skeletonButton} />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <EmptyState
              title={t('no_items_found')}
              message={
                showSearchResults
                  ? t('no_search_results')
                  : t('no_products_available')
              }
              icon="search-outline"
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default ProductListScreen;
