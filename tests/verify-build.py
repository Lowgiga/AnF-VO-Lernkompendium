from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import re
import subprocess
import sys
import threading
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
HTML_BYTES = (ROOT / "index.html").read_bytes()
ANDROID_ASSETS = ROOT / "android" / "app" / "src" / "main" / "assets"
ANDROID_HTML = ANDROID_ASSETS / "index.html"
PWA_FILES = (
    "manifest.json",
    "sw.js",
    "icon-192.png",
    "icon-512.png",
    "icon-512-maskable.png",
)
PLACEHOLDER = "[vor Veröffentlichung ergänzen: Name, Anschrift, Kontakt]"
JS = (ROOT / "algorithm" / "robot-navigation.js").read_text(encoding="utf-8").strip()
ARCHITECTURE = (ROOT / "docs" / "ARCHITECTURE.md").read_text(encoding="utf-8")

checks = []


def check(name, ok, detail=""):
    checks.append({"name": name, "ok": bool(ok), "detail": detail})


matches = [
    match.group(1).strip()
    for match in re.finditer(r"<script>([\s\S]*?)</script>", HTML)
    if "RobotNav v2.8.0" in match.group(1)
]
embedded = matches[-1] if matches else ""

check(
    "Embedded RobotNav block matches standalone source",
    embedded == JS,
    f"embedded={len(embedded)} chars; source={len(JS)} chars",
)

standalone_syntax = subprocess.run(
    ["node", "--check", "-"], input=JS, capture_output=True, text=True
)
check(
    "Standalone JavaScript syntax",
    standalone_syntax.returncode == 0,
    (standalone_syntax.stderr or standalone_syntax.stdout).strip(),
)

embedded_syntax = subprocess.run(
    ["node", "--check", "-"], input=embedded, capture_output=True, text=True
)
check(
    "Embedded JavaScript syntax",
    embedded_syntax.returncode == 0,
    (embedded_syntax.stderr or embedded_syntax.stdout).strip(),
)

check("HTML document has one html root", len(re.findall(r"<html\b", HTML, re.I)) == 1)
check(
    "Android HTML asset matches index.html byte for byte",
    ANDROID_HTML.is_file() and ANDROID_HTML.read_bytes() == HTML_BYTES,
)
check(
    "RobotNav v2.8.0 embedded",
    HTML.count("RobotNav v2.8.0") >= 1 and "RobotNav v2.7.0" not in HTML,
)
check(
    "Standalone engine has no fetch/XHR/WebSocket",
    not re.search(r"\b(?:fetch\s*\(|XMLHttpRequest\b|WebSocket\b)", JS),
)
check("No polling interval used", not re.search(r"\bsetInterval\s*\(", JS))
check(
    "No self-scheduling animation loop used",
    "requestAnimationFrame(flush)" in JS and "requestAnimationFrame(update)" not in JS,
)

for component in [
    "DOM Inventory",
    "Obstacle Cache",
    "Position Planner",
    "Motion Controller",
    "Event Scheduler",
]:
    check(
        f"Architecture component: {component}",
        component.lower() in ARCHITECTURE.lower(),
    )

for feature in [
    "dirtyFlags |= flags",
    "processing = true",
    "requestAnimationFrame(flush)",
    "mutationObserver.disconnect()",
    "resizeObserver.disconnect()",
    "position === 'sticky'",
    "RobotNav.destroy",
]:
    check(f"Engine feature: {feature}", feature in JS)


def same_file(relative):
    root_file = ROOT / relative
    android_file = ANDROID_ASSETS / relative
    return (
        root_file.is_file()
        and android_file.is_file()
        and root_file.read_bytes() == android_file.read_bytes()
    )


def webp_names(base):
    directory = base / "bg"
    found = {}
    for size in ("d", "m"):
        folder = directory / size
        found[size] = sorted(path.name for path in folder.glob("*.webp")) if folder.is_dir() else []
    return found


root_frames = webp_names(ROOT)
android_frames = webp_names(ANDROID_ASSETS)
frame_files = [
    Path("bg") / size / name
    for size, names in root_frames.items()
    for name in names
]
pwa_parity = all(same_file(name) for name in PWA_FILES) and all(
    same_file(path.as_posix()) for path in frame_files
)
check(
    "Root and Android PWA assets match byte for byte",
    pwa_parity and root_frames == android_frames and root_frames["d"] == root_frames["m"] and len(root_frames["d"]) == 29,
    f"frames={len(root_frames['d'])}",
)
check(
    "Root PWA shell files and .nojekyll exist",
    all((ROOT / name).is_file() for name in PWA_FILES) and (ROOT / ".nojekyll").is_file(),
)

