#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

# Run npm audit on current branch and compare it with the results of running npm audit on the base branch that is set in the package.json. If there are more
# high or critical findings in the current branch, then the test fails. If the same number of findings are found, then check that the vulnerabilities are the same.
# If they are are different, then the test fails.

# If you're running this script locally, you'll end up being switched to the base branch when this is complete.
# You may want to stash your local changes before running this script.

# Save high and critical vulns from current branch
npm ci
npm audit | grep -E "(High)" -B3 -A10 > current-branch-high-vulnerabilities.txt || true
npm audit | grep -E "(Critical)" -B3 -A10 > current-branch-critical-vulnerabilities.txt || true

HIGH_VULN="$(grep -o High current-branch-high-vulnerabilities.txt | wc -l || true)"
CRITICAL_VULN="$(grep -o Critical current-branch-critical-vulnerabilities.txt | wc -l || true)"
echo $HIGH_VULN > compare-num-vulnerabilities.txt
echo $CRITICAL_VULN >> compare-num-vulnerabilities.txt

# Save high and critical vulns from the base branch (e.g. develop, hotfix/1.11.2)
git checkout "$npm_package_config_base_branch"
npm ci
npm audit | grep -E "(High)" -B3 -A10 > base-branch-high-vulnerabilities.txt || true
npm audit | grep -E "(Critical)" -B3 -A10 > base-branch-critical-vulnerabilities.txt || true

HIGH_VULN="$(grep -o High base-branch-high-vulnerabilities.txt | wc -l || true)"
CRITICAL_VULN="$(grep -o Critical base-branch-critical-vulnerabilities.txt | wc -l || true)"
echo $HIGH_VULN >> compare-num-vulnerabilities.txt
echo $CRITICAL_VULN >> compare-num-vulnerabilities.txt

CURRENT_BRANCH_NUM_HIGH_VULNS=$(head -n 1 compare-num-vulnerabilities.txt)
BASE_BRANCH_NUM_HIGH_VULNS=$(sed -n '3p' compare-num-vulnerabilities.txt)

CURRENT_BRANCH_NUM_CRITICAL_VULNS=$(sed -n '2p' compare-num-vulnerabilities.txt)
BASE_BRANCH_NUM_CRITICAL_VULNS=$(sed -n '4p' compare-num-vulnerabilities.txt)

ERROR_MSG="If this seems wrong, make sure the base_branch in the package.json is set correctly"

if [ "$CURRENT_BRANCH_NUM_CRITICAL_VULNS" -gt "$BASE_BRANCH_NUM_CRITICAL_VULNS" ]; then
  echo "You have introduced $((CURRENT_BRANCH_NUM_CRITICAL_VULNS-BASE_BRANCH_NUM_CRITICAL_VULNS)) critical vulnerabilities."
  echo $ERROR_MSG
  exit 1
fi

if [ "$CURRENT_BRANCH_NUM_HIGH_VULNS" -gt "$BASE_BRANCH_NUM_HIGH_VULNS" ]; then
  echo "You have introduced $((CURRENT_BRANCH_NUM_HIGH_VULNS-BASE_BRANCH_NUM_HIGH_VULNS)) high vulnerabilities."
  echo $ERROR_MSG
  exit 1
fi

# If the number of vulnerabilities is equal, then check that if they are the same set of vulnerabilities.
if [ "$CURRENT_BRANCH_NUM_CRITICAL_VULNS" -eq "$BASE_BRANCH_NUM_CRITICAL_VULNS" ]; then
  if cmp -s "current-branch-critical-vulnerabilities.txt" "base-branch-critical-vulnerabilities.txt"; then
    echo "The number of critical vulnerabilities between the PR and base branch are the same"
  else
    echo "Looks like you have fixed and introduced an equal amount of critical vulnerabilities compared to the base branch"
    echo $ERROR_MSG
    exit 1;
  fi
fi

if [ "$CURRENT_BRANCH_NUM_HIGH_VULNS" -eq "$BASE_BRANCH_NUM_HIGH_VULNS" ]; then
  if cmp -s "current-branch-high-vulnerabilities.txt" "base-branch-high-vulnerabilities.txt"; then
    echo "The number of high vulnerabilities between the PR and base branch are the same"
  else
    echo "Looks like you have fixed and introduced an equal amount of high vulnerabilities compared to the base branch"
    echo $ERROR_MSG
    exit 1;
  fi
fi
