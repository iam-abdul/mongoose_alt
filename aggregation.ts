import { IDb } from "./test/rough.js";
import { DeepPartial } from "./index.js";

interface Test {
  name: string;
  email: string;
}

// the match stage should return what ever the collection passed to it
type MatchStageInput<Coll> = Record<"$match", DeepPartial<Coll>>;

type ProjectStageInput<Coll> = Record<"$project", DeepPartial<Coll>>;

type Pipeline<Coll> = MatchStageInput<Coll> | ProjectStageInput<Coll>;

// the project stage should return only the filters passed to it

// class BaseMatch<Coll> {
//   private condition: MatchStageInput<Coll>;
//   constructor(condition: MatchStageInput<Coll>, pipeline: Pipeline<Coll>) {
//     this.condition = condition;
//   }
// }

class BaseAggregate<Coll> {
  private pipeline: Pipeline<Coll>[] = [];
  constructor(initialPipeline?: typeof this.pipeline) {
    if (initialPipeline) {
      this.pipeline = initialPipeline;
    }
  }

  match(stageInput: DeepPartial<Coll>) {
    return new BaseAggregate<Coll>([...this.pipeline, { $match: stageInput }]);
  }

  project(stageInput: DeepPartial<Coll>) {
    return new BaseAggregate<Coll>([
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
  .project({ name: "one" });

agg.logPipeline();
