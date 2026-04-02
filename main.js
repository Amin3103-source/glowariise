const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const { execSync, exec } = require("child_process");

const DATA_PATH = path.join(app.getPath("userData"), "data.json");
const HOSTS = "/etc/hosts";
const TAG_S = "# GlowArise START";
const TAG_E = "# GlowArise END";

const EXTRAS = {
  "youtube.com":   ["youtu.be","ytimg.com","googlevideo.com","youtube-nocookie.com"],
  "x.com":         ["twitter.com","t.co","twimg.com"],
  "twitter.com":   ["x.com","t.co","twimg.com"],
  "instagram.com": ["cdninstagram.com"],
  "tiktok.com":    ["tiktokv.com","tiktokcdn.com"],
  "reddit.com":    ["redd.it","redditmedia.com","redditstatic.com"],
  "netflix.com":   ["nflximg.com","nflxvideo.net","nflxso.net"],
  "twitch.tv":     ["jtvnw.net"],
  "facebook.com":  ["fb.com","fbcdn.net"],
};

const ADULT = [
  "pornhub.com","xvideos.com","xnxx.com","xhamster.com","redtube.com",
  "youporn.com","tube8.com","beeg.com","spankbang.com","onlyfans.com",
  "fansly.com","chaturbate.com","myfreecams.com","cam4.com","stripchat.com",
];

function expand(d) {
  const c = d.replace(/^www\./, "").replace(/^m\./, "");
  const extras = EXTRAS[c] || [];
  // Return base domain + wildcard for ALL subdomains
  return [...new Set([
    c,
    `www.${c}`,
    `m.${c}`,
    ...extras,
    ...extras.map(e => `www.${e}`),
  ])];
}

// Build wildcard hosts entries — blocks ALL subdomains
function buildHostsLines(domains) {
  const lines = [];
  for (const d of domains) {
    lines.push(`0.0.0.0 ${d}`);
    lines.push(`::1 ${d}`);
  }
  return [...new Set(lines)];
}

// ─── State ────────────────────────────────────────────────────────────────────
let win = null, tray = null, sessionTimer = null, freigangTimer = null;

function defaultData() {
  return {
    blocklist:[], todos:[], session:null, freigang:null, alwaysOn:false,
    stats:{ totalSessions:0, totalMinutes:0, todaySessions:0, todayMinutes:0,
            lastDate:"", streak:0, lastSessionDate:"", monthMinutes:0, lastMonth:"" },
    prefs:{ sound:true, theme:"dark", lang:"de" }
  };
}
function loadData() {
  try {
    if (fs.existsSync(DATA_PATH))
      return { ...defaultData(), ...JSON.parse(fs.readFileSync(DATA_PATH,"utf-8")) };
  } catch(_) {}
  return defaultData();
}
function saveData(d) { fs.writeFileSync(DATA_PATH, JSON.stringify(d,null,2), "utf-8"); }

// ─── Hosts ────────────────────────────────────────────────────────────────────
function strip() {
  const raw = fs.readFileSync(HOSTS, "utf-8");
  return raw.replace(new RegExp(`\n?${TAG_S}[\\s\\S]*?${TAG_E}\n?`,"g"), "\n");
}

function applyBlocking(closeTabs = false) {
  const data = loadData();
  let domains = new Set();
  let rootDomains = new Set(); // for Safari tab closing

  if (data.alwaysOn) ADULT.forEach(d => {
    const c = d.replace(/^www\./, "");
    rootDomains.add(c);
    expand(d).forEach(x => domains.add(x));
  });

  const inFreigang = data.freigang?.active && data.freigang.endTime > Date.now();
  if (data.session?.active && !inFreigang) {
    data.blocklist.forEach(d => {
      const c = d.replace(/^www\./, "");
      rootDomains.add(c);
      expand(d).forEach(x => domains.add(x));
    });
  }

  let hosts = strip();

  if (domains.size === 0) {
    fs.writeFileSync(HOSTS, hosts, "utf-8");
    flushDNS();
    return;
  }

  const lines = buildHostsLines([...domains]);
  hosts += `\n${TAG_S}\n${lines.join("\n")}\n${TAG_E}\n`;
  fs.writeFileSync(HOSTS, hosts, "utf-8");
  flushDNS();

  // Close Safari tabs for blocked domains
  if (closeTabs && rootDomains.size > 0) {
    closeSafariTabs([...rootDomains]);
  }
}

