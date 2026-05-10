import * as exec from "@actions/exec";

export async function pullOciPolicies(
  uri: string
) {
  console.log(
    `📦 Pulling OCI policies: ${uri}`
  );

  await exec.exec(
    "kyverno",
    ["pull", uri]
  );
}
