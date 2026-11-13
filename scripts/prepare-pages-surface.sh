#!/usr/bin/env bash
# Copy the installable web app into dist/pages.
# This does not enable GitHub Pages, push a branch, merge, or change repository settings.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
dest="${1:-"$root/dist/pages"}"

rm -rf "$dest"
mkdir -p "$dest/bg"

cp "$root/index.html" \
  "$root/manifest.json" \
  "$root/sw.js" \
  "$root/icon-192.png" \
  "$root/icon-512.png" \
  "$root/icon-512-maskable.png" \
  "$root/.nojekyll" \
  "$root/LICENSE" \
  "$dest/"
cp -a "$root/bg/." "$dest/bg/"

# The publish surface is the web shell only. android/, tests/, and Gradle stay out.
if find "$dest" -type d \( -name android -o -name tests -o -name .gradle \) | grep -q .; then
  echo "Refusing to leave android, tests, or Gradle directories in $dest" >&2
  exit 1
fi

echo "Prepared $dest"
echo "This script does not enable GitHub Pages, push a branch, or change repository settings."
