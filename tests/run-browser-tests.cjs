const { chromium } = require('playwright');
const path = require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('file://'+path.resolve(__dirname,'robotnav-harness.html'));
 await page.waitForTimeout(100);
 const initial=await page.evaluate(()=>RobotNav.inspect());
 if(initial.version!=='2.8.0'||!initial.cacheValid||initial.cacheSize<3)throw new Error('Initial inventory/cache not ready: '+JSON.stringify(initial));
 const initialScans=initial.diagnostics.scans;
 await page.evaluate(async()=>{const p=document.querySelector('#left-pane');for(let i=0;i<50;i++){p.scrollTop=i*5;p.dispatchEvent(new Event('scroll'));}await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
 const scrolled=await page.evaluate(()=>RobotNav.inspect());
 if(scrolled.diagnostics.scans!==initialScans)throw new Error('Scroll unexpectedly rescanned inventory');
 if(scrolled.scrollRoots<2)throw new Error('Nested scroll root not registered: '+scrolled.scrollRoots);
 await page.evaluate(async()=>{document.querySelector('#right-pane').remove();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
 const afterRemove=await page.evaluate(()=>RobotNav.inspect());
 if(afterRemove.cacheSize>=scrolled.cacheSize)throw new Error('Removed subtree retained in cache');
 await page.evaluate(()=>{document.dispatchEvent(new Event('load',{bubbles:true}));window.dispatchEvent(new Event('kompendium:pagechange'));});
 await page.waitForTimeout(100);
 const afterLayout=await page.evaluate(()=>RobotNav.inspect());
 if(!afterLayout.cacheValid)throw new Error('Layout invalidation failed');
 const loop=await page.evaluate(async()=>{const d=RobotNav.inspect().diagnostics.flushes;const stage=document.querySelector('#object-stage');stage.classList.add('robot-nav-hidden');await new Promise(r=>setTimeout(r,160));return RobotNav.inspect().diagnostics.flushes-d;});
 if(loop>2)throw new Error('Observer self-trigger suspected: '+loop+' flushes');
 await page.evaluate(()=>RobotNav.destroy());
 const afterDestroy=await page.evaluate(async()=>{window.dispatchEvent(new Event('resize'));await new Promise(r=>requestAnimationFrame(r));return typeof window.RobotNav;});
 if(afterDestroy!=='undefined')throw new Error('destroy did not unregister API');
 if(errors.length)throw new Error('Browser errors: '+errors.join(' | '));
 console.log(JSON.stringify({pass:true,initialScans,scrollScans:scrolled.diagnostics.scans,scrollRoots:scrolled.scrollRoots,cacheBefore:scrolled.cacheSize,cacheAfter:afterRemove.cacheSize,selfTriggerFlushes:loop,maxFlushMs:afterLayout.diagnostics.maxFlushMs,errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]