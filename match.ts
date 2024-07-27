import { DeepPartial, Prettify } from "./utils.js";
import BetterGoose from "./index.js";
import { XOR } from "ts-xor";
import { XOR_6 } from "./utils.js";

export type MatchStage<Coll> = Record<"$match", MatchStageInput<Coll>>;

type objectInsideArray<Prefix extends string, K, U> =
  | FlattenWithValues<
      U,
      `${Prefix}${string & K}.$.` | `${Prefix}${string & K}.${number}.`
    >
  | FlattenWithValues<U, `${Prefix}${string & K}.`>
  | {
      [Q in `${Prefix}${string & K}`]?: XOR_6<
        arraySize,
        XOR_6<
          elemMatch<U>,
          XOR_6<ComparisonOperators<U>, ComparisonOperators<U[]>>
        >
      >;
    };

// type primitivesInsideArray<Prefix extends string, K, U> = {
//   [P in `${Prefix}${string & K}`]: U extends string
//     ? string extends U
//       ?
//           | string
//           | RegExp
//           | ComparisonOperators<U>
//           | ComparisonOperators<U[]>
//           | elemMatch<U>
//           | arraySize
//           | U[]
//       : U
//     : U[] | ComparisonOperators<U> | arraySize;
// };

type primitivesInsideArray<Prefix extends string, K, U> = {
  [P in `${Prefix}${string & K}`]: U extends string
    ? string extends U
      ? XOR_6<
          string | RegExp,
          XOR_6<
            arraySize,
            XOR_6<
              elemMatch<U>,
              XOR_6<
                elemMatch<U[]>,
                XOR_6<ComparisonOperators<U>, ComparisonOperators<U[]>>
              >
            >
          >
        >
      : U
    : U[] | ComparisonOperators<U> | arraySize;
};

type justObjects<Prefix extends string, K, T> =
  | FlattenWithValues<T, `${Prefix}${string & K}.`>
  | { [H in `${Prefix}${string & K}`]: T };

export type FlattenWithValues<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? U extends object
      ? /**
         * This part is for array of objects
         */
        objectInsideArray<Prefix, K, U>
      : /**
         * This part is for array of primitives
         */
        primitivesInsideArray<Prefix, K, U>
    : T[K] extends object
    ? /**
       * This part is for objects
       */
      justObjects<Prefix, K, T[K]>
    : {
        [P in `${Prefix}${string & K}`]: T[K] extends string
          ? string extends T[K]
            ? // this is for non enum strings
              string | RegExp | ComparisonOperators<string | RegExp>
            : T[K] | ComparisonOperators<T[K]>
          : T[K] | ComparisonOperators<T[K]>;
      };
}[keyof T];

// LHS for match stage is flatten keys
// RHS for match stage
/**
 * #1. Equality matches
 * Simple equality: { field: value }
 * Multiple field equality: { field1: value1, field2: value2 }
 */

/**
 * #2. Comparison Operators:
 * $eq: Equal to
 * $ne: Not equal to
 * $gt: Greater than
 * $gte: Greater than or equal to
 * $lt: Less than
 * $lte: Less than or equal to
 * $in: In an array
 * $nin: Not in an array
 */

type ComparisonOperators<T> = {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
};

/**
 * #3. Logical query operators
 * $and
 * $or
 * $not
 * $nor
 */

type LogicalOperators<Coll> = {
  $and?: MatchStageStructure<Coll>[];
  $or?: MatchStageStructure<Coll>[];
  $not?: MatchStageStructure<Coll>;
  $nor?: MatchStageStructure<Coll>[];
};

/**
 * $size operator is used when result is of type array
 */

type arraySize = Record<"$size", number>;

/**
 * $elemMatch operator can only used on any array fields
 */

type elemMatch<T> = { $elemMatch: MatchStageStructure<T> };

type MatchStageStructure<Coll> =
  | FlattenWithValues<Coll>
  | LogicalOperators<Coll>;

export type MatchStageInput<Coll> = Prettify<MatchStageStructure<Coll>>;
