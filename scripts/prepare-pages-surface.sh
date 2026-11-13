#!/usr/bin/env bash
# Copy the installable web app into dist/pages.
# This does not enable GitHub Pages, push a branch, merge, or change repository settings.
# A custom destination must be under dist/ or outside the repository. The script refuses
# to delete the repository, its parents, or any other source directory.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd -P)"
requested="${1:-"$root/dist/pages"}"

if [[ -z "${requested//[[:space:]]/}" ]]; then
  echo "Refusing to delete an empty output path." >&2
  exit 1
fi

dest="$(python3 -c 'import os, sys
root = os.path.realpath(sys.argv[1])
dest = os.path.realpath(os.path.abspath(sys.argv[2]))
if dest == os.path.sep:
    raise SystemExit("Refusing to delete the filesystem root.")
if dest == root or root.startswith(dest + os.sep):
    raise SystemExit("Refusing to delete " + dest + " because it contains the repository.")
dist_root = os.path.join(root, "dist")
inside = dest == root or dest.startswith(root + os.sep)
under_dist = dest == dist_root or dest.startswith(dist_root + os.sep)
if inside and not under_dist:
    raise SystemExit("Refusing to delete " + dest + ". Inside the repository, output must stay under dist/.")
print(dest)
' "$root" "$requested")"

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
