#!/usr/bin/env bash
# Safe for CI logs: shows whether each SAUCE_* var is set and its length (not the value).
set -euo pipefail

for var in SAUCE_STANDARD_USERNAME SAUCE_STANDARD_PASSWORD \
  SAUCE_LOCKED_OUT_USERNAME SAUCE_LOCKED_OUT_PASSWORD SAUCE_INVALID_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "$var=MISSING"
  else
    value="${!var}"
    echo "$var=SET (length ${#value})"
  fi
done
