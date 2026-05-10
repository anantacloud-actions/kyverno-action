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
    "--policy-report",
    "-o",
    "json"
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
    "🛡️  KYVERNO GUARDIAN VALIDATION"
  );
  console.log(
    "═══════════════════════════════════════"
  );

  console.log(
    `📂 Policies: ${inputs.policies}`
  );

  console.log(
    `📦 Resources: ${resources}`
  );

  console.log(
    `⚔️ Severity Filter: ${inputs.severity}`
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

  let violations = 0;

  let parsedResults: any[] = [];

  try {

    const parsed =
      JSON.parse(output);

    parsedResults =
      parsed.results || [];

    violations =
      parsedResults.filter(
        (r: any) =>
          r.result === "fail"
      ).length;

  } catch (err) {

    console.log(
      "⚠️ Failed to parse Kyverno JSON output"
    );

    violations =
      (
        output.match(
          /result:\s+fail/gi
        ) || []
      ).length;
  }

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
    `📌 Total Violations: ${violations}`
  );

  console.log(
    `🚦 Status: ${
      violations > 0
        ? "❌ FAILED"
        : "✅ PASSED"
    }`
  );

  console.log(
    `📤 Exit Code: ${exitCode}`
  );

  console.log("");

  if (
    parsedResults.length > 0
  ) {

    console.log(
      "═══════════════════════════════════════"
    );

    console.log(
      "🔍 POLICY VIOLATIONS"
    );

    console.log(
      "═══════════════════════════════════════"
    );

    parsedResults.forEach(
      (
        result: any,
        index: number
      ) => {

        const icon =
          result.result === "fail"
            ? "❌"
            : "✅";

        console.log("");

        console.log(
`${icon} Violation #${index + 1}`
        );

        console.log(
`📜 Policy: ${
  result.policy ||
  "unknown"
}`
        );

        console.log(
`📏 Rule: ${
  result.rule ||
  "unknown"
}`
        );

        console.log(
`📦 Resource: ${
  result.resources?.[0]
    ?.kind || "unknown"
} / ${
  result.resources?.[0]
    ?.name || "unknown"
}`
        );

        console.log(
`📝 Message: ${
  result.message ||
  "No message"
}`
        );

        console.log(
`🚨 Result: ${
  result.result
}`
        );

        console.log(
          "────────────────────────────"
        );
      }
    );
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
    parsedResults,
    exitCode
  };
}
