import { MatchStageInput } from "./match.js";
import { Pipeline } from "./pipeline.js";
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
  constructor(initialPipeline?: typeof this.pipeline) {
    if (initialPipeline) {
      this.pipeline = initialPipeline;
    }
  }

  match(stageInput: MatchStageInput<T>) {
    return new BaseAggregate<DB, T>([...this.pipeline, { $match: stageInput }]);
  }

  // project<R extends ZeroOrOne<T>>(stageInput: R) {
  //   const newPipeline: Pipeline<T>[] = [
  //     ...this.pipeline,
  //     { $project: stageInput },
  //   ];
  //   return new BaseAggregate<DB, ProjectOutput<T, R>>(newPipeline);
  // }

  logPipeline() {
    console.log("the pipeline is ", this.pipeline);
  }
}

const agg = new BaseAggregate<database, ITest>()
  .match({ name: "abdul" })
  .match({ email: "sir abdul" })
  .match({ email: "sir" })
  .match({ "details.city": /^nice/ });

agg.logPipeline();
