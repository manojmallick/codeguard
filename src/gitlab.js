// GitLab integration — the partner capability.
//
// The JUDGED agent reaches GitLab through the GitLab MCP server inside Google Cloud
// Agent Builder (see agent-builder/agent.json). This module mirrors the same reads/
// writes via the GitLab REST API so the hosted web app + webhook flow run end-to-end.
// Keep the two in sync (same project, same MR).

const API = process.env.GITLAB_API_URL || "https://gitlab.com";
const TOKEN = process.env.GITLAB_TOKEN;

async function gl(path, init = {}) {
  const res = await fetch(`${API}/api/v4${path}`, {
    ...init,
    headers: { "PRIVATE-TOKEN": TOKEN, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`GitLab ${res.status} ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// --- READS (run automatically) ---
export const getMR = (projectId, iid) => gl(`/projects/${encodeURIComponent(projectId)}/merge_requests/${iid}`);

export async function getMRChanges(projectId, iid) {
  const d = await gl(`/projects/${encodeURIComponent(projectId)}/merge_requests/${iid}/changes`);
  return (d.changes || []).map((c) => ({
    path: c.new_path,
    // added lines only (diff lines starting with "+", excluding the "+++" header)
    added: (c.diff || "").split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).map((l) => l.slice(1)).join("\n"),
  }));
}

// --- WRITES (consequential — gated on human approval in server.js /execute) ---
export const postNote = (projectId, iid, body) =>
  gl(`/projects/${encodeURIComponent(projectId)}/merge_requests/${iid}/notes`, { method: "POST", body: JSON.stringify({ body }) });

export const setLabels = (projectId, iid, labels) =>
  gl(`/projects/${encodeURIComponent(projectId)}/merge_requests/${iid}`, { method: "PUT", body: JSON.stringify({ add_labels: labels }) });

export const createIssue = (projectId, title, description) =>
  gl(`/projects/${encodeURIComponent(projectId)}/issues`, { method: "POST", body: JSON.stringify({ title, description }) });

// --- AUTO-REMEDIATION writes: push a fix branch + open a remediation MR (gated) ---
export async function getFileContent(projectId, ref, path) {
  const d = await gl(`/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`);
  return Buffer.from(d.content, "base64").toString("utf8");
}

export const commitActions = (projectId, branch, startBranch, message, actions) =>
  gl(`/projects/${encodeURIComponent(projectId)}/repository/commits`, {
    method: "POST",
    body: JSON.stringify({ branch, start_branch: startBranch, commit_message: message, actions }),
  });

export const createMergeRequest = (projectId, source, target, title, description) =>
  gl(`/projects/${encodeURIComponent(projectId)}/merge_requests`, {
    method: "POST",
    body: JSON.stringify({ source_branch: source, target_branch: target, title, description }),
  });

// --- SHARED Obligation ledger + audit log (same schema as RegQuery / IncidentIQ).
//     A confirmed code violation IS a compliance-debt obligation. MOCK = in-memory. ---
const mem = { obligations: [], audit: [] };

export async function recordObligations(companyId, obligations = []) {
  const now = new Date().toISOString();
  const docs = obligations.map((o) => ({
    company_id: companyId,
    obligation_id: o.obligation_id || `${o.regulation || "DORA"}-${(o.article || "?").replace(/\s+/g, "")}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    regulation: o.regulation || "DORA", article: o.article || null, who: o.who || "Engineering",
    what: o.what || null, deadline: o.deadline || null, authority: o.authority || "Internal ICT risk",
    trigger: o.trigger || null, severity: o.severity || null, status: "open", created_at: now,
  }));
  if (!docs.length) return { inserted: 0 };
  // Always keep an in-memory ledger so the compliance-debt view + CSV export work in
  // every mode (MOCK, demo sandbox, and live). Swap for a real store of record later.
  mem.obligations.push(...docs);
  return { inserted: docs.length };
}
export async function listObligations(companyId) {
  return mem.obligations.filter((o) => o.company_id === companyId);
}
export async function recordAudit(entry) {
  const doc = { ...entry, at: new Date().toISOString() };
  mem.audit.push(doc);
  return doc;
}

export async function pingGitLab() {
  if (process.env.MOCK === "true") return true;
  try { await gl(`/version`); return true; } catch { return false; }
}
