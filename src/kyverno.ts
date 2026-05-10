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
    `📥 Installing Kyverno CLI ${version}`
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

  console.log(
    "✅ Kyverno CLI Installed"
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
    resources,
    "--policy-report"
  ];

  if (
    inputs.policyExceptions
  ) {

    args.push(
      "--exceptions",
      inputs.policyExceptions
    );
  }

  console.log("");
  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    "🛡️ KYVERNO GUARDIAN VALIDATION"
  );

  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    `📂 Policies : ${inputs.policies}`
  );

  console.log(
    `📦 Resources: ${resources}`
  );

  console.log(
    `🚨 Severity : ${inputs.severity}`
  );

  console.log("");

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
            },

            stderr: (
              data: Buffer
            ) => {

              output +=
                data.toString();
            }
          }
        }
      );

  } catch (err) {

    console.error(
      "❌ Kyverno execution failed"
    );

    console.error(err);
  }

  const violations =
    (
      output.match(
        /result:\s+fail/gi
      ) || []
    ).length;

  console.log("");

  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    "📊 VALIDATION SUMMARY"
  );

  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    `📌 Violations : ${violations}`
  );

  console.log(
`🚦 Status     : ${
  violations > 0
    ? "❌ FAILED"
    : "✅ PASSED"
}`
  );

  console.log(
    `📤 Exit Code : ${exitCode}`
  );

  console.log("");

  if (violations > 0) {

    console.log(
      "═══════════════════════════════════════"
    );

    console.log(
      "🔍 POLICY VIOLATIONS"
    );

    console.log(
      "═══════════════════════════════════════"
    );

    const lines =
      output.split("\n");

    let currentBlock: string[] = [];

    for (
      const line of lines
    ) {

      if (
        line.includes(
          "result: fail"
        )
      ) {

        currentBlock.push(line);

        console.log("");

        currentBlock.forEach(
          (l) =>
            console.log(
              `   ${l}`
            )
        );

        console.log(
          "────────────────────────────"
        );

        currentBlock = [];

      } else {

        currentBlock.push(line);
      }
    }
  }

  console.log("");

  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    violations > 0
      ? "❌ POLICY VIOLATIONS DETECTED"
      : "✅ ALL POLICIES PASSED"
  );

  console.log(
    "═══════════════════════════════════════"
  );

  console.log("");

  return {
    failed:
      violations > 0,

    violations,
    output,
    exitCode
  };
}
