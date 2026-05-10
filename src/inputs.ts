import * as core from "@actions/core";

export const inputs = {
  policies: core.getInput("policies", {
    required: true
  }),

  resources: core.getInput("resources", {
    required: true
  }),

  helmChart:
    core.getInput("helm-chart"),

  helmValues:
    core.getInput("helm-values"),

  kustomizePath:
    core.getInput("kustomize-path"),

  policyExceptions:
    core.getInput("policy-exceptions"),

  severity:
    core.getInput("severity"),

  outputFormat:
    core.getInput("output-format"),

  sarif:
    core.getBooleanInput("sarif"),

  junit:
    core.getBooleanInput("junit"),

  prComment:
    core.getBooleanInput("pr-comment"),

  diffMode:
    core.getBooleanInput("diff-mode"),

  kyvernoVersion:
    core.getInput("kyverno-version"),

  failOnViolation:
    core.getBooleanInput(
      "fail-on-violation"
    ),

  verbose:
    core.getBooleanInput("verbose"),

  slackWebhook:
    core.getInput("slack-webhook"),

  teamsWebhook:
    core.getInput("teams-webhook"),

  gchatWebhook:
    core.getInput("gchat-webhook"),

  notifyOn:
    core.getInput("notify-on"),

  githubToken:
    core.getInput("github-token")
};
