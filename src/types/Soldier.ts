export type Soldier = {
  id: number;
  name: string;
  rank: string;
  unit: string;
  status: "Active" | "Wounded" | "Reserve";
  specialization: string;
  age: number;
};