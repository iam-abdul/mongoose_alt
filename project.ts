import { ZeroOrOne } from "./utils.js";
export type ProjectStage<Coll> = Record<"$project", ZeroOrOne<Coll>>;
export type ProjectOutput<T, R extends ZeroOrOne<T>> = {
  [K in keyof T as R[K] extends 1 | object ? K : never]: T[K] extends object
    ? ProjectOutput<T[K], R[K] & ZeroOrOne<T[K]>>
    : T[K];
};
