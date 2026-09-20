#!/usr/bin/env bash
# Fail fast when Sauce Demo credentials are missing (GitHub Actions, Jenkins, local CI).
set -euo pipefail

missing=0
for var in SAUCE_STANDARD_USERNAME SAUCE_STANDARD_PASSWORD \
  SAUCE_LOCKED_OUT_USERNAME SAUCE_LOCKED_OUT_PASSWORD SAUCE_INVALID_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: Environment variable $var is not set."
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "Set all SAUCE_* variables (see .env.example)."
  exit 1
fi

echo "All required SAUCE_* environment variables are set."
