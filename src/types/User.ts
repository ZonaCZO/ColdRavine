export type User = {
  id: number;
  username: string;
  armyId: number;
  armyName: string;
  soldierId: number;
  role: "owner" | "officer" | "soldier";
  permissions: string[];
  mustChangePassword: boolean;
};
