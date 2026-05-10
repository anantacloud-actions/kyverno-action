import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as core from "@actions/core";

export async function installKyverno(version: string) {
  const url = `https://github.com/kyverno/kyverno/releases/download/${version}/kyverno-cli_${version}_linux_x86_64.tar.gz`;

  console.log(`📥 Installing Kyverno ${version}`);

  const path = await tc.downloadTool(url);
  const extracted = await tc.extractTar(path);

  core.addPath(extracted);
}

export async function runKyverno(inputs: any) {
  let output = "";

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
        process.stdout.write(data);
      }
    }
  };

  const args = [
    "apply",
    inputs.policies,
    "--resource",
    inputs.resources
  ];

  if (inputs.cluster) {
    args.push("--cluster");
  }

  if (inputs.outputFormat === "sarif") {
    args.push("-o", "sarif");
  }

  const exitCode = await exec.exec("kyverno", args, options);

  const violations =
    (output.match(/fail/gi) || []).length;

  return {
    failed: exitCode !== 0,
    violations,
    output
  };
}
