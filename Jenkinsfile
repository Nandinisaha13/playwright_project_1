/**
 * Declarative Pipeline — Sauce Demo Playwright E2E
 *
 * Prerequisites on the Jenkins controller/agent:
 *   - Node.js 18+ and npm on PATH (or use the Docker agent block below)
 *   - Linux recommended (Playwright browser deps)
 *
 * Credentials (Jenkins → Manage Jenkins → Credentials):
 *   Create five "Secret text" credentials with these IDs (values from Sauce Demo / .env):
 *     sauce-standard-username, sauce-standard-password
 *     sauce-locked-out-username, sauce-locked-out-password
 *     sauce-invalid-password
 *
 * Job: New Item → Pipeline → Pipeline script from SCM → point at this repo, branch main.
 */
pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh '''
          set -e
          node --version
          npm --version
          npm ci
          npx playwright install --with-deps chromium
        '''
      }
    }

    stage('Verify credentials') {
      steps {
        withCredentials([
          string(credentialsId: 'sauce-standard-username', variable: 'SAUCE_STANDARD_USERNAME'),
          string(credentialsId: 'sauce-standard-password', variable: 'SAUCE_STANDARD_PASSWORD'),
          string(credentialsId: 'sauce-locked-out-username', variable: 'SAUCE_LOCKED_OUT_USERNAME'),
          string(credentialsId: 'sauce-locked-out-password', variable: 'SAUCE_LOCKED_OUT_PASSWORD'),
          string(credentialsId: 'sauce-invalid-password', variable: 'SAUCE_INVALID_PASSWORD'),
        ]) {
          sh 'bash scripts/ci-verify-sauce-env.sh'
        }
      }
    }

    stage('Playwright E2E') {
      steps {
        withCredentials([
          string(credentialsId: 'sauce-standard-username', variable: 'SAUCE_STANDARD_USERNAME'),
          string(credentialsId: 'sauce-standard-password', variable: 'SAUCE_STANDARD_PASSWORD'),
          string(credentialsId: 'sauce-locked-out-username', variable: 'SAUCE_LOCKED_OUT_USERNAME'),
          string(credentialsId: 'sauce-locked-out-password', variable: 'SAUCE_LOCKED_OUT_PASSWORD'),
          string(credentialsId: 'sauce-invalid-password', variable: 'SAUCE_INVALID_PASSWORD'),
        ]) {
          sh 'npm run test:saucedemo -- --project=chromium'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts(
        artifacts: 'playwright-report/**',
        allowEmptyArchive: true,
        fingerprint: true,
      )
    }
    failure {
      archiveArtifacts(
        artifacts: 'test-results/**',
        allowEmptyArchive: true,
        fingerprint: true,
      )
    }
    success {
      echo 'Sauce Demo E2E passed (TC-01–TC-15).'
    }
  }
}
