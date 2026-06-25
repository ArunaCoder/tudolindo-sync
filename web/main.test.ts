import { describe, expect, it } from "vitest";
import {
  filterEntries,
  formatDate,
  formatMonth,
  type Observer,
  sortByRecordedAtDesc,
  uniqueMonths,
} from "./main.js";

const sample: Observer[] = [
  {
    recording_id: 1,
    recorded_at: "2026-05-10T09:00:00",
    title: "Reunião de abril",
    id: "abc",
  },
  {
    recording_id: 2,
    recorded_at: "2026-06-25T14:30:00",
    title: "Workshop de junho",
    id: "xyz",
  },
  {
    recording_id: 12,
    recorded_at: "2026-06-01T08:00:00",
    title: "Daily",
    id: "def",
  },
];

describe("sortByRecordedAtDesc", () => {
  it("ordena por recorded_at descendente", () => {
    const sorted = sortByRecordedAtDesc(sample);
    expect(sorted.map((e) => e.recording_id)).toEqual([2, 12, 1]);
  });

  it("não muta a lista original", () => {
    const copy = [...sample];
    sortByRecordedAtDesc(sample);
    expect(sample).toEqual(copy);
  });
});

describe("filterEntries", () => {
  const noFilter = { text: "", rid: "", month: "" };

  it("sem filtros devolve tudo", () => {
    expect(filterEntries(sample, noFilter)).toHaveLength(3);
  });

  it("filtra por mês (YYYY-MM)", () => {
    const result = filterEntries(sample, { ...noFilter, month: "2026-06" });
    expect(result.map((e) => e.recording_id)).toEqual([2, 12]);
  });

  it("filtra por substring do recording_id", () => {
    const result = filterEntries(sample, { ...noFilter, rid: "1" });
    expect(result.map((e) => e.recording_id)).toEqual([1, 12]);
  });

  it("filtra por texto no título (case-insensitive)", () => {
    const result = filterEntries(sample, { ...noFilter, text: "JUNHO" });
    expect(result.map((e) => e.recording_id)).toEqual([2]);
  });

  it("filtra por texto no id", () => {
    const result = filterEntries(sample, { ...noFilter, text: "xyz" });
    expect(result.map((e) => e.recording_id)).toEqual([2]);
  });
});

describe("uniqueMonths", () => {
  it("devolve meses distintos, mais recente primeiro", () => {
    expect(uniqueMonths(sample)).toEqual(["2026-06", "2026-05"]);
  });
});

describe("formatDate / formatMonth", () => {
  it("formata data ISO como dd/mm/aaaa", () => {
    expect(formatDate("2026-06-25T14:30:00")).toBe("25/06/2026");
  });

  it("devolve a entrada original para data inválida", () => {
    expect(formatDate("não-é-data")).toBe("Invalid Date");
  });

  it("formata mês YYYY-MM em pt-BR", () => {
    expect(formatMonth("2026-06").toLowerCase()).toContain("junho");
    expect(formatMonth("2026-06")).toContain("2026");
  });
});
