type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type FilterStringKeys<T> = {
  [K in keyof T]: K extends string ? K : never;
}[keyof T];

interface Test {
  name: string;
  email: string;
}

// the match stage should return what ever the collection passed to it
type MatchStage<Coll> = Record<"$match", DeepPartial<Coll>>;
type ProjectStage<Coll> = Record<"$project", Record<keyof Coll, 0 | 1>>;

type Pipeline<Coll> = MatchStage<Coll> | ProjectStage<Coll>;

interface ITest {
  name: string;
  email: string;
  verified: boolean;
}

class BaseAggregate<T> {
  private pipeline: Pipeline<T>[] = [];
  constructor(initialPipeline?: typeof this.pipeline) {
    if (initialPipeline) {
      this.pipeline = initialPipeline;
    }
  }

  match(stageInput: DeepPartial<T>) {
    return new BaseAggregate<T>([...this.pipeline, { $match: stageInput }]);
  }

  projectActual<R extends Record<keyof T, 0 | 1>>(stageInput: R) {
    type Output = {
      [K in keyof T as R[K] extends 1 ? K : never]: T[K];
    };

    return new BaseAggregate<Output>([
      ...this.pipeline,
      { $project: stageInput },
    ]);
  }

  logPipeline() {
    console.log("the pipeline is ", this.pipeline);
  }
}

const agg = new BaseAggregate<Test>()
  .match({ name: "abdul" })
  .match({ email: "sir abdul" })
  // .project({ email: "abd@mail.com", newProperty: "something", something: true })
  .match({ email: "sir" })
  // .project({});
  .projectActual({ email: 0, name: 1 })
  .match({ name: "hai" });

agg.logPipeline();
