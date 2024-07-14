import {
  DeepPartial,
  FlattenKeys,
  GetDatatype,
  GetDatatypeDiscardArray,
  AllowStringsAndRegex,
} from "./utils.js";
import BetterGoose from "./index.js";
export type MatchStage<Coll> = Record<"$match", MatchStageInput<Coll>>;

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

type FieldValue<T> = T | ComparisonOperators<T>;

type GetFieldType<Coll, K extends string> =
  | GetDatatypeDiscardArray<Coll, K>
  | GetDatatype<Coll, K>;

type MatchStageStructure<Coll> = {
  [K in FlattenKeys<Coll>]: FieldValue<GetFieldType<Coll, K>>;
};

export type MatchStageInput<Coll> = DeepPartial<
  AllowStringsAndRegex<MatchStageStructure<Coll>>
>;

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
const db = new BetterGoose<IDatabase>("some uri", "dev");

const a = db
  .collection("users")
  .aggregate()
  .match({
    name: { $eq: "nice" },
    "followers.name": /^nice/,
    "address.pin": { $gt: 1000, $gte: 9999 },
    "address.city": { $eq: "blr" },
    "followers.id": { $in: [1, 2, 3] },
    tags: { $in: ["abd", /^nice/] },
  });
