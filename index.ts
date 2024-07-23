import { Db, MongoClient, ObjectId } from "mongodb";
import { BaseAggregate } from "./aggregation.js";

type Generated<T = ObjectId> = T | undefined;
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

class BaseFind<Coll> {
  private filter: DeepPartial<Coll>;

  constructor(filter: DeepPartial<Coll>) {
    this.filter = filter;
  }

  someOther<T extends typeof this.filter>(key: T) {
    return key;
  }
}

class BaseCollection<DB extends object, Coll> {
  private db: Db;
  private collectionName: string;
  constructor(db: Db, name: string) {
    this.db = db;
    this.collectionName = name;
  }

  find<K extends Coll>(filterCondition: DeepPartial<K>): BaseFind<Coll> {
    return new BaseFind<Coll>(filterCondition);
  }

  aggregate(): BaseAggregate<DB, Coll> {
    return new BaseAggregate<DB, Coll>(this.db, this.collectionName, []);
  }
}

class BetterGoose<DB extends object> {
  private static URI: string;
  private static Database: string;
  private static db: Db | null;

  constructor(uri: string, database: string) {
    BetterGoose.URI = uri;
    BetterGoose.Database = database;
  }

  collection<K extends keyof DB>(name: K & string): BaseCollection<DB, DB[K]> {
    if (!BetterGoose.db) {
      throw new Error("No db connection");
    }
    return new BaseCollection<DB, DB[K]>(BetterGoose.db, name);
  }

  public connect = async (): Promise<void> => {
    if (!BetterGoose.db) {
      if (!BetterGoose.URI || !BetterGoose.Database) {
        throw new Error("Please provide a valid URI and Database");
      }

      const client = new MongoClient(BetterGoose.URI);

      const connection = await client.connect();
      const db = connection.db(BetterGoose.Database);
      BetterGoose.db = db;
    }
  };
}

export default BetterGoose;

// ------------------------------------------------------

export interface IDb {
  users: {
    _id: Generated;
    name: string;
    email: string;
    verified: boolean;
    address: {
      city: "Hyderabad" | "bengaluru";
      street: string;
    };
    followers: {
      name: string;
    }[];
  };
  orders: {
    price: number;
    created_at: Date;
  };
}
const URI = "mogodb+srv://some";
const Database = "Dev";
const db = new BetterGoose<IDb>(URI, Database);

const main = async () => {
  await db.connect();

  const a = db.collection("users").find({ address: { city: "Hyderabad" } });
  const b = db
    .collection("users")
    .aggregate()
    .match({ email: "somemail.com", followers: [{ name: "new" }] })
    // .project({
    //   followers: [{ name: 1 }],
    //   _id: 0,
    //   address: { city: 0, street: 0 },
    //   email: 0,
    //   name: 0,
    //   verified: 0,
    // })
    .match({ followers: [{ name: "abdul" }] });
};
