import axios from "axios";
import { inputs } from "./inputs";

export async function sendNotifications(result: any) {
  const message = {
    text: `Kyverno Scan Completed
Violations: ${result.violations}
Status: ${result.failed ? "FAILED" : "PASSED"}`
  };

  if (inputs.slackWebhook) {
    console.log("💬 Sending Slack notification");
    await axios.post(inputs.slackWebhook, message);
  }

  if (inputs.teamsWebhook) {
    console.log("💬 Sending Teams notification");
    await axios.post(inputs.teamsWebhook, message);
  }

  if (inputs.gchatWebhook) {
    console.log("💬 Sending Google Chat notification");
    await axios.post(inputs.gchatWebhook, message);
  }
}
