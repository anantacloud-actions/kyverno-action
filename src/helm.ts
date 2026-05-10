import * as exec from "@actions/exec";
import * as fs from "fs";

export async function buildHelmTemplates(
  chart: string,
  values?: string
): Promise<string> {

  const output =
    "rendered-helm.yaml";

  let yaml = "";

  const args = [
    "template",
    "release",
    chart
  ];

  if (values) {
    args.push("-f", values);
  }

  await exec.exec("helm", args, {
    listeners: {
      stdout: (data: Buffer) => {
        yaml += data.toString();
      }
    }
  });

  fs.writeFileSync(output, yaml);

  return output;
}
