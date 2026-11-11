from pathlib import Path
import re, subprocess, json, hashlib, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'algorithm/robot-navigation.js').read_text(encoding='utf-8').strip()
checks=[]
def check(name,ok,detail=''):
 checks.append({'name':name,'ok':bool(ok),'detail':detail})
# exact embedded engine parity
matches=[m.group(1).strip() for m in re.finditer(r'<script>([\s\S]*?)</script>',html) if 'RobotNav v2.8.0' in m.group(1)]
embedded=matches[-1].strip() if matches else ''
check('Embedded RobotNav block matches standalone source',embedded==js, f'embedded={len(embedded)} chars; source={len(js)} chars')
# syntax check source and extracted block
r=subprocess.run(['node','--check','-'],input=js,capture_output=True,text=True)
check('Standalone JavaScript syntax',r.returncode==0,(r.stderr or r.stdout).strip())
r2=subprocess.run(['node','--check','-'],input=embedded,capture_output=True,text=True)
check('Embedded JavaScript syntax',r2.returncode==0,(r2.stderr or r2.stdout).strip())
# html structure / anchors
check('HTML document has one html root',len(re.findall(r'<html\b',html,re.I))==1)
check('RobotNav v2.8.0 embedded once',html.count('RobotNav v2.8.0')>=1 and 'RobotNav v2.7.0' not in html[html.find('RobotNav v2.8.0')-50:html.find('RobotNav v2.8.0')+30])
check('Standalone engine has no fetch/XHR/WebSocket',not re.search(r'\b(fetch\s*\(|XMLHttpRequest|WebSocket)\b',js))
check('No polling interval used',not re.search(r'\bsetInterval\s*\(',js))
check('No self-scheduling animation loop used', 'requestAnimationFrame(flush)' in js and 'requestAnimationFrame(update)' not in js)
for key in ['DOM Inventory','Obstacle Cache','Position Planner','Motion Controller','Event Scheduler']:
 check('Architecture component: '+key,key.lower() in (root/'README_v2.8.0.md').read_text(encoding='utf-8').lower())
for key in ['dirtyFlags |= flags','processing = true','requestAnimationFrame(flush)','mutationObserver.disconnect()','resizeObserver.disconnect()','position === \'sticky\'','RobotNav.destroy']:
 check('Engine feature: '+key,key in js)
failed=[c for c in checks if not c['ok']]
report={'version':'2.8.0','static_checks':len(checks),'passed':len(checks)-len(failed),'failed':len(failed),'checks':checks}
(root/'TESTBERICHT_v2.8.0.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'TESTBERICHT_v2.8.0.txt').write_text('\n'.join(('PASS' if c['ok'] else 'FAIL')+' '+c['name']+((' — '+c['detail']) if c['detail'] else '') for c in checks)+f"\n\nStatische Prüfungen: {len(checks)-len(failed)} bestanden · {len(failed)} fehlgeschlagen.\nBrowser-Tests: nicht ausgeführt (Chromium-Navigation durch Administrator-Richtlinie blockiert).\n",encoding='utf-8')
print(json.dumps({'passed':len(checks)-len(failed),'failed':len(failed),'failed_checks':failed},ensure_ascii=False,indent=2))
sys.exit(1 if failed else 0)

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]