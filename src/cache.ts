import * as cache from "@actions/cache";

export async function restoreKyvernoCache(
  version: string
) {
  const key =
    `kyverno-${version}`;

  await cache.restoreCache(
    ["/usr/local/bin/kyverno"],
    key
  );
}
