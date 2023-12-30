import { legacyFunction } from "./legacy-file"

const main: Function = () => {
  // A comment
  let legacyOutput = legacyFunction()
  // eslint-disable-next-line eqeqeq -- FIXME this is a comment
  if (legacyOutput == 0) console.log("the legacy function is operational")
}
