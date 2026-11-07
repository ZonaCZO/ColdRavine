export interface Soldier {
  name: string;
  active: boolean;
  health: number;
}

export function canJoinOperation(
  soldier: Soldier
): boolean {
  return soldier.active && soldier.health > 50;
}