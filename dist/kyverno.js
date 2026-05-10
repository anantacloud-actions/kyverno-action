"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.installKyverno = installKyverno;
exports.runKyverno = runKyverno;
const exec = __importStar(require("@actions/exec"));
const tc = __importStar(require("@actions/tool-cache"));
const core = __importStar(require("@actions/core"));
const inputs_1 = require("./inputs");
async function installKyverno(version) {
    const url = `https://github.com/kyverno/kyverno/releases/download/${version}/kyverno-cli_${version}_linux_x86_64.tar.gz`;
    console.log(`📥 Installing Kyverno CLI ${version}`);
    const downloadPath = await tc.downloadTool(url);
    const extractedPath = await tc.extractTar(downloadPath);
    core.addPath(extractedPath);
    console.log("✅ Kyverno CLI Installed");
}
async function runKyverno(resources) {
    let output = "";
    const args = [
        "apply",
        inputs_1.inputs.policies,
        "--resource",
        resources,
        "--policy-report",
        "-o",
        "json"
    ];
    if (inputs_1.inputs.policyExceptions) {
        args.push("--exceptions", inputs_1.inputs.policyExceptions);
    }
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("🛡️  KYVERNO GUARDIAN VALIDATION");
    console.log("═══════════════════════════════════════");
    console.log(`📂 Policies: ${inputs_1.inputs.policies}`);
    console.log(`📦 Resources: ${resources}`);
    console.log(`⚔️ Severity Filter: ${inputs_1.inputs.severity}`);
    console.log("");
    let exitCode = 0;
    try {
        exitCode =
            await exec.exec("kyverno", args, {
                ignoreReturnCode: true,
                listeners: {
                    stdout: (data) => {
                        output +=
                            data.toString();
                    },
                    stderr: (data) => {
                        output +=
                            data.toString();
                    }
                }
            });
    }
    catch (err) {
        console.error("❌ Kyverno execution failed");
        console.error(err);
    }
    let violations = 0;
    let parsedResults = [];
    try {
        const parsed = JSON.parse(output);
        parsedResults =
            parsed.results || [];
        violations =
            parsedResults.filter((r) => r.result === "fail").length;
    }
    catch (err) {
        console.log("⚠️ Failed to parse Kyverno JSON output");
        violations =
            (output.match(/result:\s+fail/gi) || []).length;
    }
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📊 VALIDATION SUMMARY");
    console.log("═══════════════════════════════════════");
    console.log(`📌 Total Violations: ${violations}`);
    console.log(`🚦 Status: ${violations > 0
        ? "❌ FAILED"
        : "✅ PASSED"}`);
    console.log(`📤 Exit Code: ${exitCode}`);
    console.log("");
    if (parsedResults.length > 0) {
        console.log("═══════════════════════════════════════");
        console.log("🔍 POLICY VIOLATIONS");
        console.log("═══════════════════════════════════════");
        parsedResults.forEach((result, index) => {
            const icon = result.result === "fail"
                ? "❌"
                : "✅";
            console.log("");
            console.log(`${icon} Violation #${index + 1}`);
            console.log(`📜 Policy: ${result.policy ||
                "unknown"}`);
            console.log(`📏 Rule: ${result.rule ||
                "unknown"}`);
            console.log(`📦 Resource: ${result.resources?.[0]
                ?.kind || "unknown"} / ${result.resources?.[0]
                ?.name || "unknown"}`);
            console.log(`📝 Message: ${result.message ||
                "No message"}`);
            console.log(`🚨 Result: ${result.result}`);
            console.log("────────────────────────────");
        });
    }
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log(violations > 0
        ? "❌ POLICY VIOLATIONS DETECTED"
        : "✅ ALL POLICIES PASSED");
    console.log("═══════════════════════════════════════");
    console.log("");
    return {
        failed: violations > 0,
        violations,
        output,
        parsedResults,
        exitCode
    };
}
