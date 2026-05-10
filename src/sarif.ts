import * as fs from "fs";

export async function generateSarif(
  results: any
) {
  fs.mkdirSync(
    "reports",
    { recursive: true }
  );

  fs.writeFileSync(
    "reports/results.sarif",
    JSON.stringify(
      results,
      null,
      2
    )
  );

  console.log(
    "📄 SARIF report generated"
  );
}
