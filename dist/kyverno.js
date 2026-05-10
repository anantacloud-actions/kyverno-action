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
    console.log(`📥 Installing Kyverno ${version}`);
    const path = await tc.downloadTool(url);
    const extracted = await tc.extractTar(path);
    core.addPath(extracted);
}
async function runKyverno(resources) {
    let output = "";
    const args = [
        "apply",
        inputs_1.inputs.policies,
        "--resource",
        resources
    ];
    if (inputs_1.inputs.policyExceptions) {
        args.push("--exceptions", inputs_1.inputs.policyExceptions);
    }
    args.push("--policy-report");
    args.push("--warn-exit-code", "0");
    args.push("--audit-warn");
    if (inputs_1.inputs.outputFormat ===
        "sarif") {
        args.push("-o", "sarif");
    }
    const exitCode = await exec.exec("kyverno", args, {
        listeners: {
            stdout: (data) => {
                output +=
                    data.toString();
                process.stdout.write(data);
            }
        }
    });
    const severities = inputs_1.inputs.severity
        .split(",");
    let violations = (output.match(/fail/gi) || []).length;
    return {
        failed: exitCode !== 0 ||
            violations > 0,
        violations,
        severities,
        output
    };
}
