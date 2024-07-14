import { MatchStage } from "./match.js";
import { ProjectStage } from "./project.js";

export type Pipeline<Coll> = MatchStage<Coll> | ProjectStage<Coll>;
