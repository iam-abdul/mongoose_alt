import { Db, MongoClient } from "mongodb";
import { Collection } from "mongodb";

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

class BaseCollection<Coll> {
  private db: Db;
  private name: string;
  constructor(db: Db, name: string) {
    this.db = db;
    this.name = name;
  }

  // async find<K extends Coll>(key: DeepPartial<K>): Promise<Coll | null> {}
  find<K extends Coll>(filterCondition: DeepPartial<K>): BaseFind<Coll> {
    return new BaseFind<Coll>(filterCondition);
  }
}

class BetterGoose<DB> {
  private static URI: string;
  private static Database: string;
  private static db: Db | null;

  constructor(uri: string, database: string) {
    BetterGoose.URI = uri;
    BetterGoose.Database = database;
  }

  collection<K extends keyof DB>(name: K & string): BaseCollection<DB[K]> {
    if (!BetterGoose.db) {
      throw new Error("No db connection");
    }
    return new BaseCollection<DB[K]>(BetterGoose.db, name);
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

// class BaseFind<Coll> {
//   private filter: DeepPartial<Coll>;

//   constructor(filter: DeepPartial<Coll>) {
//     this.filter = filter;
//   }

//   someOther<T extends typeof this.filter>(key: T) {
//     return key;
//   }
// }
