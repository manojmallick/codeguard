// DORA / NIS2 / GDPR code-compliance rules. Cheap deterministic pre-filter; Gemini 3
// then reasons over the flagged hunks to cut false positives and draft fixes.
// Patterns are intentionally simple regex signals — tune per language/framework.

export const CHECKS = {
  logging_completeness: {
    article: "DORA Art.9 + NIS2 Art.21",
    severity: "critical",
    required: ["logger.info", "logger.warn", "logger.error", "log."],
    redFlags: ["System.out.println", "e.printStackTrace", /catch\s*\([^)]*\)\s*\{\s*\}/],
    message: "Security operations must have structured logging",
  },
  encryption_sensitive_data: {
    article: "DORA Art.9",
    severity: "critical",
    // Negative lookahead: only flag saving cardNumber when NOT wrapped in encrypt(...)
    redFlags: [/password\s*=\s*["'][^"']+["']/i, /store.*unencrypted/i, /save\((?:(?!encrypt).)*?cardNumber/i],
    message: "Sensitive data must be encrypted before storage",
  },
  authorization_checks: {
    article: "DORA Art.9 + GDPR Art.25",
    severity: "critical",
    required: ["@PreAuthorize", "hasRole", "checkPermission", "authorize"],
    redFlags: ["// TODO: add auth", "skipAuthorization"],
    message: "Authorization must be verified before data access",
  },
  audit_trail: {
    article: "DORA Art.9",
    severity: "high",
    required: ["auditLog", "AuditEntry", "recordChange", "auditService"],
    message: "Data modifications must create audit log entries",
  },
  safe_error_handling: {
    article: "DORA Art.9",
    severity: "high",
    // Order-independent: flag when a response/client/user sink is combined with a
    // stack trace / raw exception message / SQL exception in the same hunk.
    redFlags: [
      /(response|res|client|user|send|write|render)[\s\S]{0,80}(stack ?trace|exception\.(?:message|getMessage\(\))|sqlexception|printstacktrace)/i,
      /(stack ?trace|exception\.(?:message|getMessage\(\))|sqlexception|printstacktrace)[\s\S]{0,80}(response|res\.|client|user|\.send|\.write|render)/i,
    ],
    message: "Error messages must not expose system internals",
  },
};

const test = (pat, text) => (pat instanceof RegExp ? pat.test(text) : text.includes(pat));

/**
 * Deterministic scan of an added-lines diff blob.
 * @returns {Array} findings: { id, article, severity, message, evidence }
 */
export function scanDiff(addedCode) {
  const findings = [];
  for (const [id, rule] of Object.entries(CHECKS)) {
    const hitFlag = (rule.redFlags || []).find((p) => test(p, addedCode));
    if (hitFlag) {
      findings.push({ id, article: rule.article, severity: rule.severity, message: rule.message, evidence: String(hitFlag) });
      continue;
    }
    // "required" patterns: if this hunk clearly handles the concern but none present → warn.
    // Kept conservative; Gemini 3 makes the final call in agent.js.
  }
  return findings;
}

/**
 * Fix-verification loop: re-scan the PROPOSED fixed code and confirm the same rule no
 * longer fires. A fix we can't verify shouldn't be presented as done. Deterministic.
 * @returns {{ verified: boolean, residual: string[] }}  residual = rule ids still firing
 */
export function verifyFix(ruleId, fixedCode) {
  if (!fixedCode) return { verified: false, residual: ["no_fix_provided"] };
  const residual = scanDiff(fixedCode).map((f) => f.id);
  return { verified: !residual.includes(ruleId), residual };
}
