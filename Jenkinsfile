/**
 * Declarative Pipeline — Sauce Demo Playwright E2E
 *
 * Credentials (Manage Jenkins → Credentials → Secret text). IDs must match exactly:
 *   sauce-standard-username, sauce-standard-password
 *   sauce-locked-out-username, sauce-locked-out-password
 *   sauce-invalid-password
 *
 * Sauce Demo values: https://www.saucedemo.com/ (see docs/jenkins.md)
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
    SAUCE_STANDARD_USERNAME = credentials('sauce-standard-username')
    SAUCE_STANDARD_PASSWORD = credentials('sauce-standard-password')
    SAUCE_LOCKED_OUT_USERNAME = credentials('sauce-locked-out-username')
    SAUCE_LOCKED_OUT_PASSWORD = credentials('sauce-locked-out-password')
    SAUCE_INVALID_PASSWORD = credentials('sauce-invalid-password')
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
          npx playwright install chromium
        '''
      }
    }

    stage('Verify credentials') {
      steps {
        sh 'bash scripts/ci-verify-sauce-env.sh'
      }
    }

    stage('Playwright E2E') {
      steps {
        sh 'npm run test:saucedemo -- --project=chromium'
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
