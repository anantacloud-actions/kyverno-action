"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = sendNotifications;
const axios_1 = __importDefault(require("axios"));
const inputs_1 = require("./inputs");
async function sendNotifications(result) {
    const shouldNotify = inputs_1.inputs.notifyOn ===
        "always" ||
        (inputs_1.inputs.notifyOn ===
            "failure" &&
            result.failed) ||
        (inputs_1.inputs.notifyOn ===
            "success" &&
            !result.failed);
    if (!shouldNotify) {
        console.log("🔕 Notifications skipped");
        return;
    }
    const message = {
        text: `🛡️ Kyverno Guardian Scan Completed

🚦 Status:
${result.failed ? "❌ FAILED" : "✅ PASSED"}

📌 Violations:
${result.violations}

⚡ Powered by Kyverno Guardian`
    };
    if (inputs_1.inputs.slackWebhook) {
        console.log("💬 Sending Slack notification");
        await axios_1.default.post(inputs_1.inputs.slackWebhook, message);
        console.log("✅ Slack notification sent");
    }
    if (inputs_1.inputs.teamsWebhook) {
        console.log("💬 Sending Teams notification");
        await axios_1.default.post(inputs_1.inputs.teamsWebhook, message);
        console.log("✅ Teams notification sent");
    }
    if (inputs_1.inputs.gchatWebhook) {
        console.log("💬 Sending Google Chat notification");
        await axios_1.default.post(inputs_1.inputs.gchatWebhook, message);
        console.log("✅ Google Chat notification sent");
    }
    if (!inputs_1.inputs.slackWebhook &&
        !inputs_1.inputs.teamsWebhook &&
        !inputs_1.inputs.gchatWebhook) {
        console.log("🔕 No notification webhooks configured");
    }
}
