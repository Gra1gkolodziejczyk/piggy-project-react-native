import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../../hooks';
import TransactionCard from '../../components/Home/TransactionCard';
import AddTransactionModal from '../../components/Home/AddTransactionModal';

export default function HomeScreen() {
  const {
    bankAccount,
    transactions,
    monthlyStats,
    isLoading,
    isRefreshing,
    refresh,
    addTransaction,
  } = useFinance();

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde total</Text>
          <Text style={styles.balanceAmount}>
            {bankAccount?.formatBalance() || '0,00 €'}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailItem}>
              <Ionicons name="arrow-up-circle" size={20} color="#34C759" />
              <Text style={styles.balanceDetailLabel}>Revenus</Text>
              <Text style={[styles.balanceDetailAmount, styles.incomeColor]}>
                +{monthlyStats.incomes.toFixed(2)} €
              </Text>
            </View>
            <View style={styles.balanceDetailItem}>
              <Ionicons name="arrow-down-circle" size={20} color="#FF3B30" />
              <Text style={styles.balanceDetailLabel}>Dépenses</Text>
              <Text style={[styles.balanceDetailAmount, styles.expenseColor]}>
                -{monthlyStats.expenses.toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>Aucune transaction</Text>
              <Text style={styles.emptyStateSubtext}>
                Commencez par ajouter une transaction
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={addTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceDetailLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceDetailAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  incomeColor: {
    color: '#34C759',
  },
  expenseColor: {
    color: '#FF3B30',
  },
  transactionsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  transactionsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
