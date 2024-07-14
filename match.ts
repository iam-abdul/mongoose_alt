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

export type MatchStageInput<Coll> = DeepPartial<
  AllowStringsAndRegex<{
    [k in FlattenKeys<Coll>]:
      | GetDatatypeDiscardArray<Coll, k>
      | GetDatatype<Coll, k>
      | { $eq: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $ne: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $gt: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $gte: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $lt: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $lte: GetDatatypeDiscardArray<Coll, k> | GetDatatype<Coll, k> }
      | { $in: GetDatatypeDiscardArray<Coll, k>[] }
      | { $nin: GetDatatypeDiscardArray<Coll, k>[] };
  }>
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
  });
