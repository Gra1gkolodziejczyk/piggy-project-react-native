export enum IncomeType {
  SALARY = "salary",
  FREELANCE = "freelance",
  INVESTMENT = "investment",
  OTHER = "other",
}

export enum Frequency {
  ONCE = "once",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export class Income {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly type: IncomeType,
    public readonly amount: number,
    public readonly frequency: Frequency,
    public readonly isRecurring: boolean,
    public readonly nextPaymentDate: Date | null,
    public readonly isActive: boolean,
    public readonly isArchived: boolean,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly archivedAt: Date | null
  ) {}

  formatAmount(): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(this.amount);
  }

  getIcon(): string {
    return "↗️";
  }

  getColor(): string {
    return "#34C759";
  }
}
