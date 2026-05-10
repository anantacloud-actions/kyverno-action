import * as exec from "@actions/exec";
import * as fs from "fs";

export async function buildKustomize(
  path: string
): Promise<string> {

  const output =
    "rendered-kustomize.yaml";

  let yaml = "";

  await exec.exec(
    "kubectl",
    ["kustomize", path],
    {
      listeners: {
        stdout: (data: Buffer) => {
          yaml += data.toString();
        }
      }
    }
  );

  fs.writeFileSync(output, yaml);

  return output;
}
