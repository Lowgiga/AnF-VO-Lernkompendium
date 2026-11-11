from pathlib import Path
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import json, os, functools
root=Path(__file__).resolve().parent
handler=functools.partial(SimpleHTTPRequestHandler, directory=str(root))
server=ThreadingHTTPServer(('127.0.0.1',0),handler)
Thread(target=server.serve_forever,daemon=True).start()
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'), args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(f"http://127.0.0.1:{server.server_port}/robotnav-harness.html")
    page.wait_for_timeout(100)
    initial=page.evaluate('RobotNav.inspect()')
    assert initial['version']=='2.8.0' and initial['cacheValid'] and initial['cacheSize']>=3, initial
    initial_scans=initial['diagnostics']['scans']
    page.evaluate('''async()=>{const p=document.querySelector('#left-pane');for(let i=0;i<50;i++){p.scrollTop=i*5;p.dispatchEvent(new Event('scroll'));}await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}''')
    scrolled=page.evaluate('RobotNav.inspect()')
    assert scrolled['diagnostics']['scans']==initial_scans, scrolled
    assert scrolled['scrollRoots']>=2, scrolled
    page.evaluate('''async()=>{document.querySelector('#right-pane').remove();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}''')
    removed=page.evaluate('RobotNav.inspect()')
    assert removed['cacheSize']<scrolled['cacheSize'], (scrolled,removed)
    page.evaluate("document.dispatchEvent(new Event('load',{bubbles:true}));window.dispatchEvent(new Event('kompendium:pagechange'))")
    page.wait_for_timeout(100)
    relayout=page.evaluate('RobotNav.inspect()')
    assert relayout['cacheValid'], relayout
    loop=page.evaluate('''async()=>{const before=RobotNav.inspect().diagnostics.flushes;document.querySelector('#object-stage').classList.add('robot-nav-hidden');await new Promise(r=>setTimeout(r,160));return RobotNav.inspect().diagnostics.flushes-before;}''')
    assert loop<=2, loop
    page.evaluate('RobotNav.destroy()')
    api=page.evaluate("typeof window.RobotNav")
    assert api=='undefined', api
    assert not errors, errors
    result={'pass':True,'initialScans':initial_scans,'scrollScans':scrolled['diagnostics']['scans'],'scrollRoots':scrolled['scrollRoots'],'cacheBefore':scrolled['cacheSize'],'cacheAfter':removed['cacheSize'],'selfTriggerFlushes':loop,'maxFlushMs':relayout['diagnostics']['maxFlushMs'],'errors':errors}
    print(json.dumps(result,indent=2))
    browser.close()
server.shutdown()

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]