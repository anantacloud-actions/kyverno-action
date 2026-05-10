import * as core from "@actions/core";

export async function generateStepSummary(
  results: any
) {
  await core.summary
    .addHeading(
      "🛡️ Kyverno Guardian Report"
    )
    .addTable([
      [
        {
          data:
            "Violations",
          header: true
        },
        String(
          results.violations
        )
      ],
      [
        {
          data:
            "Status",
          header: true
        },
        results.failed
          ? "❌ FAILED"
          : "✅ PASSED"
      ]
    ])
    .addCodeBlock(
      results.output
    )
    .write();
}
