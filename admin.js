/* Shared admin helper: stores GitHub connection settings in this browser's
   localStorage, and reads/writes data.json in the repo via the GitHub REST API. */

const LS_KEY = 'dfir_portfolio_admin_settings_v1';

function getSettings(){
  try{
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  }catch(e){
    return {};
  }
}

function saveSettings(s){
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function settingsComplete(s){
  return !!(s.owner && s.repo && s.token);
}

// utf-8 safe base64 encode/decode
function b64EncodeUtf8(str){
  return btoa(unescape(encodeURIComponent(str)));
}
function b64DecodeUtf8(str){
  return decodeURIComponent(escape(atob(str)));
}

async function ghRequest(url, options = {}){
  const s = getSettings();
  const headers = Object.assign({
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${s.token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }, options.headers || {});
  const res = await fetch(url, Object.assign({}, options, { headers }));
  if(!res.ok){
    let msg = `GitHub API error ${res.status}`;
    try{
      const body = await res.json();
      if(body && body.message) msg += `: ${body.message}`;
    }catch(e){}
    throw new Error(msg);
  }
  return res.json();
}

/** Fetch data.json content + its current sha (needed to update it). */
async function fetchDataFile(){
  const s = getSettings();
  const branch = s.branch || 'main';
  const url = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/data.json?ref=${encodeURIComponent(branch)}`;
  const file = await ghRequest(url);
  const content = JSON.parse(b64DecodeUtf8(file.content.replace(/\n/g, '')));
  return { content, sha: file.sha };
}

/** Write updated data back to data.json with a commit. */
async function writeDataFile(newContentObj, sha, message){
  const s = getSettings();
  const branch = s.branch || 'main';
  const url = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/data.json`;
  const body = {
    message: message || 'Update portfolio content',
    content: b64EncodeUtf8(JSON.stringify(newContentObj, null, 2)),
    sha: sha,
    branch: branch
  };
  return ghRequest(url, { method: 'PUT', body: JSON.stringify(body) });
}

/* ---------- Settings panel UI, shared by both admin pages ---------- */

function renderSettingsPanel(container, onReady){
  const s = getSettings();
  container.innerHTML = `
    <div class="card" id="settingsCard">
      <h2>GitHub connection</h2>
      <label>Repo owner (your GitHub username)</label>
      <input type="text" id="setOwner" placeholder="yourusername" value="${s.owner || ''}">

      <label>Repository name</label>
      <input type="text" id="setRepo" placeholder="yourusername.github.io" value="${s.repo || ''}">

      <label>Branch</label>
      <input type="text" id="setBranch" placeholder="main" value="${s.branch || 'main'}">

      <label>Personal access token</label>
      <input type="password" id="setToken" placeholder="github_pat_..." value="${s.token || ''}">
      <p class="hint">Use a fine-grained token scoped to only this repo, with "Contents: Read and write" permission. It's saved only in this browser's local storage — never committed to the repo.</p>

      <div class="row">
        <button class="primary" id="setSave">Save & connect</button>
        <button class="danger" id="setClear">Clear token</button>
      </div>
      <div id="setStatus"></div>
    </div>
  `;

  const status = container.querySelector('#setStatus');

  container.querySelector('#setSave').addEventListener('click', async () => {
    const newS = {
      owner: container.querySelector('#setOwner').value.trim(),
      repo: container.querySelector('#setRepo').value.trim(),
      branch: container.querySelector('#setBranch').value.trim() || 'main',
      token: container.querySelector('#setToken').value.trim()
    };
    if(!settingsComplete(newS)){
      status.innerHTML = `<div class="status err">Owner, repo, and token are required.</div>`;
      return;
    }
    saveSettings(newS);
    status.innerHTML = `<div class="status pending">Connecting…</div>`;
    try{
      await fetchDataFile();
      status.innerHTML = `<div class="status ok">Connected — data.json found and readable.</div>`;
      if(onReady) onReady();
    }catch(e){
      status.innerHTML = `<div class="status err">${e.message}</div>`;
    }
  });

  container.querySelector('#setClear').addEventListener('click', () => {
    localStorage.removeItem(LS_KEY);
    location.reload();
  });

  // auto-connect if settings already saved
  if(settingsComplete(s) && onReady){
    fetchDataFile().then(onReady).catch(e => {
      status.innerHTML = `<div class="status err">${e.message}</div>`;
    });
  }
}
