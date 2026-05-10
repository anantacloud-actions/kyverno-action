import * as core from "@actions/core";
import { inputs } from "./inputs";
import {
  installKyverno,
  runKyverno
} from "./kyverno";
import {
  buildHelmTemplates
} from "./helm";
import {
  buildKustomize
} from "./kustomize";
import {
  pullOciPolicies
} from "./oci";
import {
  restoreKyvernoCache
} from "./cache";
import {
  runPolicyDiff
} from "./diff";
import {
  generateSarif
} from "./sarif";
import {
  generateJUnit
} from "./junit";
import {
  createPRComment
} from "./github";
import {
  generateStepSummary
} from "./summary";
import {
  sendNotifications
} from "./notifications";

async function run() {

  try {

    console.log(
      "🛡️ Kyverno Guardian Started"
    );

    console.log(
      "📦 Restoring Kyverno cache"
    );

    await restoreKyvernoCache(
      inputs.kyvernoVersion
    );

    console.log(
      "⬇️ Installing Kyverno CLI"
    );

    await installKyverno(
      inputs.kyvernoVersion
    );

    if (
      inputs.policies.startsWith(
        "oci://"
      )
    ) {

      console.log(
        "📦 Pulling OCI policy bundle"
      );

      await pullOciPolicies(
        inputs.policies
      );
    }

    let targetResources =
      inputs.resources;

    if (
      inputs.helmChart
    ) {

      console.log(
        "⛵ Rendering Helm templates"
      );

      targetResources =
        await buildHelmTemplates(
          inputs.helmChart,
          inputs.helmValues
        );
    }

    if (
      inputs.kustomizePath
    ) {

      console.log(
        "🏗️ Rendering Kustomize manifests"
      );

      targetResources =
        await buildKustomize(
          inputs.kustomizePath
        );
    }

    if (
      inputs.diffMode
    ) {

      console.log(
        "🔍 Running policy diff mode"
      );

      await runPolicyDiff();
    }

    console.log(
      "⚔️ Running Kyverno validation"
    );

    const results =
      await runKyverno(
        targetResources
      );

    console.log(
      `📊 Violations: ${results.violations}`
    );

    if (
      inputs.sarif
    ) {

      console.log(
        "📄 Generating SARIF report"
      );

      await generateSarif(
        results
      );
    }

    if (
      inputs.junit
    ) {

      console.log(
        "🧪 Generating JUnit report"
      );

      await generateJUnit(
        results
      );
    }

    if (
      inputs.prComment
    ) {

      console.log(
        "💬 Creating PR comment"
      );

      await createPRComment(
        results
      );
    }

    console.log(
      "📝 Generating GitHub Step Summary"
    );

    await generateStepSummary(
      results
    );

    console.log(
      "📣 Sending notifications"
    );

    await sendNotifications(
      results
    );

    core.setOutput(
      "violations",
      results.violations
    );

    core.setOutput(
      "status",
      results.failed
        ? "failed"
        : "passed"
    );

    core.setOutput(
      "sarif-report",
      "reports/results.sarif"
    );

    core.setOutput(
      "junit-report",
      "reports/junit.xml"
    );

    if (
      results.failed &&
      inputs.failOnViolation
    ) {

      core.setFailed(
        `❌ ${results.violations} policy violations found`
      );

      return;
    }

    console.log(
      "✅ Kyverno Guardian Completed Successfully"
    );

  } catch (err: any) {

    console.error(
      "💥 Kyverno Guardian Failed"
    );

    console.error(
      err
    );

    core.setFailed(
      err.message
    );
  }
}

run();
