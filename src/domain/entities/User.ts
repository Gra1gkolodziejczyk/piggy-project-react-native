export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  getDisplayName(): string {
    return this.name;
  }

  getInitials(): string {
    return this.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}

export class AuthTokens {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {}
}
