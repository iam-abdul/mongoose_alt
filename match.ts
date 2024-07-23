import { DeepPartial, Prettify } from "./utils.js";
import BetterGoose from "./index.js";
export type MatchStage<Coll> = Record<"$match", MatchStageInput<Coll>>;

export type FlattenWithValues<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? U extends object
      ?
          | DeepPartial<{
              [P in `${Prefix}${string & K}`]: T[K];
            }>
          | (
              | FlattenWithValues<U, `${Prefix}${string & K}.$.`>
              | FlattenWithValues<U, `${Prefix}${string & K}.`>
              | FlattenWithValues<U, `${Prefix}${string & K}.${number}.`>
            )
      : {
          [P in `${Prefix}${string & K}`]: U extends string
            ? string extends U
              ? string | RegExp | ComparisonOperators<string | RegExp>
              : U
            : U[] | ComparisonOperators<U[]>;
        }
    : T[K] extends object
    ? FlattenWithValues<T[K], `${Prefix}${string & K}.`>
    : {
        [P in `${Prefix}${string & K}`]: T[K] extends string
          ? string extends T[K]
            ? string | RegExp
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

type MatchStageStructure<Coll> =
  | FlattenWithValues<Coll>
  | LogicalOperators<Coll>;

export type MatchStageInput<Coll> = Prettify<MatchStageStructure<Coll>>;

interface IDatabase {
  users: {
    name: string;
    verified: boolean;
    address: {
      city: "hyd" | "blr";
      pin: number;
    };
    tags: string[];
    trends: ["#nice", "#great"];
    followers: {
      name: string;
      id: number;
      verified: boolean;
    }[];
  };
}

type user = IDatabase["users"];

type flat = {};

const db = new BetterGoose<IDatabase>("some uri", "dev");

// TODO: Add followers.0.id support
const a = db
  .collection("users")
  .aggregate()
  .match({
    name: "ok",
    "followers.name": /^nice/,
    "address.pin": { $gt: 1000, $gte: 9999 },
    "address.city": { $eq: "blr" },
    "followers.id": { $in: [1, 2, 3] },
    tags: { $in: ["nice", /^sir/] },
    "followers.7.verified": false,
    $and: [
      {
        tags: { $in: ["nice"] },
      },
      {
        tags: { $nin: [/^bad/] },
      },
      {
        $or: [{}],
      },
    ],
  });

const b = db
  .collection("users")
  .aggregate()
  .match({
    $and: [
      {
        name: "abdul",
      },
      {
        "address.pin": { $gt: 5000 },
      },
      {
        $or: [
          {
            "address.city": { $eq: "blr" },
          },
        ],
      },
    ],
  });

const c = db
  .collection("users")
  .aggregate()
  .match({
    followers: [{ id: 4 }],
  });

const d = db
  .collection("users")
  .aggregate()
  .match({
    "followers.$.id": 77,
    "followers.name": "son",
  })
  .execute();
