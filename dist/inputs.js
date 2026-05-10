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
exports.inputs = void 0;
const core = __importStar(require("@actions/core"));
exports.inputs = {
    policies: core.getInput("policies", {
        required: true
    }),
    resources: core.getInput("resources", {
        required: true
    }),
    helmChart: core.getInput("helm-chart"),
    helmValues: core.getInput("helm-values"),
    kustomizePath: core.getInput("kustomize-path"),
    policyExceptions: core.getInput("policy-exceptions"),
    severity: core.getInput("severity"),
    outputFormat: core.getInput("output-format"),
    sarif: core.getBooleanInput("sarif"),
    junit: core.getBooleanInput("junit"),
    prComment: core.getBooleanInput("pr-comment"),
    diffMode: core.getBooleanInput("diff-mode"),
    kyvernoVersion: core.getInput("kyverno-version"),
    failOnViolation: core.getBooleanInput("fail-on-violation"),
    verbose: core.getBooleanInput("verbose"),
    slackWebhook: core.getInput("slack-webhook"),
    teamsWebhook: core.getInput("teams-webhook"),
    gchatWebhook: core.getInput("gchat-webhook"),
    notifyOn: core.getInput("notify-on"),
    githubToken: core.getInput("github-token")
};
