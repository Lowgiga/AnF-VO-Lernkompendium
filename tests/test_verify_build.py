"""Regression tests for the static build verification's offline invariants."""

import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
ASSET = Path("android/app/src/main/assets/index.html")
ENGINE = Path("algorithm/robot-navigation.js")


class VerifyBuildTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for relative in [
            Path("tests/verify-build.py"),
            Path("index.html"),
            ASSET,
            ENGINE,
            Path("docs/ARCHITECTURE.md"),
        ]:
            target = self.root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / relative, target)

    def run_check(self, name):
        result = subprocess.run(
            [sys.executable, str(self.root / "tests/verify-build.py")],
            capture_output=True,
            text=True,
            check=False,
        )
        report = json.loads(result.stdout)
        failure = next(
            (item for item in report["failed_checks"] if item["name"] == name), None
        )
        return result.returncode, failure

    def test_android_asset_parity_and_missing_asset(self):
        name = "Android HTML asset matches index.html byte for byte"
        self.assertEqual(self.run_check(name), (0, None))
        (self.root / ASSET).write_bytes((self.root / ASSET).read_bytes() + b"\n")
        status, failure = self.run_check(name)
        self.assertEqual(status, 1)
        self.assertIsNotNone(failure)
        (self.root / ASSET).unlink()
        status, failure = self.run_check(name)
        self.assertEqual(status, 1)
        self.assertIsNotNone(failure)

    def test_network_apis_are_rejected(self):
        name = "Standalone engine has no fetch/XHR/WebSocket"
        engine = self.root / ENGINE
        original = engine.read_text(encoding="utf-8")
        self.assertEqual(self.run_check(name), (0, None))
        for expression in [
            "fetch('/data')",
            "fetch  ('/data')",
            "new XMLHttpRequest()",
            "new WebSocket('/data')",
        ]:
            with self.subTest(expression=expression):
                engine.write_text(original + "\n" + expression + ";\n", encoding="utf-8")
                status, failure = self.run_check(name)
                self.assertEqual(status, 1)
                self.assertIsNotNone(failure)


if __name__ == "__main__":
    unittest.main()
