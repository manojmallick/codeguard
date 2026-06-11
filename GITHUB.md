# GitHub Setup — About, Topics, Publish

Authenticated `gh` user: **manojmallick**. The folder isn't a git repo yet — this gets it onto
GitHub with a clean **About** blurb and **topic tags**.

## 1. About (repo description)
Paste into **Settings → General → Description**, or set via CLI below:

> **DORA Art.9 compliance agent for GitLab MRs — Gemini 3 reasoning, human-gated GitLab writes, auto-remediation, and a blocking CI gate. Built on Google Cloud Agent Builder + Cloud Run.**

**Website:** `https://codeguard-908307939543.europe-west1.run.app`

## 2. Topics (tags)
```
gemini  gemini-3  google-cloud  agent-builder  cloud-run  gitlab  mcp
model-context-protocol  dora  compliance  devsecops  ai-agent  code-review
regtech  fintech  hackathon  nodejs  express  llm  security
```

## 3. One-shot publish (copy-paste)
```bash
cd /Users/manojmallick/Documents/innovation/google/codeguard-starter

# safety: make sure secrets never ship
grep -qxF '.env' .gitignore || echo '.env' >> .gitignore
echo "node_modules/" >> .gitignore; sort -u .gitignore -o .gitignore

git init -b main
git add -A
git commit -m "CodeGuard — DORA Art.9 review agent (Gemini 3 + GitLab MCP + Cloud Run)"

# create the GitHub repo (public) with description + website, then push
gh repo create codeguard \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "DORA Art.9 compliance agent for GitLab MRs — Gemini 3 reasoning, human-gated GitLab writes, auto-remediation, and a blocking CI gate. Built on Google Cloud Agent Builder + Cloud Run."

# add topics + homepage
gh repo edit --homepage "https://codeguard-908307939543.europe-west1.run.app" \
  --add-topic gemini --add-topic gemini-3 --add-topic google-cloud --add-topic agent-builder \
  --add-topic cloud-run --add-topic gitlab --add-topic mcp --add-topic model-context-protocol \
  --add-topic dora --add-topic compliance --add-topic devsecops --add-topic ai-agent \
  --add-topic code-review --add-topic regtech --add-topic fintech --add-topic hackathon \
  --add-topic nodejs --add-topic express --add-topic llm --add-topic security
```

## 4. Verify
```bash
gh repo view --web        # opens the repo; check About + topics render
```

## Notes
- `.env` is gitignored — secrets stay local; the app reads them from Secret Manager in production.
- `docs/screenshots/*.png`, `architecture.png`, and `DECK.pdf` **are** committed (gallery assets).
- Want it private first? swap `--public` for `--private`.
