export type Unit = {
  id: number;
  name: string;
  commander : number | null;
  specialization: string;
  status: "Active" | "Reserve";
};
