from pathlib import Path
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
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
    "RobotNav v2.8.0 embedded",
    HTML.count("RobotNav v2.8.0") >= 1 and "RobotNav v2.7.0" not in HTML,
)
check(
    "Standalone engine has no fetch/XHR/WebSocket",
    not re.search(r"\b(fetch\s*\(|XMLHttpRequest|WebSocket)\b", JS),
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
