import * as github from "@actions/github";
import { inputs } from "./inputs";

export async function createPRComment(
  results: any
) {
  const context =
    github.context;

  if (
    !context.payload
      .pull_request
  ) {
    return;
  }

  const octokit =
    github.getOctokit(
      inputs.githubToken
    );

  await octokit.rest.issues.createComment(
    {
      owner:
        context.repo.owner,

      repo:
        context.repo.repo,

      issue_number:
        context.payload
          .pull_request
          .number,

      body:
`## 🛡️ Kyverno Guardian Report

| Metric | Value |
|---|---|
| Violations | ${results.violations} |
| Status | ${
          results.failed
            ? "❌ FAILED"
            : "✅ PASSED"
        } |

### Output

\`\`\`
${results.output}
\`\`\`
`
    }
  );
}
