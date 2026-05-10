import * as fs from "fs";

export async function generateJUnit(
  results: any
) {
  fs.mkdirSync(
    "reports",
    { recursive: true }
  );

  const xml =
`<testsuite tests="${results.violations}">
<testcase classname="kyverno">
${
  results.failed
    ? `<failure>${results.output}</failure>`
    : ""
}
</testcase>
</testsuite>`;

  fs.writeFileSync(
    "reports/junit.xml",
    xml
  );

  console.log(
    "🧪 JUnit report generated"
  );
}
