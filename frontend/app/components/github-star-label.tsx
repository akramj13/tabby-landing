import { CountUp } from "./motion";

export function GithubStarLabel() {
  return <CountUp to={600} duration={1.6} suffix="+ GitHub Stars" />;
}
