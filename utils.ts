import { ObjectId } from "mongodb";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type ZeroOrOne<T> = {
  [k in keyof T]: T[k] extends object ? ZeroOrOne<T[k]> : 0 | 1;
};

export type FlattenKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? U extends object
      ? FlattenKeys<U, `${Prefix}${K & string}.`>
      : `${Prefix}${K & string}`
    : T[K] extends object
    ? FlattenKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type ComparisonOperators<T> = {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $all?: T[];
  $nin?: T[];
};

export type GetDatatype<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer F}.${infer R}`
  ? F extends keyof T
    ? T[F] extends (infer U)[]
      ? GetDatatype<U, R>
      : GetDatatype<T[F], R>
    : never
  : never;

export type GetDatatypeDiscardArray<T, K extends string> = K extends keyof T
  ? T[K] extends (infer U)[]
    ? U
    : T[K]
  : K extends `${infer F}.${infer R}`
  ? F extends keyof T
    ? T[F] extends (infer U)[]
      ? GetDatatypeDiscardArray<U, R>
      : GetDatatypeDiscardArray<T[F], R>
    : never
  : never;

export type Generated<T = ObjectId> = T | undefined;

export type IfStringAllowRegexToo<T> = T extends string ? T | RegExp : T;
// export type AllowStringsAndRegex<T> = T extends (infer U)[]
//   ? AllowStringsAndRegex<U>[]
//   : T extends object
//   ? { [K in keyof T]: AllowStringsAndRegex<T[K]> }
//   : T extends string
//   ? string | RegExp
//   : T;

type LiteralString<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

export type AllowStringsAndRegex<T> = T extends (infer U)[]
  ? AllowStringsAndRegex<U>[]
  : T extends object
  ? { [K in keyof T]: AllowStringsAndRegex<T[K]> }
  : T extends string
  ? LiteralString<T> extends never
    ? string | RegExp
    : T
  : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