try:
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as error:
    manifest = {}
    manifest_error = str(error)
else:
    manifest_error = ""
icon_specs = {
    ("./icon-192.png", "192x192", "any"),
    ("./icon-512.png", "512x512", "any"),
    ("./icon-512-maskable.png", "512x512", "maskable"),
}
icon_found = {
    (item.get("src"), item.get("sizes"), item.get("purpose"))
    for item in manifest.get("icons", [])
    if isinstance(item, dict)
}
check(
    "PWA manifest uses relative scope and start_url",
    manifest.get("start_url") == "./"
    and manifest.get("scope") == "./"
    and manifest.get("display") == "standalone"
    and manifest.get("id") == "./"
    and not str(manifest.get("start_url", "")).startswith("/")
    and not str(manifest.get("scope", "")).startswith("/"),
    manifest_error,
)
check(
    "PWA manifest icons are relative and present",
    icon_specs <= icon_found
    and all((ROOT / src.removeprefix("./")).is_file() for src, _, _ in icon_specs),
)

sw_text = (ROOT / "sw.js").read_text(encoding="utf-8") if (ROOT / "sw.js").is_file() else ""
frame_match = re.search(r"var FRAMES = (\[[\s\S]*?\]);", sw_text)
try:
    sw_frames = json.loads(frame_match.group(1)) if frame_match else []
except json.JSONDecodeError:
    sw_frames = []
check(
    "Service worker cache version is current",
    "var VERSION = '2.9.1';" in sw_text
    and "var BUILD = 'web-pwa-2.9.1';" in sw_text
    and "anfoevo_v2_cache_" in sw_text
    and "robotnav-v2.8.0" not in sw_text,
)
check(
    "Service worker precaches relative core assets and both frame sets",
    all(token in sw_text for token in ("'./'", "'./index.html'", "'./manifest.json'", "'./bg/d/'", "'./bg/m/'"))
    and sw_frames == root_frames["d"] == root_frames["m"]
    and not re.search(r"""['"]/(?:index\.html|manifest\.json|sw\.js|icon-)""", sw_text),
    f"frames={len(sw_frames)}",
)

pwa_scripts = [
    block
    for block in re.findall(r"<script>([\s\S]*?)</script>", HTML)
    if "serviceWorker.register" in block
]
registration = pwa_scripts[0] if len(pwa_scripts) == 1 else ""
register_at = registration.find("serviceWorker.register")
check(
    "Service worker registration is limited to http(s) and skips android_asset",
    len(pwa_scripts) == 1
    and HTML.count("serviceWorker.register") == 1
    and "file:" in registration
    and "register('./sw.js')" in registration
    and 0 <= registration.find("http:") < register_at
    and 0 <= registration.find("https:") < register_at
    and 0 <= registration.find("android_asset") < register_at,
)
check(
    "index.html links manifest and icons with relative URLs",
    '<link rel="manifest" href="./manifest.json">' in HTML
    and '<link rel="icon" href="./icon-192.png"' in HTML
    and '<link rel="apple-touch-icon" href="./icon-192.png">' in HTML
    and 'href="/manifest.json"' not in HTML
    and 'href="data:,"' not in HTML,
)
impressum = re.search(r'id="imp-h"[\s\S]*?</section>', HTML)
impressum_text = impressum.group(0) if impressum else ""
check(
    "Impressum shows v2.9.1 and keeps the required DDG placeholder",
    "v2.9.1" in impressum_text
    and "v2.7.0" not in impressum_text
    and "§ 5 DDG" in impressum_text
    and PLACEHOLDER in impressum_text,
)
prepare_script = ROOT / "scripts" / "prepare-pages-surface.sh"
prepare_text = prepare_script.read_text(encoding="utf-8") if prepare_script.is_file() else ""
check(
    "Pages prepare script copies a web-only surface and does not publish",
    "dist/pages" in prepare_text
    and "android" in prepare_text
    and "tests" in prepare_text
    and "Gradle" in prepare_text
    and "does not enable GitHub Pages" in prepare_text
    and prepare_text.find("Refusing to delete") != -1
    and prepare_text.find("Refusing to delete") < prepare_text.find("rm -rf"),
)


