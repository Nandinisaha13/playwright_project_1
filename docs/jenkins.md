# Jenkins — Sauce Demo Playwright pipeline

This repo includes a **Declarative Pipeline** so you can run the same E2E suite as GitHub Actions on Jenkins.

| File | When to use |
|------|-------------|
| [`Jenkinsfile`](../Jenkinsfile) | Agent has **Node 18+** on Linux; installs Chromium via `playwright install --with-deps` |
| [`Jenkinsfile.docker`](../Jenkinsfile.docker) | Agent can run **Docker**; uses `mcr.microsoft.com/playwright:v1.63.0-jammy` (matches `@playwright/test` in `package.json`) |

Playwright **retries** (`retries: 2` when `CI=true`) come from [`playwright.config.js`](../playwright.config.js), not from Jenkins. Jenkins only sets `CI=true` in the pipeline.

---

## 1. Run Jenkins locally (Docker)

Use **LTS + Java 21 + Node 20** (required for [`Jenkinsfile`](../Jenkinsfile) `npm ci` / Playwright):

```bash
# From repo root (recommended — builds Dockerfile.jenkins)
docker compose -f docker-compose.jenkins.yml up -d --build

# Verify Node inside the container
docker exec jenkins node --version
docker exec jenkins npm --version
```

Plain `jenkins/jenkins:lts-jdk21` **does not include Node**; the Install stage will fail with `node: not found` until you use this compose file or install Node manually.

1. Open http://localhost:8080
2. First-time only — initial admin password:  
   `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
3. Plugins: **Pipeline**, **Git**, **Credentials Binding**, **Timestamper**.

For **Jenkinsfile.docker**, the Jenkins container must reach Docker (e.g. mount the socket — advanced). For first learning, use a **Linux VM or cloud agent** with Node, or install Node on the Jenkins controller (not ideal for production, OK for practice).

---

## Fix Manage Jenkins warnings (update, Java 21, security)

These steps address the banners you see on **Manage Jenkins**: new version available, Java 17 EOL, and core/plugin security advisories.

### A. Already on Docker with `jenkins_home` volume (upgrade image)

Your data (jobs, credentials, plugins) lives in the **volume**, not the container.

```bash
docker pull jenkins/jenkins:lts-jdk21
docker stop jenkins
docker rm jenkins
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk21
```

Wait 1–2 minutes, open http://localhost:8080. If Jenkins asks to **complete the upgrade** or **restart**, follow the prompts.

Check Java inside the container:

```bash
docker exec jenkins java -version
```

You should see **Java 21** (fixes item **3**). A newer Jenkins LTS in that image fixes item **1** (outdated core).

### B. Update Jenkins core from the UI (if a blue banner remains)

1. **Manage Jenkins** → **Updates** (or **System** → download new version).
2. Select the recommended **LTS** → install → **Restart Jenkins when installation is complete**.

### C. Update plugins (security warnings — item **4**)

1. **Manage Jenkins** → **Plugins** → **Updates** tab.
2. Select **all** (or at least anything with a security icon) → **Download now and install after restart**.
3. Check **Restart Jenkins when installation is complete and no jobs are running**.

After restart, open **Manage Jenkins** again. Some advisories (e.g. Multibranch / Groovy Libraries) may remain until the Jenkins project ships a fixed plugin; for a **local lab** that is often acceptable. Do **not** expose this Jenkins to the public internet without reading each advisory.

### D. Yellow banner: “Building on the built-in node”

Safe to **Dismiss** while learning. For production-style practice later: **Set up agent** and set controller **# of executors** to `0` under **Manage Jenkins** → **Nodes** → **Built-In Node** → **Configure**.

---

## 2. Prepare the agent (Jenkinsfile — no Docker)

On the machine that runs the job:

```bash
# Example: Ubuntu
sudo apt-get update
# Node 20 via NodeSource or nvm — ensure `node` and `npm` are on PATH for the jenkins user
```

The `jenkins` user must be able to run `npm ci` and Playwright’s browser install (system libraries).

---

## 3. Add credentials

**Manage Jenkins → Credentials → (global) → Add Credentials**

Create **five** credentials of type **Secret text**. Use these **IDs exactly** (they match the `Jenkinsfile`):

| Credential ID | Value (from Sauce Demo / your `.env`) |
|---------------|----------------------------------------|
| `sauce-standard-username` | e.g. `standard_user` |
| `sauce-standard-password` | standard user password |
| `sauce-locked-out-username` | e.g. `locked_out_user` |
| `sauce-locked-out-password` | locked-out password |
| `sauce-invalid-password` | any wrong password for TC-02 |

Names match [`.env.example`](../.env.example).

---

## 4. Create the Pipeline job

1. **New Item** → name e.g. `playwright-saucedemo` → **Pipeline** → OK.
2. **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: your GitHub repo
   - Credentials: add if the repo is private
   - Branch: `*/main`
   - Script Path: `Jenkinsfile` (or `Jenkinsfile.docker`)
3. **Save** → **Build Now**.

---

## 5. Read the build

| Jenkins concept | This project |
|-----------------|--------------|
| **Stage** | Checkout → Install → Verify credentials → Playwright E2E |
| **withCredentials** | Injects `SAUCE_*` env vars for the shell step only |
| **archiveArtifacts** | HTML report always; `test-results/` on failure (screenshots, video, traces) |
| **Blue ocean / Stage view** | Shows which stage failed (e.g. missing credential vs test failure) |

Download **playwright-report** from the build’s **Artifacts** link and open `index.html` locally.

---

## 6. Compare with GitHub Actions

| | GitHub Actions | Jenkins |
|--|----------------|---------|
| Config | `.github/workflows/playwright.yml` | `Jenkinsfile` |
| Secrets | Repository secrets | Credentials + `withCredentials` |
| Reports | `upload-artifact` | `archiveArtifacts` |
| Retries | `playwright.config.js` + `CI=true` | Same |

Optional: refactor the workflow to call `bash scripts/ci-verify-sauce-env.sh` instead of inline shell (same check as Jenkins).

---

## Troubleshooting

- **Credentials stage fails** — ID typo; credential must be **Secret text**, not username/password (unless you change the Jenkinsfile).
- **`su: Authentication failure` during `playwright install --with-deps`** — the Jenkins user cannot become root. Use this repo’s `Dockerfile.jenkins` (pre-installs `playwright install-deps`) and `npx playwright install chromium` in the `Jenkinsfile` (no `--with-deps`).
- **Playwright install fails (other)** — use a Linux agent or switch to `Jenkinsfile.docker`.
- **Tests pass locally, fail on Jenkins** — confirm `CI=true` (set in pipeline); check archived `test-results` for traces.
