export type Operation = {
  id: number;
  name: string;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
};

