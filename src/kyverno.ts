import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as core from "@actions/core";
import * as fs from "fs";
import { inputs } from "./inputs";

export async function installKyverno(
  version: string
) {
  const url =
    `https://github.com/kyverno/kyverno/releases/download/${version}/kyverno-cli_${version}_linux_x86_64.tar.gz`;

  console.log(
    `📥 Installing Kyverno ${version}`
  );

  const path =
    await tc.downloadTool(url);

  const extracted =
    await tc.extractTar(path);

  core.addPath(extracted);
}

export async function runKyverno(
  resources: string
) {
  let output = "";

  const args = [
    "apply",
    inputs.policies,
    "--resource",
    resources
  ];

  if (
    inputs.policyExceptions
  ) {
    args.push(
      "--exceptions",
      inputs.policyExceptions
    );
  }

  args.push(
    "--policy-report"
  );

  args.push(
    "--warn-exit-code",
    "0"
  );

  args.push(
    "--audit-warn"
  );

  if (
    inputs.outputFormat ===
    "sarif"
  ) {
    args.push(
      "-o",
      "sarif"
    );
  }

  const exitCode =
    await exec.exec(
      "kyverno",
      args,
      {
        listeners: {
          stdout: (
            data: Buffer
          ) => {
            output +=
              data.toString();
            process.stdout.write(
              data
            );
          }
        }
      }
    );

  const severities =
    inputs.severity
      .split(",");

  let violations =
    (
      output.match(
        /fail/gi
      ) || []
    ).length;

  return {
    failed:
      exitCode !== 0 ||
      violations > 0,

    violations,
    severities,
    output
  };
}
