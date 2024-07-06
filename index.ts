import { Db, MongoClient } from "mongodb";
import { Collection } from "mongodb";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
class BaseFind {}

class BaseCollection<Coll> {
  private db: Db;
  private name: string;
  constructor(db: Db, name: string) {
    this.db = db;
    this.name = name;
  }

  // async find<K extends Coll>(key: DeepPartial<K>): Promise<Coll | null> {}
  find<K extends Coll>(key: DeepPartial<K>) {}
}

class BetterGoose<DB> {
  private static URI: string;
  private static Database: string;
  private static db: Db | null;

  // async collection<K extends keyof DB & string>(key: K): Promise<Collection> {
  //   // const dbInstance = await this.getInstance();
  //   return dbInstance.collection(key);
  // }

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

class find {}

// class collection {
//   private name: string;
//   private db: Db;
//   private collection: Collection;
//   constructor(db: Db, name: keyof Coll extends string ? keyof Coll : never) {
//     this.name = name;
//     this.db = db;
//     this.collection = db.collection(this.name);
//   }
// }

// export type TCollections = Record<string, Record<string, IString | IInt>>;
