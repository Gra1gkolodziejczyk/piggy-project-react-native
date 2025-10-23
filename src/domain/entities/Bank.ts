export class Bank {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly balance: number,
    public readonly currency: string = "EUR",
    public readonly lastUpdatedAt: Date,
    public readonly createdAt: Date
  ) {}

  formatBalance(): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: this.currency,
    }).format(this.balance);
  }
}
