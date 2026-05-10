import * as exec from "@actions/exec";

export async function runPolicyDiff() {

  console.log(
    "🔍 Running policy diff mode"
  );

  await exec.exec("git", [
    "diff",
    "--name-only",
    "HEAD~1"
  ]);
}
