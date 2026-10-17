export type Soldier = {
  id: number;
  name: string;
  rank: string;
  unit: string;
  unitId?: number | null;
  status: "Active" | "Wounded" | "Reserve";
  specialization: string;
  age: number;
  bio?: string;
};
