# Security Policy & Mitigations — ChessOS Pro

## 1. OWASP Top 10 Risk Matrix & Protections

### A01:2021-Broken Access Control
- **Mitigation:** Hono JWT middleware verifies token signatures and credentials on all `/api/user/*` paths.
- **Rule:** A student cannot fetch or modify another user's progress log or SRS card data by swapping the `userId` param. Ownership queries are enforced at the database layer.

### A02:2021-Cryptographic Failures
- **Mitigation:** Secure all transit via HTTPS/TLS 1.3. Passwords must be hashed using `bcrypt` (work factor 10) before storage in Cloudflare D1.

### A03:2021-Injection Attacks
- **Mitigation:**
  - SQL queries are executed via parameterized bindings in Cloudflare D1 to prevent SQL Injection.
  - DOM-based XSS is mitigated by React's default safe string escaping. Dangerous nodes are sterilized using `dompurify` if raw HTML rendering is required.

---

## 2. CSRF & Session Protections
- **CSRF Mitigations:** Double-Submit Cookie patterns. The backend expects a custom request header `X-XSRF-TOKEN` matching a cookie token generated on authentication.
- **Session Protections:** HttpOnly cookies prevent client-side JS scripts from accessing JWT tokens, eliminating token extraction via XSS vulnerabilities. Cookies must have `Secure` and `SameSite=Strict` flags enabled.

---

## 3. Dependency Scanning & Audits
- Automated dependency check runs in the CI pipeline:
  ```bash
  npm audit --audit-level=high
  ```
- Dependency scans fail GHA pipelines if severe security warnings are found.
- Secret scanning is executed via `git-secrets` to prevent accidental push of private API credentials or local keys.
