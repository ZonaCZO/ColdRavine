export type Operation = {
  id: number;
  name: string;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
};

export type StatusFilter = "All" | Operation["status"];

export type PriorityFilter = "All" | Operation["priority"];