function closeSafariTabs(rootDomains) {
  // Build AppleScript condition
  const checks = rootDomains
    .map(d => `(theURL contains "${d}")`)
    .join(" or ");

  const script = `
tell application "Safari"
  try
    set allWindows to every window
    repeat with w in allWindows
      set allTabs to every tab of w
      set tabsToClose to {}
      repeat with t in allTabs
        try
          set theURL to URL of t
          if ${checks} then
            set end of tabsToClose to t
          end if
        end try
      end repeat
      repeat with t in tabsToClose
        close t
      end repeat
    end repeat
  end try
end tell`.trim();

  exec(`osascript -e '${script.replace(/'/g, "'\''")}'`, (err) => {
    if (err) console.log("Safari tab close:", err.message);
  });
}

function clearBlocking() {
  try { fs.writeFileSync(HOSTS, strip(), "utf-8"); flushDNS(); } catch(_) {}
}

function flushDNS() {
  try { execSync("dscacheutil -flushcache; killall -HUP mDNSResponder", { timeout:5000 }); } catch(_) {}
}

// ─── Session ──────────────────────────────────────────────────────────────────
function startSession(minutes, blocklist) {
  const data = loadData();
  const endTime = Date.now() + minutes * 60 * 1000;
  data.session = { active:true, endTime, minutes, blocklist, startedAt:Date.now() };
  data.blocklist = blocklist;
  saveData(data);
  try { applyBlocking(true); } catch(e) { return { ok:false, error:e.message }; }
  updateTray();
  if (sessionTimer) clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => { endSession(); win?.webContents.send("session-ended"); }, minutes*60*1000);
  return { ok:true, endTime };
}

function endSession() {
  const data = loadData();
  data.session = null;
  saveData(data);
  try { applyBlocking(); } catch(_) {}
  updateTray();
  if (sessionTimer) { clearTimeout(sessionTimer); sessionTimer = null; }
}

function startFreigang(minutes) {
  const data = loadData();
  const endTime = Date.now() + minutes * 60 * 1000;
  data.freigang = { active:true, endTime, minutes };
  saveData(data);
  try { applyBlocking(); } catch(_) {}
  updateTray();
  if (freigangTimer) clearTimeout(freigangTimer);
  freigangTimer = setTimeout(() => { endFreigang(); win?.webContents.send("freigang-ended"); }, minutes*60*1000);
  return { ok:true, endTime };
}

function endFreigang() {
  const data = loadData();
  data.freigang = null;
  saveData(data);
  try { applyBlocking(); } catch(_) {}
  updateTray();
  if (freigangTimer) { clearTimeout(freigangTimer); freigangTimer = null; }
}

function setAlwaysOn(on) {
  const data = loadData(); data.alwaysOn = on; saveData(data);
  try { applyBlocking(); } catch(_) {}
  updateTray(); return { ok:true };
}

function checkWritable() {
  try { fs.accessSync(HOSTS, fs.constants.W_OK); return true; } catch(_) { return false; }
}

function quit() { clearBlocking(); app.exit(0); }

// ─── Tray ─────────────────────────────────────────────────────────────────────
function makePNG(size,[r,g,b]){function crc32(buf){const t=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[i]=c;}let crc=0xffffffff;for(const byte of buf)crc=t[(crc^byte)&0xff]^(crc>>>8);return(crc^0xffffffff)>>>0;}function chunk(name,data){const nb=Buffer.from(name,"ascii"),cb=Buffer.alloc(4),lb=Buffer.alloc(4);const combined=Buffer.concat([nb,data]);cb.writeUInt32BE(crc32(combined),0);lb.writeUInt32BE(data.length,0);return Buffer.concat([lb,nb,data,cb]);}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=2;let raw=Buffer.alloc(0);for(let y=0;y<size;y++){let row=Buffer.alloc(1+size*3);for(let x=0;x<size;x++){row[1+x*3]=r;row[2+x*3]=g;row[3+x*3]=b;}raw=Buffer.concat([raw,row]);}return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",zlib.deflateSync(raw)),chunk("IEND",Buffer.alloc(0))]);}

