import type { MediaDiaryState } from "@/types";

export interface ListState {
  [key: string]: MediaDiaryState;
}

export interface SortType {
  type: "addedDate" | "rating" | "diaryDate";
  sort: "asc" | "desc";
}

export interface SortOptions {
  options: SortType["type"];
  onChange: (val: SortType) => void;
}

export type ViewType = "list" | "grid";
export interface ViewOptions {
  options: ViewType;
  onChange: (val: ViewType) => void;
}
