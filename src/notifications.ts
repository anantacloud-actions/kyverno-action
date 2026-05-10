import axios from "axios";
import { inputs } from "./inputs";

export async function sendNotifications(
  result: any
) {
  const shouldNotify =
    inputs.notifyOn ===
      "always" ||

    (
      inputs.notifyOn ===
        "failure" &&
      result.failed
    ) ||

    (
      inputs.notifyOn ===
        "success" &&
      !result.failed
    );

  if (!shouldNotify) {
    return;
  }

  const message = {
    text:
`🛡️ Kyverno Guardian Scan Completed

Status:
${result.failed ? "❌ FAILED" : "✅ PASSED"}

Violations:
${result.violations}

Powered by Kyverno Guardian ⚡`
  };

  if (
    inputs.slackWebhook
  ) {
    console.log(
      "💬 Sending Slack notification"
    );

    await axios.post(
      inputs.slackWebhook,
      message
    );
  }

  if (
    inputs.teamsWebhook
  ) {
    console.log(
      "💬 Sending Teams notification"
    );

    await axios.post(
      inputs.teamsWebhook,
      message
    );
  }

  if (
    inputs.gchatWebhook
  ) {
    console.log(
      "💬 Sending Google Chat notification"
    );

    await axios.post(
      inputs.gchatWebhook,
      message
    );
  }
}
