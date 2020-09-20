import { legacyFunction } from "./legacy-file"

const main: Function = () => {
  let legacyOutput = legacyFunction()
  if (legacyOutput == 0) console.log("the legacy function is operational")
}
