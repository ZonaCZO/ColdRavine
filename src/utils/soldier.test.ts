import { test, expect } from "vitest";
import { canJoinOperation } from "./soldier";

test("Active soldier can join", () => {
  const soldier = {
    name: "Alex",
    active: true,
    health: 100
  };

  

  expect(canJoinOperation(soldier)).toBe(true);
});

test("Active soldier can't join", () => {
  const soldier = {
    name: "Alex",
    active: true,
    health: 50
  };

  expect(canJoinOperation(soldier)).toBe(false);
});
test("Active soldier can't join", () => {
  const soldier = {
    name: "Alex",
    active: false,
    health: 100
  };

  expect(canJoinOperation(soldier)).toBe(false);
});
test("Active soldier can't join", () => {
  const soldier = {
    name: "Alex",
    active: true,
    health: 30
  };

  expect(canJoinOperation(soldier)).toBe(false);
});