class _SubpathHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        prefix = "/AnFoVO-Lernkompendium"
        if path != prefix and not path.startswith(prefix + "/"):
            self.send_error(404)
            return
        relative = path[len(prefix):].lstrip("/")
        if relative == "":
            relative = "index.html"
        candidate = (ROOT / relative).resolve()
        root_resolved = ROOT.resolve()
        if candidate != root_resolved and root_resolved not in candidate.parents:
            self.send_error(403)
            return
        if candidate.is_dir():
            candidate = candidate / "index.html"
        if not candidate.is_file():
            self.send_error(404)
            return
        payload = candidate.read_bytes()
        content_type = {
            ".html": "text/html",
            ".js": "text/javascript",
            ".json": "application/json",
            ".png": "image/png",
            ".webp": "image/webp",
        }.get(candidate.suffix, "application/octet-stream")
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            return response.status, response.read(), response.headers.get_content_type()
    except urllib.error.HTTPError as error:
        return error.code, error.read(), ""


def pages_subpath_detail():
    server = ThreadingHTTPServer(("127.0.0.1", 0), _SubpathHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    port = server.server_address[1]
    base = f"http://127.0.0.1:{port}/AnFoVO-Lernkompendium"
    try:
        page_status, page, page_type = fetch(base + "/")
        manifest_status, manifest_body, _ = fetch(base + "/manifest.json")
        worker_status, worker_body, _ = fetch(base + "/sw.js")
        icon_status, icon_body, icon_type = fetch(base + "/icon-192.png")
        frame_status, frame_body, frame_type = fetch(base + "/bg/d/r00.webp")
        mobile_status, _, _ = fetch(base + "/bg/m/z13.webp")
        marker_status, _, _ = fetch(base + "/.nojekyll")
        outside_status, _, _ = fetch(f"http://127.0.0.1:{port}/manifest.json")
        served_manifest = json.loads(manifest_body.decode("utf-8"))
        ok = (
            page_status == 200
            and page_type == "text/html"
            and b'href="./manifest.json"' in page
            and b"register('./sw.js')" in page
            and manifest_status == 200
            and served_manifest.get("start_url") == "./"
            and served_manifest.get("scope") == "./"
            and worker_status == 200
            and b"web-pwa-2.9.1" in worker_body
            and icon_status == 200
            and icon_type == "image/png"
            and icon_body.startswith(b"\x89PNG")
            and frame_status == 200
            and frame_type == "image/webp"
            and frame_body.startswith(b"RIFF")
            and mobile_status == 200
            and marker_status == 200
            and outside_status == 404
        )
        return ok, f"page={page_status}/{page_type} manifest={manifest_status} worker={worker_status} icon={icon_status}/{icon_type} frame={frame_status}/{frame_type} mobile={mobile_status} nojekyll={marker_status} outside={outside_status}"
    except (OSError, json.JSONDecodeError, urllib.error.URLError) as error:
        return False, str(error)
    finally:
        server.shutdown()
        server.server_close()


subpath_ok, subpath_detail = pages_subpath_detail()
check(
    "Pages subpath serves manifest, worker, icon, and background frames",
    subpath_ok,
    subpath_detail,
)

failed = [item for item in checks if not item["ok"]]
passed = len(checks) - len(failed)
report = {
    "version": "2.9.1",
    "static_checks": len(checks),
    "passed": passed,
    "failed": len(failed),
    "checks": checks,
}

(ROOT / "TESTBERICHT_v2.9.1.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
(ROOT / "TESTBERICHT_v2.9.1.txt").write_text(
    "\n".join(
        ("PASS" if item["ok"] else "FAIL")
        + " "
        + item["name"]
        + ((" — " + item["detail"]) if item["detail"] else "")
        for item in checks
    )
    + f"\n\nStatische Prüfungen: {passed} bestanden, {len(failed)} fehlgeschlagen.\n",
    encoding="utf-8",
)

print(
    json.dumps(
        {"passed": passed, "failed": len(failed), "failed_checks": failed},
        ensure_ascii=False,
        indent=2,
    )
)
sys.exit(1 if failed else 0)
