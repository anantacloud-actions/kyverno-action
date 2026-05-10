import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as core from "@actions/core";
import { inputs } from "./inputs";

export async function installKyverno(
  version: string
) {

  const url =
`https://github.com/kyverno/kyverno/releases/download/${version}/kyverno-cli_${version}_linux_x86_64.tar.gz`;

  console.log(
    `📥 Installing Kyverno ${version}`
  );

  const downloadPath =
    await tc.downloadTool(url);

  const extractedPath =
    await tc.extractTar(
      downloadPath
    );

  core.addPath(
    extractedPath
  );
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

  console.log(
    `⚔️ Running: kyverno ${args.join(" ")}`
  );

  let exitCode = 0;

  try {

    exitCode =
      await exec.exec(
        "kyverno",
        args,
        {
          ignoreReturnCode: true,

          listeners: {

            stdout: (
              data: Buffer
            ) => {

              output +=
                data.toString();

              process.stdout.write(
                data
              );
            },

            stderr: (
              data: Buffer
            ) => {

              output +=
                data.toString();

              process.stderr.write(
                data
              );
            }
          }
        }
      );

  } catch (err) {

    console.error(
      "Kyverno execution error"
    );

    console.error(err);
  }

  const violations =
    (
      output.match(
        /fail/gi
      ) || []
    ).length;

  console.log(
    `📊 Violations detected: ${violations}`
  );

  return {

    failed:
      violations > 0,
    violations,
    output,
    exitCode
  };
}
