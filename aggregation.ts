import { MatchStageInput } from "./match.js";
import { Pipeline } from "./pipeline.js";
import { Collection, Db } from "mongodb";
import { Prettify } from "./utils.js";
// the match stage should return what ever the collection passed to it

interface database {
  users: ITest;
}
interface ITest {
  name: string;
  email: string;
  verified: boolean;
  details: {
    city: "hyderabad" | "delhi";
    street: string;
  };
}

export class BaseAggregate<DB extends object, T> {
  private pipeline: Pipeline<T>[] = [];
  private db: Db;
  private CollectionName: string;
  constructor(db: Db, collectionName: string, initialPipeline?: Pipeline<T>[]) {
    if (initialPipeline) {
      this.pipeline = initialPipeline;
    }
    this.db = db;
    this.CollectionName = collectionName;
  }

  match(stageInput: MatchStageInput<T>) {
    return new BaseAggregate<DB, T>(this.db, this.CollectionName, [
      ...this.pipeline,
      { $match: stageInput },
    ]);
  }

  // project<R extends ZeroOrOne<T>>(stageInput: R) {
  //   const newPipeline: Pipeline<T>[] = [
  //     ...this.pipeline,
  //     { $project: stageInput },
  //   ];
  //   return new BaseAggregate<DB, ProjectOutput<T, R>>(newPipeline);
  // }

  async execute() {
    const result = await this.db
      .collection(this.CollectionName)
      .aggregate(this.pipeline)
      .toArray();

    return result as unknown as Prettify<T>[];
  }

  logPipeline() {
    console.log("the pipeline is ", this.pipeline);
  }
}

// const agg = new BaseAggregate<database, ITest>()
//   .match({ name: "abdul" })
//   .match({ email: "sir abdul" })
//   .match({ email: "sir" })
//   .match({ "details.city": "delhi" });

// agg.logPipeline();
