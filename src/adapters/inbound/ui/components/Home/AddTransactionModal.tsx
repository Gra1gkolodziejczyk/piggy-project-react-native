import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { TransactionType } from "@/src/domain/entities";
import { Ionicons } from "@expo/vector-icons";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    amount: number,
    type: TransactionType,
    category: string,
    frequency: "once" | "weekly" | "monthly" | "yearly",
    isRecurring: boolean,
    nextPaymentDate?: Date,
    description?: string
  ) => Promise<void>;
}

const INCOME_TYPES = {
  salary: "Salaire",
  freelance: "Freelance",
  investment: "Investissement",
  other: "Autre",
};

const EXPENSE_CATEGORIES = {
  groceries: "Alimentation",
  transport: "Transport",
  housing: "Logement",
  entertainment: "Loisirs",
  health: "Santé",
  other: "Autre",
};

const FREQUENCIES = {
  once: "Une fois",
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
  yearly: "Annuel",
};

export default function AddTransactionModal({
  visible,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [frequency, setFrequency] = useState<
    "once" | "weekly" | "monthly" | "yearly"
  >("once");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories =
    type === TransactionType.INCOME ? INCOME_TYPES : EXPENSE_CATEGORIES;

  const namePlaceholder =
    type === TransactionType.INCOME ? "Ex: Salaire mensuel" : "Ex: Courses";

  const getNextPaymentDate = (): Date | undefined => {
    if (!isRecurring) return undefined;

    const now = new Date();
    const nextDate = new Date(now);

    switch (frequency) {
      case "weekly":
        nextDate.setDate(now.getDate() + 7);
        break;
      case "monthly":
        nextDate.setMonth(now.getMonth() + 1);
        break;
      case "yearly":
        nextDate.setFullYear(now.getFullYear() + 1);
        break;
      case "once":
      default:
        nextDate.setMonth(now.getMonth() + 1);
        break;
    }

    nextDate.setUTCHours(0, 0, 0, 0);

    return nextDate;
  };

  const handleRecurringToggle = (value: boolean) => {
    setIsRecurring(value);
    if (value && frequency === "once") {
      setFrequency("monthly");
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Erreur", "Veuillez sélectionner une catégorie");
      return;
    }

    if (isRecurring && frequency === "once") {
      Alert.alert(
        "Erreur",
        'Une transaction récurrente ne peut pas être "Une fois"'
      );
      return;
    }

    setIsLoading(true);
    try {
      const nextPaymentDate = getNextPaymentDate();

      await onSubmit(
        name.trim(),
        parseFloat(amount),
        type,
        selectedCategory,
        frequency,
        isRecurring,
        nextPaymentDate,
        description.trim() || undefined
      );

      setName("");
      setAmount("");
      setDescription("");
      setSelectedCategory("");
      setFrequency("once");
      setIsRecurring(false);
      onClose();

      Alert.alert("Succès", "Transaction ajoutée avec succès");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter la transaction";
      Alert.alert("Erreur", errorMessage);
      console.error("❌ Erreur soumission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setAmount("");
      setDescription("");
      setSelectedCategory("");
      setFrequency("once");
      setIsRecurring(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Nouvelle transaction</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === TransactionType.EXPENSE && styles.typeButtonActive,
                ]}
                onPress={() => {
                  setType(TransactionType.EXPENSE);
                  setSelectedCategory("");
                }}
                disabled={isLoading}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={24}
                  color={
                    type === TransactionType.EXPENSE ? "#FFFFFF" : "#FF3B30"
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === TransactionType.EXPENSE &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Dépense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === TransactionType.INCOME &&
                    styles.typeButtonActiveIncome,
                ]}
                onPress={() => {
                  setType(TransactionType.INCOME);
                  setSelectedCategory("");
                }}
                disabled={isLoading}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={24}
                  color={
                    type === TransactionType.INCOME ? "#FFFFFF" : "#34C759"
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === TransactionType.INCOME &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Revenu
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom <Text style={styles.red}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder={namePlaceholder}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Montant (€) <Text style={styles.red}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Catégorie <Text style={styles.red}>*</Text></Text>
              <View style={styles.categoriesGrid}>
                {Object.entries(categories).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryButton,
                      selectedCategory === key && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(key)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === key &&
                          styles.categoryButtonTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.label}>Transaction récurrente</Text>
                {isRecurring && (
                  <Text style={styles.helperText}>
                    Prochain paiement calculé automatiquement
                  </Text>
                )}
              </View>
              <Switch
                value={isRecurring}
                onValueChange={handleRecurringToggle}
                disabled={isLoading}
                trackColor={{ false: "#E0E0E0", true: "#34C759" }}
                thumbColor={isRecurring ? "#FFFFFF" : "#F4F3F4"}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fréquence <Text style={styles.red}>*</Text></Text>
              <View style={styles.categoriesGrid}>
                {Object.entries(FREQUENCIES).map(([key, label]) => {
                  const isDisabled = isRecurring && key === "once";

                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categoryButton,
                        frequency === key && styles.categoryButtonActive,
                        isDisabled && styles.categoryButtonDisabled,
                      ]}
                      onPress={() => setFrequency(key as any)}
                      disabled={isLoading || isDisabled}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          frequency === key && styles.categoryButtonTextActive,
                          isDisabled && styles.categoryButtonTextDisabled,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {isRecurring && (
                <Text style={styles.warningText}>
                  ⚠️ Une transaction récurrente doit être hebdomadaire,
                  mensuelle ou annuelle
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={namePlaceholder}
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  content: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F2F2F7",
    backgroundColor: "#FFFFFF",
  },
  typeButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  typeButtonActiveIncome: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#000000",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  submitButton: {
    margin: 20,
    height: 56,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  categoryButtonDisabled: {
    opacity: 0.3,
  },
  categoryButtonTextDisabled: {
    color: "#C7C7CC",
  },
  warningText: {
    fontSize: 12,
    color: "#FF9500",
    marginTop: 8,
  },
  red: {
    color: "#FF3B30",
  }
});
