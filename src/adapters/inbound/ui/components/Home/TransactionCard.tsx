import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/src/domain/entities';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const iconName = isIncome ? 'arrow-up-circle' : 'arrow-down-circle';
  const amountColor = isIncome ? styles.incomeAmount : styles.expenseAmount;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isIncome ? styles.incomeIcon : styles.expenseIcon]}>
        <Ionicons name={iconName} size={24} color={isIncome ? '#34C759' : '#FF3B30'} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.name}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>

      <Text style={[styles.amount, amountColor]}>
        {transaction.formatAmount()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#E8F8EC',
  },
  expenseIcon: {
    backgroundColor: '#FFE8E6',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
    color: '#8E8E93',
  },
  separator: {
    fontSize: 13,
    color: '#8E8E93',
    marginHorizontal: 6,
  },
  date: {
    fontSize: 13,
    color: '#8E8E93',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
});
