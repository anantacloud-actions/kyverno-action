import * as core from "@actions/core";

export const inputs = {
  policies: core.getInput("policies", { required: true }),
  resources: core.getInput("resources", { required: true }),
  namespace: core.getInput("namespace"),
  cluster: core.getBooleanInput("cluster"),
  failOnViolation: core.getBooleanInput("fail-on-violation"),
  outputFormat: core.getInput("output-format"),
  verbose: core.getBooleanInput("verbose"),
  kyvernoVersion: core.getInput("kyverno-version"),
  policyReport: core.getBooleanInput("policy-report"),
  sarifFile: core.getInput("sarif-file"),
  slackWebhook: core.getInput("slack-webhook"),
  teamsWebhook: core.getInput("teams-webhook"),
  gchatWebhook: core.getInput("gchat-webhook")
};
