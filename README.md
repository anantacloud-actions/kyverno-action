# Kyverno Action

<img width="1983" height="793" alt="image" src="https://github.com/user-attachments/assets/0bfb1322-de00-4946-80e0-1f894e5af687" />

<p align="center">

![GitHub Marketplace](https://img.shields.io/badge/GitHub-Marketplace-blue)
![Kyverno](https://img.shields.io/badge/Kyverno-v1.15-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Security-blue)
![SARIF](https://img.shields.io/badge/SARIF-Supported-success)
![Helm](https://img.shields.io/badge/Helm-Supported-success)
![Kustomize](https://img.shields.io/badge/Kustomize-Supported-success)

</p>

Enterprise-grade Kubernetes policy validation powered by Kyverno ⚡

Kyverno Guardian Action helps platform engineering and DevSecOps teams validate Kubernetes manifests directly in GitHub Actions using Kyverno with enterprise integrations including Helm, Kustomize, SARIF, PR comments, notifications, OCI bundles, JUnit reports, and GitHub Security integration.


# ✨ Features

✅ Kyverno policy validation  
✅ Helm template scanning  
✅ Kustomize scanning  
✅ OCI policy bundles  
✅ SARIF reporting  
✅ GitHub Security integration  
✅ GitHub PR comments  
✅ GitHub Step Summary  
✅ JUnit reports  
✅ Severity filtering  
✅ Policy exceptions  
✅ Slack notifications  
✅ Microsoft Teams notifications  
✅ Google Chat notifications  
✅ Enterprise CI/CD workflows  


# 🚀 Quick Start

```yaml
name: Kyverno Guardian
on:
  pull_request:
jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      security-events: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run Kyverno Guardian
        uses: anantacloud-actions/kyverno-action@v1
        with:
          policies: ./policies
          resources: ./manifests
          sarif: true
          junit: true
          pr-comment: true
          fail-on-violation: true
          notify-on: always
```

# 📦 Inputs

| Input | Description | Required | Default |
|---|---|---|---|
| `policies` | Path or OCI URI to Kyverno policies | ✅ | |
| `resources` | Path to Kubernetes manifests | ✅ | |
| `helm-chart` | Helm chart path | ❌ | |
| `helm-values` | Helm values file | ❌ | |
| `kustomize-path` | Kustomize overlay path | ❌ | |
| `policy-exceptions` | Policy exceptions path | ❌ | |
| `severity` | Severity filter | ❌ | `low,medium,high,critical` |
| `output-format` | Output format | ❌ | `table` |
| `sarif` | Enable SARIF generation | ❌ | `true` |
| `junit` | Enable JUnit generation | ❌ | `true` |
| `pr-comment` | Enable PR comments | ❌ | `true` |
| `diff-mode` | Enable policy diff mode | ❌ | `false` |
| `kyverno-version` | Kyverno CLI version | ❌ | `v1.15.0` |
| `fail-on-violation` | Fail workflow on violations | ❌ | `true` |
| `verbose` | Enable verbose logs | ❌ | `false` |
| `slack-webhook` | Slack webhook URL | ❌ | |
| `teams-webhook` | Microsoft Teams webhook URL | ❌ | |
| `gchat-webhook` | Google Chat webhook URL | ❌ | |
| `notify-on` | Notification mode | ❌ | `failure` |
| `github-token` | GitHub token | ❌ | `${{ github.token }}` |


# 📤 Outputs

| Output | Description |
|---|---|
| `violations` | Total policy violations |
| `status` | Validation status |
| `sarif-report` | SARIF report location |
| `junit-report` | JUnit report location |


# 🔥 Example Policy

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-owner-label
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-owner-label
      match:
        any:
          - resources:
              kinds:
                - Deployment
      validate:
        message: "owner label is required"
        pattern:
          metadata:
            labels:
              owner: "?*"
```

# 📦 Example Kubernetes Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

# ⛵ Helm Example

```yaml
- name: Run Kyverno Guardian
  uses: your-org/kyverno-guardian-action@v1

  with:
    policies: ./policies
    resources: ./manifests
    helm-chart: ./chart
    helm-values: ./chart/values.yaml
```

# 🏗️ Kustomize Example

```yaml
- name: Run Kyverno Guardian
  uses: anantacloud-actions/kyverno-action@v1

  with:
    policies: ./policies
    resources: ./manifests
    kustomize-path: ./overlays/dev
```

# 📦 OCI Policy Bundle Example

```yaml
- name: Run Kyverno Guardian
  uses: anantacloud-actions/kyverno-action@v1

  with:
    policies: oci://ghcr.io/org/policies
    resources: ./manifests
```

# 📄 SARIF Upload Example

```yaml
- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3

  with:
    sarif_file: reports/results.sarif
```

# 💬 Notification Example

```yaml
- name: Run Kyverno Guardian
  uses: anantacloud-actions/kyverno-action@v1

  with:
    policies: ./policies
    resources: ./manifests
    slack-webhook: ${{ secrets.SLACK_WEBHOOK }}
    teams-webhook: ${{ secrets.TEAMS_WEBHOOK }}
    gchat-webhook: ${{ secrets.GCHAT_WEBHOOK }}
    notify-on: always
```

# 📊 Beautiful GitHub Step Summary

Kyverno Guardian automatically generates a rich GitHub Step Summary with:

- Policy violations
- Validation status
- Security findings
- CI/CD summary
- Kubernetes resource details

# 🧪 JUnit Reports

JUnit reports are generated automatically:

```bash
reports/junit.xml
```

Perfect for:

- Jenkins
- GitLab
- Azure DevOps
- Test dashboards
- CI analytics


# 📄 SARIF Reports

SARIF reports are generated automatically:

```bash
reports/results.sarif
```

Integrates directly with:

- GitHub Security tab
- Code scanning
- Security dashboards
- Enterprise compliance workflows


# 🛡️ Enterprise Security Features

- Policy as Code
- Kubernetes Admission Controls
- Shift-left security
- CI/CD policy enforcement
- Compliance automation
- Multi-cluster workflows
- GitOps security
- Supply chain validation
- Platform engineering workflows


# 📁 Repository Structure

```bash
.
├── .github/
│   └── workflows/
│       └── kyverno.yml
│
├── src/
│   ├── index.ts
│   ├── inputs.ts
│   ├── kyverno.ts
│   ├── github.ts
│   ├── notifications.ts
│   ├── helm.ts
│   ├── kustomize.ts
│   ├── cache.ts
│   ├── diff.ts
│   ├── oci.ts
│   ├── junit.ts
│   ├── sarif.ts
│   └── summary.ts
│
├── reports/
│
├── action.yml
├── package.json
├── tsconfig.json
└── README.md
```

# 🚀 Build

```bash
npm install
npm run build
```

# 🧪 Local Testing

```bash
npm run build
```

Then test using:

```yaml
uses: ./
```

inside a GitHub Actions workflow.


# 🤝 Contributing

Contributions are welcome 🚀

Please open issues and pull requests for:

- New integrations
- Policy enhancements
- Reporting improvements
- Enterprise features
- Kubernetes security improvements


# 📜 License

MIT License


# ⚡ Powered By

- Kyverno
- Kubernetes
- GitHub Actions
- DevSecOps
- Platform Engineering


# 🌌 Tagline

> Secure Kubernetes Deployments Before They Reach Production 🛡️
