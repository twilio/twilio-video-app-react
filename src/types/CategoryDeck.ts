export type TTagStore = Record<string, { value: string }>;

export type TCategoryStore = Record<
  string,
  {
    value: string;
    questions: TTagStore;
  }
>;
