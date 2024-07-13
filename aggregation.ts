type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type ZeroOrOne<T> = {
  [k in keyof T]: T[k] extends object ? ZeroOrOne<T[k]> : 0 | 1;
};

type ProjectOutput<T, R extends ZeroOrOne<T>> = {
  [K in keyof T as R[K] extends 1 | object ? K : never]: T[K] extends object
    ? ProjectOutput<T[K], R[K] & ZeroOrOne<T[K]>>
    : T[K];
};

// the match stage should return what ever the collection passed to it
type MatchStage<Coll> = Record<"$match", DeepPartial<Coll>>;
type ProjectStage<Coll> = Record<"$project", ZeroOrOne<Coll>>;

type Pipeline<Coll> = MatchStage<Coll> | ProjectStage<Coll>;

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
  constructor(initialPipeline?: typeof this.pipeline) {
    if (initialPipeline) {
      this.pipeline = initialPipeline;
    }
  }

  match(stageInput: DeepPartial<T>) {
    return new BaseAggregate<DB, T>([...this.pipeline, { $match: stageInput }]);
  }

  project<R extends ZeroOrOne<T>>(stageInput: R) {
    const newPipeline: Pipeline<T>[] = [
      ...this.pipeline,
      { $project: stageInput },
    ];
    return new BaseAggregate<DB, ProjectOutput<T, R>>(newPipeline);
  }

  logPipeline() {
    console.log("the pipeline is ", this.pipeline);
  }
}

const agg = new BaseAggregate<database, ITest>()
  .match({ name: "abdul" })
  .match({ email: "sir abdul" })
  .match({ email: "sir" })
  .project({
    email: 0,
    name: 1,
    details: { city: 1, street: 1 },
    verified: 1,
  })
  .match({ details: { street: "nice", city: "delhi" } });

agg.logPipeline();