function getTrayIcon(state) {
  const base = app.isPackaged ? process.resourcesPath : __dirname;
  // Use the same logo for all states, just change tooltip
  const iconPath = path.join(base, "tray-22.png");
  if (fs.existsSync(iconPath)) {
    return nativeImage.createFromPath(iconPath).resize({ width: 22, height: 22 });
  }
  // Fallback to colored square
  const color = state === "session" ? [201,168,76] : state === "freigang" ? [249,115,22] : [80,80,80];
  return nativeImage.createFromBuffer(Buffer.from(makePNG(16, color)));
}

function updateTray() {
  if (!tray) return;
  const data = loadData();
  const sessionOn = data.session?.active;
  const freigangOn = data.freigang?.active && data.freigang.endTime > Date.now();
  const state = freigangOn ? "freigang" : sessionOn ? "session" : "idle";
  tray.setImage(getTrayIcon(state));
  tray.setToolTip(sessionOn?"GlowArise — Session aktiv ✦":"GlowArise");
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:sessionOn?"✦ Session aktiv":"GlowArise",enabled:false},
    {type:"separator"},
    {label:"Öffnen",click:()=>{win?.show();win?.focus();}},
    ...(sessionOn?[{label:"Session beenden",click:()=>{endSession();win?.webContents.send("session-ended");}}]:[]),
    ...(freigangOn?[{label:"Freigang beenden",click:()=>{endFreigang();win?.webContents.send("freigang-ended");}}]:[]),
    {type:"separator"},
    {label:"Beenden",click:quit},
  ]));
}

// ─── IPC ─────────────────────────────────────────────────────────────────────
ipcMain.handle("get-data",       ()      => loadData());
ipcMain.handle("save-data",      (_,d)   => { saveData(d); return {ok:true}; });
ipcMain.handle("start-session",  (_,o)   => startSession(o.minutes, o.blocklist));
ipcMain.handle("end-session",    ()      => { endSession(); return {ok:true}; });
ipcMain.handle("start-freigang", (_,o)   => startFreigang(o.minutes));
ipcMain.handle("end-freigang",   ()      => { endFreigang(); return {ok:true}; });
ipcMain.handle("set-always-on",  (_,on)  => setAlwaysOn(on));
ipcMain.handle("check-writable", ()      => checkWritable());
ipcMain.handle("quit-app",       ()      => quit());

// ─── App ─────────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  const data = loadData();
  if (data.session?.active) {
    const rem = data.session.endTime - Date.now();
    if (rem > 0) sessionTimer = setTimeout(() => { endSession(); win?.webContents.send("session-ended"); }, rem);
    else endSession();
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {label:"GlowArise",submenu:[
      {label:"Öffnen",click:()=>{win?.show();win?.focus();}},
      {type:"separator"},
      {label:"Beenden",accelerator:"CmdOrCtrl+Q",click:quit},
    ]},
    {label:"Bearbeiten",submenu:[
      {role:"cut"},{role:"copy"},{role:"paste"},{role:"selectAll"},
    ]},
  ]));

  // Use real logo as tray icon
  const trayIconPath = app.isPackaged
    ? path.join(process.resourcesPath, "tray-22.png")
    : path.join(__dirname, "tray-22.png");
  
  const trayIcon = nativeImage.createFromPath(trayIconPath).resize({ width: 22, height: 22 });
  tray = new Tray(trayIcon);
  updateTray();
  tray.on("click", ()=>{win?.show();win?.focus();});

  win = new BrowserWindow({
    width:500, height:720, minWidth:420, minHeight:600, title:"GlowArise",
    webPreferences:{ preload:path.join(__dirname,"preload.js"), contextIsolation:true, nodeIntegration:false },
    backgroundColor:"#0E0E10",
    titleBarStyle:"hiddenInset",
    show:false,
  });
  win.loadFile(path.join(__dirname,"src","index.html"));
  win.once("ready-to-show", ()=>win.show());
  win.on("close", e=>{e.preventDefault();win.hide();});
});

app.on("window-all-closed", ()=>{});
app.on("before-quit", ()=>clearBlocking());
