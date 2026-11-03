/* ============================================================
   Aditi Sonawane – Technical Portfolio
   script.js  –  Vanilla JS, zero dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Theme Toggle ──────────────────────────────────────
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunIcon  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeBtn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  setTheme(localStorage.getItem('theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Mobile Navigation ─────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // ── Active nav link on scroll ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  // ── Scroll Reveal ─────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObs.observe(r));

  // ── RCA Playground Data ───────────────────────────────
  const scenarios = [
    {
      id: 'scenario-1',
      triage: `
        <div class="triage-step">
          <span class="triage-time">T+00:00</span>
          <div class="triage-body">
            <h5>P1 Alert Triggered <span class="status-pill isolated">P1 Exception Isolated</span></h5>
            <p>Automated monitoring detects <code class="mono">HTTP 500</code> on <code class="mono">POST /api/v2/mock-tax-engine/compute</code>. German B2B checkout pipeline halted for DACH enterprise accounts.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+04:00</span>
          <div class="triage-body">
            <h5>Initial Triage & Payload Capture</h5>
            <p>Reproduced failing request in Postman. Identified malformed German postal zone <code class="mono">"D-10115"</code> in request body triggering <code class="mono">MockAddressSanitizer.parseZone:Line 88</code> exception.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+12:00</span>
          <div class="triage-body">
            <h5>Database Impact Assessment</h5>
            <p>Queried staging DB to scope blast radius: 47 affected German enterprise accounts with legacy postal prefix format across SAP and Salesforce CPQ connectors.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+28:00</span>
          <div class="triage-body">
            <h5>Immediate Workaround Deployed <span class="status-pill active">Mitigation Active</span></h5>
            <p>Applied connector mapping override: <code class="mono">"D-10115" → "10115"</code>. Validated workaround against 5 test accounts in staging environment.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+42:00</span>
          <div class="triage-body">
            <h5>Resolution Confirmed <span class="status-pill resolved">SLA Met — Resolved</span></h5>
            <p>Tier-3 Jira defect filed and triaged. Production fix deployed. All 47 accounts verified operational. Resolved in 42 minutes (SLA target: 60 min).</p>
          </div>
        </div>`,
      payload: {
        curl: `curl -X POST https://staging.mock-tax-engine.example/api/v2/mock-tax-engine/compute \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer MOCK_JWT_TOKEN_xxxx" \\
  -H "X-Mock-Correlation-ID: corr-de-b2b-20250315-001" \\
  -d '{
    "transaction_id": "TXN-DE-2025-88421",
    "connector_source": "salesforce-cpq",
    "erp_target": "sap-s4hana",
    "country_iso": "DE",
    "postal_zone": "D-10115",
    "line_items": [
      {
        "sku": "MOCK-IND-VALVE-7700",
        "description": "Industrial Pressure Valve Unit",
        "quantity": 250,
        "unit_price_eur": 84.50,
        "vat_rate_pct": 19.0,
        "tax_category": "STANDARD"
      }
    ],
    "buyer_vat_id": "DE000000000",
    "seller_vat_id": "DE111111111"
  }'`,
        json: `<span class="json-key">"error"</span>: {
  <span class="json-key">"code"</span>: <span class="json-number">500</span>,
  <span class="json-key">"type"</span>: <span class="json-string">"POSTAL_ZONE_PARSE_EXCEPTION"</span>,
  <span class="json-key">"message"</span>: <span class="json-error">"Failed to parse postal_zone 'D-10115': unexpected alphanumeric prefix in MockAddressSanitizer.parseZone at Line 88"</span>,
  <span class="json-key">"correlation_id"</span>: <span class="json-string">"corr-de-b2b-20250315-001"</span>,
  <span class="json-key">"connector_source"</span>: <span class="json-string">"salesforce-cpq"</span>,
  <span class="json-key">"erp_target"</span>: <span class="json-string">"sap-s4hana"</span>,
  <span class="json-key">"affected_field"</span>: <span class="json-string">"postal_zone"</span>,
  <span class="json-key">"expected_format"</span>: <span class="json-string">"^[0-9]{5}$"</span>,
  <span class="json-key">"received_value"</span>: <span class="json-error">"D-10115"</span>,
  <span class="json-key">"suggested_fix"</span>: <span class="json-string">"Strip non-numeric prefix; submit '10115'"</span>
}`
      },
      logs: `<span class="sql-keyword">-- Mock SQL Investigation: Identify affected German enterprise accounts</span>
<span class="sql-keyword">SELECT</span>
    account_id,
    company_name,
    postal_zone,
    connector_type,
    last_sync_status,
    last_error_ts
<span class="sql-keyword">FROM</span> <span class="sql-table">mock_enterprise_accounts</span>
<span class="sql-keyword">WHERE</span> country_iso = <span class="json-string">'DE'</span>
  <span class="sql-keyword">AND</span> postal_zone <span class="sql-keyword">LIKE</span> <span class="json-string">'D-%'</span>
  <span class="sql-keyword">AND</span> last_sync_status = <span class="json-string">'FAILED'</span>
<span class="sql-keyword">ORDER BY</span> last_error_ts <span class="sql-keyword">DESC</span>
<span class="sql-keyword">LIMIT</span> <span class="json-number">100</span>;

<span class="sql-keyword">-- Result: 47 rows returned</span>
<span class="sql-keyword">-- Affected connectors: salesforce-cpq (31), sap-s4hana (16)</span>

<span class="sql-keyword">-- Simulated Application Log Trace</span>
[2025-03-15T09:12:44.331Z] <span class="json-error">ERROR</span> mock-tax-engine | MockAddressSanitizer.parseZone:88
  → Input: "D-10115" | Expected: numeric-only (regex ^[0-9]{5}$)
  → Stack: MockPostalValidator → MockTaxRateResolver → MockConnectorBridge
[2025-03-15T09:12:44.335Z] <span class="json-error">ERROR</span> mock-tax-engine | Request aborted
  → correlation_id: corr-de-b2b-20250315-001
  → HTTP 500 returned to upstream connector`,
      escalation: `
        <div class="resolution-box">
          <h5>✅ Engineering Escalation & UAT Summary</h5>
          <ul>
            <li><strong>Jira Defect:</strong> <code class="mono">MOCK-TAX-4821</code> — "MockAddressSanitizer fails on legacy DE postal prefix format"</li>
            <li><strong>Priority:</strong> P1 → Tier-3 Engineering (Core Tax Engine Team)</li>
            <li><strong>Root Cause:</strong> Regex validation in <code class="mono">MockAddressSanitizer.parseZone</code> did not account for legacy German postal codes containing alphabetic prefixes (pre-reunification format)</li>
            <li><strong>Immediate Mitigation:</strong> Connector mapping override deployed — strips non-numeric prefix before validation</li>
            <li><strong>Permanent Fix:</strong> Updated postal zone parser to normalize DACH-region inputs; added 127 test vectors for DE/AT/CH postal formats</li>
            <li><strong>UAT Verification:</strong> 47 affected accounts retested in staging — all transactions processing successfully</li>
            <li><strong>Documentation:</strong> Updated Confluence connector guide with DACH postal format normalization rules and Postman collection for partner validation</li>
            <li><strong>SLA Outcome:</strong> Resolved in 42 minutes (target: 60 min) — <span class="status-pill resolved">SLA Met</span></li>
          </ul>
        </div>`
    },
    {
      id: 'scenario-2',
      triage: `
        <div class="triage-step">
          <span class="triage-time">T+00:00</span>
          <div class="triage-body">
            <h5>Monitoring Alert <span class="status-pill active">Mitigation Active</span></h5>
            <p><code class="mono">HTTP 504 Gateway Timeout</code> on <code class="mono">POST /api/v2/mock-erp-bridge/ledger-sync</code>. Multi-currency invoice sync pipeline stalled. Duplicate ledger entries detected in downstream billing system.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+06:00</span>
          <div class="triage-body">
            <h5>Initial Investigation</h5>
            <p>Inspected connector request logs — identified missing <code class="mono">X-Mock-Idempotency-Token</code> header on retry bursts during network instability window (09:04–09:11 UTC).</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+18:00</span>
          <div class="triage-body">
            <h5>SQL Forensics — Orphaned Records Isolated</h5>
            <p>Ran targeted SQL query against <code class="mono">mock_erp_sync_ledger</code> table. Found 23 orphaned duplicate records with <code class="mono">sync_status = 'RETRY_COLLISION'</code> and <code class="mono">retry_count > 3</code>.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+32:00</span>
          <div class="triage-body">
            <h5>Linux/SSH Log Correlation</h5>
            <p>SSH into staging gateway node. Correlated application logs with network timeout spikes — confirmed TCP keepalive misconfiguration causing premature connection resets during high-volume sync windows.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+51:00</span>
          <div class="triage-body">
            <h5>Resolution & UAT <span class="status-pill resolved">SLA Met — Resolved</span></h5>
            <p>Idempotency token enforcement enabled. Orphaned records reconciled. UAT passed on 3 multi-currency test invoices (EUR/GBP/CHF). Resolved in 51 minutes.</p>
          </div>
        </div>`,
      payload: {
        curl: `curl -X POST https://staging.mock-erp-bridge.example/api/v2/mock-erp-bridge/ledger-sync \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer MOCK_JWT_TOKEN_yyyy" \\
  -H "X-Mock-Correlation-ID: corr-erp-sync-20250401-007" \\
  -d '{
    "sync_batch_id": "BATCH-EU-2025-00714",
    "connector_source": "oracle-netsuite",
    "target_ledger": "mock-cloud-billing-v3",
    "currency_pairs": ["EUR/GBP", "EUR/CHF"],
    "invoices": [
      {
        "invoice_ref": "INV-2025-EU-33120",
        "amount_eur": 12750.00,
        "fx_rate_gbp": 0.8621,
        "line_count": 14,
        "subsidiary_code": "NS-EU-WEST-02"
      }
    ],
    "retry_policy": {
      "max_retries": 5,
      "backoff_ms": 2000
    }
  }'`,
        json: `<span class="json-key">"error"</span>: {
  <span class="json-key">"code"</span>: <span class="json-number">504</span>,
  <span class="json-key">"type"</span>: <span class="json-string">"GATEWAY_TIMEOUT_IDEMPOTENCY_CONFLICT"</span>,
  <span class="json-key">"message"</span>: <span class="json-error">"Ledger sync timed out after 30000ms. Missing X-Mock-Idempotency-Token header caused duplicate write attempts during retry burst."</span>,
  <span class="json-key">"correlation_id"</span>: <span class="json-string">"corr-erp-sync-20250401-007"</span>,
  <span class="json-key">"connector_source"</span>: <span class="json-string">"oracle-netsuite"</span>,
  <span class="json-key">"duplicate_refs"</span>: [<span class="json-string">"INV-2025-EU-33120"</span>, <span class="json-string">"INV-2025-EU-33120-RETRY-1"</span>],
  <span class="json-key">"orphaned_count"</span>: <span class="json-number">23</span>,
  <span class="json-key">"recommended_action"</span>: <span class="json-string">"Enable deterministic idempotency tokens; reconcile orphaned ledger entries"</span>
}`
      },
      logs: `<span class="sql-keyword">-- Mock SQL Investigation: Isolate orphaned duplicate ledger entries</span>
<span class="sql-keyword">SELECT</span>
    transaction_ref,
    sync_status,
    retry_count,
    created_at,
    idempotency_token,
    subsidiary_code
<span class="sql-keyword">FROM</span> <span class="sql-table">mock_erp_sync_ledger</span>
<span class="sql-keyword">WHERE</span> sync_batch_id = <span class="json-string">'BATCH-EU-2025-00714'</span>
  <span class="sql-keyword">AND</span> sync_status <span class="sql-keyword">IN</span> (<span class="json-string">'RETRY_COLLISION'</span>, <span class="json-string">'TIMEOUT'</span>)
  <span class="sql-keyword">AND</span> retry_count > <span class="json-number">3</span>
<span class="sql-keyword">ORDER BY</span> created_at <span class="sql-keyword">DESC</span>;

<span class="sql-keyword">-- Result: 23 orphaned rows — all missing idempotency_token</span>
<span class="sql-keyword">-- Subsidiary: NS-EU-WEST-02 (18), NS-EU-CENTRAL-01 (5)</span>

<span class="sql-keyword">-- Simulated Linux/SSH Gateway Log Inspection</span>
$ ssh mock-gateway-eu-west-01
$ tail -f /var/log/mock-erp-bridge/connector.log | grep "TIMEOUT\\|RETRY"

[2025-04-01T09:04:12.881Z] <span class="json-error">WARN</span>  mock-erp-bridge | TCP keepalive timeout
  → Connection reset: mock-netsuite-extractor → mock-billing-gateway
  → Retry #1 initiated WITHOUT idempotency token
[2025-04-01T09:04:14.902Z] <span class="json-error">ERROR</span> mock-erp-bridge | Duplicate write detected
  → transaction_ref: INV-2025-EU-33120 already exists in ledger
  → sync_status: RETRY_COLLISION
[2025-04-01T09:11:03.447Z] <span class="json-error">ERROR</span> mock-erp-bridge | Gateway timeout (30000ms)
  → Batch BATCH-EU-2025-00714 aborted after 5 retries`,
      escalation: `
        <div class="resolution-box">
          <h5>✅ Engineering Escalation & UAT Summary</h5>
          <ul>
            <li><strong>Jira Defect:</strong> <code class="mono">MOCK-ERP-1192</code> — "Missing idempotency enforcement on NetSuite ledger-sync retries"</li>
            <li><strong>Priority:</strong> P2 → Tier-3 Engineering (ERP Connector Platform Team)</li>
            <li><strong>Root Cause:</strong> Connector retry handler did not generate or forward deterministic <code class="mono">X-Mock-Idempotency-Token</code> headers during network retry bursts, causing duplicate ledger writes</li>
            <li><strong>Immediate Mitigation:</strong> Manual reconciliation of 23 orphaned records; temporary rate-limit on retry policy (max 2 retries, 5s backoff)</li>
            <li><strong>Permanent Fix:</strong> Deterministic idempotency token generation enforced at connector layer; added deadlock detection and automatic orphan cleanup job</li>
            <li><strong>UAT Verification:</strong> 3 multi-currency test invoices (EUR/GBP/CHF) synced successfully across 2 subsidiaries with forced retry simulation — zero duplicates</li>
            <li><strong>Documentation:</strong> Updated Confluence with idempotency best-practices guide and NetSuite connector retry architecture diagram</li>
            <li><strong>SLA Outcome:</strong> Resolved in 51 minutes (target: 60 min) — <span class="status-pill resolved">SLA Met</span></li>
          </ul>
        </div>`
    },
    {
      id: 'scenario-3',
      triage: `
        <div class="triage-step">
          <span class="triage-time">T+00:00</span>
          <div class="triage-body">
            <h5>Intermittent Failures Detected <span class="status-pill isolated">P1 Exception Isolated</span></h5>
            <p>European retail merchants reporting sporadic <code class="mono">HTTP 401</code> and <code class="mono">HTTP 422</code> on <code class="mono">POST /api/v2/mock-commerce-webhook/ingest</code>. Tax/order extractors failing across Shopify and WooCommerce storefronts.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+08:00</span>
          <div class="triage-body">
            <h5>OAuth Token Inspection</h5>
            <p>Discovered expired OAuth bearer token in webhook headers — automated token rotation service had a clock-drift conflict with merchant storefront timezone configuration.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+15:00</span>
          <div class="triage-body">
            <h5>Schema Validation Anomaly</h5>
            <p>Parallel investigation: <code class="mono">HTTP 422</code> failures traced to malformed VAT exemption flag — <code class="mono">"eu_reverse_charge": "true_string"</code> sent as string instead of boolean <code class="mono">true</code>.</p>
          </div>
        </div>
        <div class="triage-step">
          <span class="triage-time">T+35:00</span>
          <div class="triage-body">
            <h5>Fixes Deployed & Validated <span class="status-pill resolved">SLA Met — Resolved</span></h5>
            <p>Token rotation service patched. Schema validation rule updated. Postman regression suite expanded. Customer enablement webinar scheduled to prevent configuration drift.</p>
          </div>
        </div>`,
      payload: {
        curl: `curl -X POST https://staging.mock-commerce-webhook.example/api/v2/mock-commerce-webhook/ingest \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer EXPIRED_MOCK_OAUTH_TOKEN_zzz" \\
  -H "X-Mock-Webhook-Source: shopify-eu-storefront" \\
  -H "X-Mock-Correlation-ID: corr-commerce-wh-20250520-003" \\
  -d '{
    "webhook_event": "order.tax_calculated",
    "storefront_platform": "shopify",
    "merchant_region": "EU-DACH",
    "order_id": "MOCK-ORD-EU-2025-56001",
    "line_items": [
      {
        "sku": "MOCK-APPAREL-DE-4420",
        "description": "Premium Wool Overcoat",
        "quantity": 2,
        "unit_price_eur": 389.00,
        "vat_rate_pct": 19.0,
        "eu_reverse_charge": "true_string"
      }
    ],
    "buyer_country": "AT",
    "buyer_vat_id": "ATU00000000",
    "seller_country": "DE",
    "seller_vat_id": "DE222222222"
  }'`,
        json: `<span class="json-key">"errors"</span>: [
  {
    <span class="json-key">"code"</span>: <span class="json-number">401</span>,
    <span class="json-key">"type"</span>: <span class="json-string">"OAUTH_TOKEN_EXPIRED"</span>,
    <span class="json-key">"message"</span>: <span class="json-error">"Bearer token expired at 2025-05-20T08:00:00Z. Token rotation service clock drift detected (delta: +47s)."</span>,
    <span class="json-key">"webhook_source"</span>: <span class="json-string">"shopify-eu-storefront"</span>
  },
  {
    <span class="json-key">"code"</span>: <span class="json-number">422</span>,
    <span class="json-key">"type"</span>: <span class="json-string">"SCHEMA_VALIDATION_FAILURE"</span>,
    <span class="json-key">"message"</span>: <span class="json-error">"Field 'eu_reverse_charge' expected boolean, received string 'true_string'"</span>,
    <span class="json-key">"field_path"</span>: <span class="json-string">"line_items[0].eu_reverse_charge"</span>,
    <span class="json-key">"expected_type"</span>: <span class="json-string">"boolean"</span>,
    <span class="json-key">"received_value"</span>: <span class="json-error">"true_string"</span>,
    <span class="json-key">"correlation_id"</span>: <span class="json-string">"corr-commerce-wh-20250520-003"</span>
  }
]`
      },
      logs: `<span class="sql-keyword">-- Mock SQL Investigation: Identify affected merchant webhook failures</span>
<span class="sql-keyword">SELECT</span>
    merchant_id,
    storefront_platform,
    webhook_event,
    http_status,
    error_type,
    failed_at
<span class="sql-keyword">FROM</span> <span class="sql-table">mock_webhook_event_log</span>
<span class="sql-keyword">WHERE</span> merchant_region = <span class="json-string">'EU-DACH'</span>
  <span class="sql-keyword">AND</span> http_status <span class="sql-keyword">IN</span> (<span class="json-number">401</span>, <span class="json-number">422</span>)
  <span class="sql-keyword">AND</span> failed_at >= <span class="json-string">'2025-05-20T00:00:00Z'</span>
<span class="sql-keyword">ORDER BY</span> failed_at <span class="sql-keyword">DESC</span>;

<span class="sql-keyword">-- Result: 89 failures across 12 EU merchants</span>
<span class="sql-keyword">-- 401 (token expired): 54 events | 422 (schema): 35 events</span>
<span class="sql-keyword">-- Platforms: Shopify (67), WooCommerce (22)</span>

<span class="sql-keyword">-- Simulated OAuth Token Rotation Log</span>
[2025-05-20T07:59:13.200Z] <span class="json-error">WARN</span>  mock-auth-service | Token rotation drift
  → Expected renewal: 08:00:00.000Z | Actual: 08:00:47.112Z
  → Delta: +47.112s → Downstream webhooks rejected (401)
[2025-05-20T08:01:22.540Z] <span class="json-error">ERROR</span> mock-commerce-webhook | Schema validation failed
  → Field: line_items[0].eu_reverse_charge
  → Expected: boolean | Received: "true_string"
  → Merchant: MOCK-MERCHANT-DE-0044 (Shopify)
[2025-05-20T08:01:22.545Z] <span class="json-error">ERROR</span> mock-commerce-webhook | Webhook rejected → HTTP 422`,
      escalation: `
        <div class="resolution-box">
          <h5>✅ Engineering Escalation & UAT Summary</h5>
          <ul>
            <li><strong>Jira Defect:</strong> <code class="mono">MOCK-COMM-2847</code> — "OAuth clock-drift + schema coercion failures on EU commerce webhooks"</li>
            <li><strong>Priority:</strong> P1 → Tier-3 Engineering (Commerce Integrations Team)</li>
            <li><strong>Root Cause (Auth):</strong> Token rotation cron job on auth service had 47-second clock drift due to NTP misconfiguration, causing token expiry gap</li>
            <li><strong>Root Cause (Schema):</strong> WooCommerce plugin v3.2.1 serialized boolean fields as strings — no server-side type coercion in webhook ingestion layer</li>
            <li><strong>Immediate Mitigation:</strong> Force-refreshed OAuth tokens for all 12 affected merchants; added server-side boolean coercion for known string-boolean fields</li>
            <li><strong>Permanent Fix:</strong> NTP sync hardened on auth service nodes; strict schema validation with graceful coercion and detailed error responses</li>
            <li><strong>UAT Verification:</strong> Simulated token expiry + renewal cycle across 5 Shopify and 3 WooCommerce test storefronts — zero failures</li>
            <li><strong>Customer Enablement:</strong> Hosted partner webinar on correct webhook payload configuration; published updated integration guide with field-type reference table</li>
            <li><strong>SLA Outcome:</strong> Resolved in 35 minutes (target: 60 min) — <span class="status-pill resolved">SLA Met</span></li>
          </ul>
        </div>`
    }
  ];

  // ── Playground: Wire scenario cards & tabs ────────────
  let activeScenario = 0;
  let activeTab = 0;

  const scenarioCards = document.querySelectorAll('.scenario-card');
  const diagTabs = document.querySelectorAll('.diag-tab');
  const diagPanes = document.querySelectorAll('.diag-pane');

  function renderPlayground() {
    const s = scenarios[activeScenario];
    // Triage tab
    diagPanes[0].innerHTML = s.triage;
    // Payload tab
    diagPanes[1].innerHTML = `
      <p style="font-size:.82rem;color:var(--text-secondary);margin-bottom:12px;">Mock cURL request and error response payload for diagnostic reproduction:</p>
      <div class="code-block">
        <button class="copy-btn" onclick="copyToClipboard(this)" data-copy="${encodeURIComponent(s.payload.curl)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy cURL
        </button>
        <pre>${s.payload.curl}</pre>
      </div>
      <h5 style="font-size:.82rem;font-weight:700;margin:16px 0 8px;">Error Response:</h5>
      <div class="code-block"><pre>{
  ${s.payload.json}
}</pre></div>`;
    // Logs tab
    diagPanes[2].innerHTML = `
      <p style="font-size:.82rem;color:var(--text-secondary);margin-bottom:12px;">Simulated SQL investigation query and application log trace:</p>
      <div class="code-block"><pre>${s.logs}</pre></div>`;
    // Escalation tab
    diagPanes[3].innerHTML = s.escalation;

    // Active states
    scenarioCards.forEach((c, i) => c.classList.toggle('active', i === activeScenario));
    diagTabs.forEach((t, i) => t.classList.toggle('active', i === activeTab));
    diagPanes.forEach((p, i) => p.classList.toggle('active', i === activeTab));
  }

  scenarioCards.forEach((card, i) => {
    card.addEventListener('click', () => { activeScenario = i; activeTab = 0; renderPlayground(); });
  });
  diagTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { activeTab = i; renderPlayground(); });
  });

  renderPlayground();

  // ── Copy to clipboard + Toast ─────────────────────────
  window.copyToClipboard = function(btn) {
    const text = decodeURIComponent(btn.getAttribute('data-copy'));
    navigator.clipboard.writeText(text).then(() => {
      showToast('Mock cURL copied to clipboard');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Mock cURL copied to clipboard');
    });
  };

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = '✓ ' + msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Skills Matrix Filter ──────────────────────────────
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
