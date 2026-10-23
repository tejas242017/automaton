#!/usr/bin/env bash
set -euo pipefail

# Copies only reviewed Udaan prompt skills into a user's Automaton skill directory.
# This script does not start Automaton, set credentials, send messages, submit forms,
# or perform payments. Review the skill files before running.

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$(cd -- "${SCRIPT_DIR}/../skills" && pwd)"
TARGET_ROOT="${UDAAN_AUTOMATON_SKILLS_DIR:-${HOME}/.automaton/skills}"

if [[ ! -d "${SKILLS_SRC}" ]]; then
  echo "ERROR: Udaan skills source directory not found: ${SKILLS_SRC}" >&2
  exit 1
fi

mkdir -p "${TARGET_ROOT}"

for skill in udaan-intake udaan-documents udaan-growth-services udaan-operations; do
  source_dir="${SKILLS_SRC}/${skill}"
  if [[ ! -f "${source_dir}/SKILL.md" ]]; then
    echo "ERROR: expected skill file missing: ${source_dir}/SKILL.md" >&2
    exit 1
  fi

  target_dir="${TARGET_ROOT}/${skill}"
  if [[ -e "${target_dir}/SKILL.md" ]]; then
    echo "ERROR: refusing to overwrite existing skill: ${target_dir}/SKILL.md" >&2
    echo "Back up or rename the existing skill manually, then review before retrying." >&2
    exit 1
  fi

  mkdir -p "${target_dir}"
  cp "${source_dir}/SKILL.md" "${target_dir}/SKILL.md"
  echo "Installed draft-only skill: ${skill}"
done

echo
echo "Udaan prompt skills copied to: ${TARGET_ROOT}"
echo "Review every skill before enabling it. These skills do not implement CRM/API integration."
echo "Do not connect customer data, messaging, government portals, wallets, payment systems, or live ad accounts."
