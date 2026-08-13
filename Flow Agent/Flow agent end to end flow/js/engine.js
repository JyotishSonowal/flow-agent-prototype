'use strict';

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  currentStep: null,
  lastUserMessage: '',
  selectedClarificationAnswer: '',   // kept for backward compat (Q1 answer)
  clarificationAnswers: ['', '', ''], // all 3 answers indexed 0–2
  selectedFileName: '',
  mappingUpdated: false,
  flowCardStatus: 'draft',   // 'draft' | 'active'
  workspaceOpen: false,
  workspaceView: 'business', // 'business' | 'technical' | 'full-mapping' | 'test-report'
  openAccordionIndex: 0,     // index into ACCORDION_STEPS (0-based)
  flowCardInChat: null,      // DOM element of the flow service card
  testCardInChat: null,      // DOM element of the test report card
};

// ── DOM refs ─────────────────────────────────────────────────────────────────
const chatMessages    = () => document.getElementById('chatMessages');
const workspacePanel  = () => document.getElementById('workspacePanel');
const workspaceBadge  = () => document.getElementById('workspaceBadge');
const chatInput       = () => document.getElementById('chatInput');
const sendBtn         = () => document.getElementById('sendBtn');
const paperclipBtn    = () => document.getElementById('paperclipBtn');
const fileInput       = () => document.getElementById('fileInput');
const fileChip        = () => document.getElementById('fileChip');
const fileChipName    = () => document.getElementById('fileChipName');
const fileChipRemove  = () => document.getElementById('fileChipRemove');

// ── Helpers ──────────────────────────────────────────────────────────────────
function scrollToBottom() {
  const el = chatMessages();
  el.scrollTop = el.scrollHeight;
}

function now() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendToChat(el) {
  chatMessages().appendChild(el);
  scrollToBottom();
}

function makeAgentMeta(showReasoning) {
  const meta = document.createElement('div');
  meta.className = 'agent-meta';
  meta.innerHTML = `<span class="agent-name">watsonx</span><span>${now()}</span>`;
  if (showReasoning) {
    const btn = document.createElement('button');
    btn.className = 'show-reasoning-btn';
    btn.textContent = 'Show reasoning ∨';
    const block = document.createElement('div');
    block.className = 'reasoning-block hidden';
    block.textContent = 'Analysing connectors and project context… resolving schema conflicts… mapping field types…';
    btn.addEventListener('click', () => {
      const open = !block.classList.contains('hidden');
      block.classList.toggle('hidden', open);
      btn.textContent = open ? 'Show reasoning ∨' : 'Hide reasoning ∧';
    });
    meta.appendChild(btn);
    return { meta, reasoningBlock: block };
  }
  return { meta, reasoningBlock: null };
}

function makeAgentBubbleWrapper() {
  const row = document.createElement('div');
  row.className = 'agent-message';
  const avatar = document.createElement('div');
  avatar.className = 'agent-avatar';
  avatar.innerHTML = ICON_AGENT_AVATAR;
  const body = document.createElement('div');
  body.className = 'agent-body';
  row.appendChild(avatar);
  row.appendChild(body);
  return { row, body };
}

// ── Status badge helpers ──────────────────────────────────────────────────────
function updateWorkspaceBadge(status) {
  const badge = workspaceBadge();
  if (!badge) return;
  badge.className = `status-badge status-${status}`;
  badge.textContent = status === 'active' ? 'Active' : 'Draft';
}

function updateFlowCardStatus(cardEl, status) {
  if (!cardEl) return;
  const badge = cardEl.querySelector('.inline-card-badge');
  if (badge) {
    badge.className = `status-badge inline-card-badge status-${status}`;
    badge.textContent = status === 'active' ? 'Active' : 'Draft';
  }
}

function setFlowCardToViewing(cardEl) {
  if (!cardEl) return;
  const bottom = cardEl.querySelector('.inline-card-bottom') || cardEl;
  const footer = bottom.querySelector('.inline-card-footer') || cardEl.querySelector('.inline-card-footer');
  if (!footer) return;
  footer.innerHTML = `<span class="viewing-label">👁 Viewing</span>`;
}

function setFlowCardToDetails(cardEl, onClickFn) {
  if (!cardEl) return;
  const bottom = cardEl.querySelector('.inline-card-bottom') || cardEl;
  const footer = bottom.querySelector('.inline-card-footer') || cardEl.querySelector('.inline-card-footer');
  if (!footer) return;
  footer.innerHTML = '';
  const link = document.createElement('button');
  link.className = 'view-details-link';
  link.textContent = 'View details →';
  link.addEventListener('click', onClickFn);
  footer.appendChild(link);
}

// ── Render: user bubble ───────────────────────────────────────────────────────
function renderUserBubble(text, attachmentName) {
  // Hide disclaimer after the first user message
  const disclaimer = document.querySelector('.disclaimer');
  if (disclaimer) disclaimer.style.display = 'none';

  const wrap = document.createElement('div');
  wrap.className = 'user-message';

  const inner = document.createElement('div');
  inner.className = 'user-message-inner';

  // Text bubble
  const bubble = document.createElement('div');
  bubble.className = 'user-bubble';
  bubble.innerHTML = text;
  inner.appendChild(bubble);

  // File chip — separate block below the bubble
  if (attachmentName) {
    const chip = document.createElement('div');
    chip.className = 'user-file-chip';
    chip.textContent = attachmentName;
    inner.appendChild(chip);
  }

  wrap.appendChild(inner);
  appendToChat(wrap);
}

// ── Render: reasoning indicator ───────────────────────────────────────────────
function renderReasoningIndicator(callback, delay) {
  const { row, body } = makeAgentBubbleWrapper();
  const { meta } = makeAgentMeta(false);
  const indicator = document.createElement('div');
  indicator.className = 'reasoning-indicator';
  indicator.innerHTML = `
    <div class="reasoning-label"><div class="spinner"></div> Reasoning...</div>
    <div class="reasoning-expand">↓ Interpreting core problem</div>`;
  body.appendChild(meta);
  body.appendChild(indicator);
  appendToChat(row);
  setTimeout(() => {
    row.remove();
    callback();
  }, delay || 2500);
}

// ── Render: agent text message ────────────────────────────────────────────────
function renderAgentMessage(htmlText, showReasoning, extra) {
  const { row, body } = makeAgentBubbleWrapper();
  const { meta, reasoningBlock } = makeAgentMeta(showReasoning);
  body.appendChild(meta);
  if (reasoningBlock) body.appendChild(reasoningBlock);
  const text = document.createElement('div');
  text.className = 'agent-text';
  text.innerHTML = htmlText;
  body.appendChild(text);
  if (extra) extra(body, text);
  appendToChat(row);
  return { row, body, text };
}

// ── Render: welcome option cards (decorative) ─────────────────────────────────
function renderWelcomeCards() {
  const cards = document.createElement('div');
  cards.className = 'option-cards';
  const items = [
    { title: 'Learn what you can do', subtitle: 'Find out what you can and can\'t do in this chat.' },
    { title: 'Try sample prompts', subtitle: 'Use sample prompts to help you start building workflows.' },
    { title: 'Tips for better results', subtitle: 'Quick tips on creating prompts and getting better results.' },
  ];
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.innerHTML = `<div class="option-card-text"><div class="option-title">${item.title}</div><div class="option-subtitle">${item.subtitle}</div></div><span class="option-card-arrow">→</span>`;
    cards.appendChild(card);
  });
  const lastAgent = chatMessages().querySelector('.agent-message:last-child .agent-body');
  if (lastAgent) lastAgent.appendChild(cards);
}

// ── Render: clarification card ────────────────────────────────────────────────
function renderClarificationCard(step) {
  const questions = step.questions;
  const total = questions.length;

  // Track which question is shown and which are answered (local to this card)
  let currentQ = 0;
  const answers = new Array(total).fill(null); // null = unanswered

  const { row, body } = makeAgentBubbleWrapper();
  const { meta } = makeAgentMeta(false);
  const textEl = document.createElement('div');
  textEl.className = 'agent-text';
  textEl.textContent = step.agentMessage;
  body.appendChild(meta);
  body.appendChild(textEl);

  const card = document.createElement('div');
  card.className = 'clarification-card';
  card.innerHTML = `
    <div class="clarification-header">
      <span class="clarification-question-text"></span>
      <span class="clarification-pagination">
        <button class="clar-prev" title="Previous">&#8249;</button>
        <span class="clar-page-label"></span>
        <button class="clar-next" title="Next">&#8250;</button>
      </span>
    </div>
    <div class="clarification-options"></div>
    <div class="clarification-footer"><button class="skip-link">Skip</button></div>`;
  body.appendChild(card);
  appendToChat(row);

  const questionText  = card.querySelector('.clarification-question-text');
  const pageLabel     = card.querySelector('.clar-page-label');
  const optWrap       = card.querySelector('.clarification-options');
  const prevBtn       = card.querySelector('.clar-prev');
  const nextBtn       = card.querySelector('.clar-next');
  const skipBtn       = card.querySelector('.skip-link');

  // ── Render a specific question index into the card ──────────────────────────
  function renderQuestion(idx) {
    const q = questions[idx];
    questionText.textContent = q.question;
    pageLabel.textContent = `${idx + 1} of ${total}`;

    // Prev: disabled only on first question
    prevBtn.disabled = idx === 0;

    // Next: disabled only on last question
    nextBtn.disabled = idx === total - 1;

    // Rebuild options
    optWrap.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'clarification-option';
      btn.textContent = opt.label;
      // If already answered, show as selected/locked
      if (answers[idx] !== null) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        if (answers[idx] === opt.label) {
          btn.classList.add('selected');
          btn.style.opacity = '1';
        }
      } else {
        btn.addEventListener('click', () => handleAnswer(idx, opt.label));
      }
      optWrap.appendChild(btn);
    });
    // Disabled "Other..." / third option if defined
    if (q.disabledOption) {
      const disBtn = document.createElement('button');
      disBtn.className = 'clarification-option disabled';
      disBtn.textContent = q.disabledOption;
      disBtn.disabled = true;
      if (answers[idx] !== null) disBtn.style.opacity = '0.4';
      optWrap.appendChild(disBtn);
    }

    // Skip button: hide if already answered
    skipBtn.style.display = answers[idx] !== null ? 'none' : 'inline';
  }

  // ── Handle an answer selection ───────────────────────────────────────────────
  function handleAnswer(idx, label) {
    answers[idx] = label;
    // Persist into global state
    state.clarificationAnswers[idx] = label;
    if (idx === 0) state.selectedClarificationAnswer = label; // backward compat

    if (idx < total - 1) {
      // More questions — advance to next
      currentQ = idx + 1;
      renderQuestion(currentQ);
    } else {
      // Last question answered — lock card and advance flow
      lockCard();
      advanceTo(step.nextStepId);
    }
  }

  // ── Skip ─────────────────────────────────────────────────────────────────────
  skipBtn.addEventListener('click', () => {
    // Record skip as a default/empty answer
    const q = questions[currentQ];
    const defaultAnswer = q.options[0] ? q.options[0].label : 'Skipped';
    handleAnswer(currentQ, defaultAnswer);
  });

  // ── Prev / Next nav ──────────────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => {
    if (currentQ > 0) {
      currentQ -= 1;
      renderQuestion(currentQ);
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentQ < total - 1 && answers[currentQ] !== null) {
      currentQ += 1;
      renderQuestion(currentQ);
    }
  });

  // ── Lock the entire card (all answered) ──────────────────────────────────────
  function lockCard() {
    card.querySelectorAll('button').forEach(b => { b.disabled = true; });
    card.style.opacity = '0.6';
  }

  // Render Q1 to start
  renderQuestion(0);
}

// ── Render: clarification answer summary (user bubble) ────────────────────────
function renderAnswerSummary() {
  const step = FLOW['step_clarification_questions'];
  const wrap = document.createElement('div');
  wrap.className = 'user-message';
  const bubble = document.createElement('div');
  bubble.className = 'user-bubble';
  const summary = document.createElement('div');
  summary.className = 'answer-summary';

  // Build one row per question using stored answers (fall back to first option)
  const rows = step.questions.map((q, i) => {
    const ans = state.clarificationAnswers[i] || (q.options[0] ? q.options[0].label : 'Skipped');
    return `<div class="answer-row"><span class="answer-q">${q.question}</span><span class="answer-a">${ans}</span></div>`;
  }).join('');

  summary.innerHTML = rows;
  bubble.appendChild(summary);
  wrap.appendChild(bubble);
  appendToChat(wrap);
}

// ── Render: flow service inline card ─────────────────────────────────────────
function renderFlowServiceCard(state_ref) {
  const card = document.createElement('div');
  card.className = 'inline-card inline-card--flow';
  card.innerHTML = `
    <div class="inline-card-top">
      <div class="inline-card-header">
        <span class="inline-card-title" style="flex:1">Sync Salesforce accounts to HubSpot contacts by ACV</span>
        <span class="ai-badge">AI</span>
      </div>
      <span class="status-badge inline-card-badge status-draft">Draft</span>
    </div>
    <div class="inline-card-bottom">
      <div class="inline-card-footer"></div>
    </div>`;
  return card;
}

// ── Render: test report inline card ──────────────────────────────────────────
function renderTestReportCard() {
  const card = document.createElement('div');
  card.className = 'inline-card inline-card--flow';
  card.innerHTML = `
    <div class="inline-card-top">
      <div class="inline-card-header">
        <div class="inline-card-title-block">
          <span class="inline-card-title">Test report</span>
          <span class="inline-card-subtitle">Created on: 12/10/26</span>
        </div>
        <span class="ai-badge">AI</span>
      </div>
    </div>
    <div class="inline-card-bottom">
      <div class="inline-card-footer"></div>
    </div>`;
  return card;
}

// ── Render: test result text ──────────────────────────────────────────────────
function renderTestResultBlock() {
  const block = document.createElement('div');
  block.className = 'test-result-block agent-text';
  block.innerHTML = `
    <div class="result-row"><span class="result-label">Status:</span><span>✅ Success</span></div>
    <div class="result-row"><span class="result-label">Duration:</span><span>2.289 seconds</span></div>
    <div class="result-row"><span class="result-label">Requested at:</span><span>Today at 3:27:44 PM IST</span></div>`;
  return block;
}

// ── Render: set input prefill ─────────────────────────────────────────────────
function setPrefill(text, withAttachment) {
  const input = chatInput();
  input.value = text;
  input.classList.add('prefilled');
  if (withAttachment) {
    fileChip().classList.remove('hidden');
    fileChipName().textContent = state.selectedFileName || 'mapping_01.csv';
  } else {
    fileChip().classList.add('hidden');
  }
}

function clearPrefill() {
  const input = chatInput();
  input.value = '';
  input.classList.remove('prefilled');
  // also clear any attached file chip
  fileChip().classList.add('hidden');
  fileChipName().textContent = '';
  state.selectedFileName = '';
}

// ── Workspace builders ────────────────────────────────────────────────────────
function buildBusinessView() {
  const list = document.getElementById('businessStepsList');
  list.innerHTML = '';
  BUSINESS_STEPS.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="step-num">${i + 1}.</span><span class="step-content">${s.title}<div class="step-subtitle">${s.subtitle}</div></span>`;
    list.appendChild(li);
  });
}

// ── SVG icons for doc toggle ──────────────────────────────────────────────────
const MINUS_CIRCLE = `<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="#6f6f6f" stroke-width="1.2" fill="none"/><line x1="4" y1="7" x2="10" y2="7" stroke="#6f6f6f" stroke-width="1.2"/></svg>`;
const PLUS_CIRCLE  = `<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="#6f6f6f" stroke-width="1.2" fill="none"/><line x1="4" y1="7" x2="10" y2="7" stroke="#6f6f6f" stroke-width="1.2"/><line x1="7" y1="4" x2="7" y2="10" stroke="#6f6f6f" stroke-width="1.2"/></svg>`;

// Normalise data to always use the multi-doc `docs` array format
function normaliseMappingCol(colData) {
  if (colData.docs) return colData.docs;
  // legacy single-doc format → wrap in array
  return [{ doc: colData.doc, collapsed: false, fields: colData.fields }];
}

function buildDocGroup(docDef, isNested) {
  const wrap = document.createElement('div');
  wrap.className = 'mf-fields-wrap';
  if (isNested) wrap.classList.add('mf-fields-nested-group');

  // Doc row
  const docRow = document.createElement('div');
  docRow.className = 'mf-doc-row';
  if (isNested) docRow.classList.add('mf-doc-row-nested');

  const docToggle = document.createElement('button');
  docToggle.className = 'mf-doc-toggle';
  docToggle.innerHTML = docDef.collapsed ? PLUS_CIRCLE : MINUS_CIRCLE;
  docRow.appendChild(docToggle);

  const docMeta = document.createElement('span');
  docMeta.className = 'mf-doc-meta';
  docMeta.innerHTML = `<span class="tag tag-doc">doc</span><span class="mf-doc-name">${docDef.doc}</span>`;
  docRow.appendChild(docMeta);
  wrap.appendChild(docRow);

  // Nested fields
  const nestedWrap = document.createElement('div');
  nestedWrap.className = 'mf-nested-fields';
  if (docDef.collapsed) nestedWrap.style.display = 'none';

  docDef.fields.forEach(f => {
    const row = document.createElement('div');
    row.className = 'mf-field' + (isNested ? ' mf-field-deep' : '');
    row.innerHTML = `<span class="tag tag-${f.tag}">${f.tag}</span><span class="mf-name">${f.name}</span><span class="required-star">*</span>`;
    nestedWrap.appendChild(row);
  });
  wrap.appendChild(nestedWrap);

  // Toggle behaviour
  let collapsed = !!docDef.collapsed;
  docToggle.addEventListener('click', () => {
    collapsed = !collapsed;
    nestedWrap.style.display = collapsed ? 'none' : '';
    docToggle.innerHTML = collapsed ? PLUS_CIRCLE : MINUS_CIRCLE;
  });

  return wrap;
}

function buildMappingTable(data, container) {
  container.innerHTML = '';

  const SNOWFLAKE = `<img src="icons/icon-agent.png" width="13" height="13" style="display:inline-block;vertical-align:middle;opacity:0.7">`;

  const colDefs = [
    { label: 'Pipeline Input',    colData: data.input,      showIcon: false },
    { label: 'Input - Put Object',   colData: data.putObject, showIcon: true  },
    { label: 'Output - Put Object',  colData: data.output,    showIcon: true  },
    { label: 'Pipeline Output',   colData: data.pipelineOut, showIcon: false },
  ];

  const grid = document.createElement('div');
  grid.className = 'mapping-grid';

  colDefs.forEach(col => {
    const colEl = document.createElement('div');
    colEl.className = 'mf-column';

    // ── 1. Column header ──────────────────────────────────────────────────────
    const hdr = document.createElement('div');
    hdr.className = 'mf-col-header';
    hdr.innerHTML = `${col.showIcon ? `<span class="mf-col-icon">${SNOWFLAKE}</span>` : ''}<span class="mf-col-label">${col.label}</span>`;
    colEl.appendChild(hdr);

    // ── 2. Collapse row ───────────────────────────────────────────────────────
    const collapseRow = document.createElement('div');
    collapseRow.className = 'mf-collapse-row';
    collapseRow.innerHTML = `<span class="mf-chevron">▲</span><span class="mf-collapse-label">Collapse</span>`;
    colEl.appendChild(collapseRow);

    // ── 3. Doc groups (one or more) ───────────────────────────────────────────
    const allGroupsWrap = document.createElement('div');
    allGroupsWrap.className = 'mf-all-groups';

    const docs = normaliseMappingCol(col.colData);
    docs.forEach(docDef => {
      allGroupsWrap.appendChild(buildDocGroup(docDef, !!docDef.isNested));
    });
    colEl.appendChild(allGroupsWrap);

    // ── Collapse row toggle ───────────────────────────────────────────────────
    let colCollapsed = false;
    collapseRow.addEventListener('click', () => {
      colCollapsed = !colCollapsed;
      allGroupsWrap.style.display = colCollapsed ? 'none' : '';
      collapseRow.querySelector('.mf-chevron').textContent = colCollapsed ? '▼' : '▲';
      collapseRow.querySelector('.mf-collapse-label').textContent = colCollapsed ? 'Expand' : 'Collapse';
    });

    grid.appendChild(colEl);
  });

  container.appendChild(grid);
}

function buildAccordion(openIndex) {
  const container = document.getElementById('accordionSteps');
  container.innerHTML = '';
  ACCORDION_STEPS.forEach((s, idx) => {
    const item = document.createElement('div');
    item.className = `accordion-item${s.indented ? ' indented' : ''}${idx === openIndex ? ' open' : ''}`;

    const header = document.createElement('div');
    header.className = 'accordion-header';
    const iconMap = { snowflake: ICON_AGENT_AVATAR, sync: ICON_SYNC, fn: ICON_FN, branch: ICON_BRANCH, exit: ICON_EXIT };
    const iconSvg = iconMap[s.icon] || ICON_SYNC;
    const iconHtml = `<span class="accordion-icon">${iconSvg}</span>`;
    const titleHtml = s.source
      ? `<span class="accordion-title"><span class="step-keyword">${s.title}</span> from ${s.source}</span>`
      : `<span class="accordion-title">${s.title}</span>`;
    header.innerHTML = `<span class="accordion-num">${s.num}</span>${iconHtml}${titleHtml}`;

    if (s.expandable) {
      const toggle = document.createElement('span');
      toggle.className = 'accordion-toggle';
      toggle.textContent = '∨';
      header.appendChild(toggle);

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // close all
        container.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
          state.openAccordionIndex = idx;
        } else {
          state.openAccordionIndex = -1;
        }
      });
    }

    item.appendChild(header);

    // body for any step with mapping data
    if (s.hasMapping && s.mappingKey) {
      const body = document.createElement('div');
      body.className = 'accordion-body';

      const mapHeader = document.createElement('div');
      mapHeader.className = 'mapped-data-header';
      mapHeader.innerHTML = '<span>Mapped data</span>';
      // "View full mapping" only on step 1 (the canonical full-mapping view)
      if (s.mappingKey === 'step1') {
        const viewFull = document.createElement('button');
        viewFull.className = 'view-full-mapping';
        viewFull.textContent = 'View full mapping ↗';
        viewFull.addEventListener('click', () => advanceTo('step_workspace_full_mapping_view'));
        mapHeader.appendChild(viewFull);
      }
      body.appendChild(mapHeader);

      const tableContainer = document.createElement('div');
      // give step-1's container the legacy id so updateMappingData still finds it
      if (s.mappingKey === 'step1') tableContainer.id = 'accordionMappingTable';
      const lookup = state.mappingUpdated ? MAPPING_BY_KEY_UPDATED : MAPPING_BY_KEY;
      buildMappingTable(lookup[s.mappingKey], tableContainer);
      body.appendChild(tableContainer);
      item.appendChild(body);
    }

    container.appendChild(item);
  });
}

function buildTestReport() {
  const content = document.getElementById('testReportContent');
  content.innerHTML = '';
  const status = document.createElement('div');
  status.innerHTML = `<div class="test-run-status">✅ Run Successful</div><div class="test-run-time">Aug 05, 2026 | 11:31:11 PM PDT</div>`;
  content.appendChild(status);

  const label = document.createElement('div');
  label.className = 'test-details-label';
  label.textContent = 'DETAILS';
  content.appendChild(label);

  const tree = document.createElement('div');
  tree.className = 'test-tree';
  TEST_REPORT_DATA.forEach(node => {
    const nodeEl = document.createElement('div');
    nodeEl.innerHTML = `<div class="test-tree-node"><span class="tag tag-doc">doc</span><strong>${node.name}</strong></div>`;
    const children = document.createElement('div');
    children.className = 'test-tree-children';
    node.fields.forEach(f => {
      const fieldEl = document.createElement('div');
      fieldEl.className = 'test-tree-node';
      fieldEl.innerHTML = `<span class="tag tag-str">str</span><span class="test-tree-field">${f.name}</span><span>→</span><span class="test-tree-value">${f.value}</span>`;
      children.appendChild(fieldEl);
    });
    nodeEl.appendChild(children);
    tree.appendChild(nodeEl);
  });
  content.appendChild(tree);
}

// ── Workspace visibility ──────────────────────────────────────────────────────
function showWorkspace() {
  workspacePanel().classList.remove('hidden');
  state.workspaceOpen = true;
}
function hideWorkspace() {
  workspacePanel().classList.add('hidden');
  state.workspaceOpen = false;
  // reset the flow service card from "Viewing" back to "View details"
  if (state.flowCardInChat) {
    setFlowCardToDetails(state.flowCardInChat, () => advanceTo('step_workspace_business_view'));
  }
  if (state.testCardInChat) {
    setFlowCardToDetails(state.testCardInChat, () => advanceTo('step_test_report_open'));
  }
}
function showTab(tab) {
  document.getElementById('tabBusiness').classList.add('hidden');
  document.getElementById('tabTechnical').classList.add('hidden');
  document.getElementById('fullMappingView').classList.add('hidden');
  document.getElementById('testReportView').classList.add('hidden');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const header = document.querySelector('.workspace-header');

  if (tab === 'business') {
    header.classList.remove('hidden');
    document.getElementById('workspaceTabs').classList.remove('hidden');
    document.getElementById('tabBusiness').classList.remove('hidden');
    document.querySelector('[data-tab="business"]').classList.add('active');
  } else if (tab === 'technical') {
    header.classList.remove('hidden');
    document.getElementById('workspaceTabs').classList.remove('hidden');
    document.getElementById('tabTechnical').classList.remove('hidden');
    document.querySelector('[data-tab="technical"]').classList.add('active');
  } else if (tab === 'full-mapping') {
    header.classList.add('hidden');
    document.getElementById('workspaceTabs').classList.add('hidden');
    document.getElementById('fullMappingView').classList.remove('hidden');
  } else if (tab === 'test-report') {
    header.classList.add('hidden');
    document.getElementById('workspaceTabs').classList.add('hidden');
    document.getElementById('testReportView').classList.remove('hidden');
  }
  state.workspaceView = tab;
}

// ── Side effects handler ──────────────────────────────────────────────────────
function handleSideEffect(effect) {
  switch (effect) {
    case 'open_workspace_business':
      buildBusinessView();
      showWorkspace();
      showTab('business');
      if (state.flowCardInChat) setFlowCardToViewing(state.flowCardInChat);
      break;

    case 'open_workspace_technical':
      buildAccordion(0);
      showTab('technical');
      break;

    case 'collapse_all_accordion':
      buildAccordion(-1);
      break;

    case 'open_full_mapping': {
      buildMappingTable(MAPPING_DATA_FULL, document.getElementById('fullMappingTable'));
      showTab('full-mapping');
      document.getElementById('workspaceTabs').classList.add('hidden');
      break;
    }

    case 'open_test_report':
      buildTestReport();
      showWorkspace();
      document.getElementById('workspaceTabs').classList.add('hidden');
      showTab('test-report');
      if (state.testCardInChat) setFlowCardToViewing(state.testCardInChat);
      break;

    case 'open_file_picker':
      fileInput().click();
      break;
  }
}

// ── Main advanceTo ────────────────────────────────────────────────────────────
function advanceTo(stepId) {
  if (!stepId || !FLOW[stepId]) return;
  const step = FLOW[stepId];
  // side-effect steps don't own user input — keep currentStep pointing at the
  // last real interactive step so free-text intent detection still works
  if (step.type !== 'side-effect') {
    state.currentStep = stepId;
  }

  clearPrefill();
  chatInput().value = '';
  chatInput().placeholder = 'Type something...';

  if (step.type === 'agent') {
    // optional: update status
    if (step.updateFlowCardToActive) {
      state.flowCardStatus = 'active';
      updateFlowCardStatus(state.flowCardInChat, 'active');
      updateWorkspaceBadge('active');
    }
    if (step.updateMappingData) {
      state.mappingUpdated = true;
      // ensure technical view is open and rebuild accordion with updated mapping
      showWorkspace();
      buildAccordion(0);
      showTab('technical');
    }

    // user bubble above agent message (only if userBubble is set in step)
    if (step.userBubble) renderUserBubble(step.userBubble);

    renderAgentMessage(step.agentMessage, step.showReasoning || false, (body) => {
      if (step.showFlowServiceCard) {
        const card = renderFlowServiceCard();
        state.flowCardInChat = card;
        body.appendChild(card);
        setFlowCardToDetails(card, () => advanceTo('step_workspace_business_view'));
      }
      if (step.showFlowServiceCardViewing) {
        // Re-render the flow service card in Active+Viewing state (post-mapping update)
        const card = renderFlowServiceCard();
        updateFlowCardStatus(card, 'active');
        setFlowCardToViewing(card);
        state.flowCardInChat = card;
        body.appendChild(card);
        // follow-up text below the card
        const followUp = document.createElement('div');
        followUp.className = 'agent-followup';
        followUp.textContent = 'You can now test this with sample data';
        body.appendChild(followUp);
      }
      if (step.showTestResult) {
        body.appendChild(renderTestResultBlock());
      }
      if (step.showTestReportCard) {
        const card = renderTestReportCard();
        state.testCardInChat = card;
        body.appendChild(card);
        setFlowCardToDetails(card, () => advanceTo('step_test_report_open'));
      }
    });

    if (step.showWelcomeCards) renderWelcomeCards();

    // set up input
    if (step.inputType === 'prefill') {
      setPrefill(step.prefillText);
    } else if (step.inputType === 'prefill-with-attachment') {
      setPrefill(step.prefillText, false);
      // show paperclip affordance — clicking it triggers file picker
      // The prefill will auto-populate when file is chosen
    } else if (step.inputType === 'free') {
      chatInput().placeholder = 'Type something...';
    }

    if (step.nextStepId && step.inputType !== 'prefill' && step.inputType !== 'prefill-with-attachment' && step.inputType !== 'free') {
      advanceTo(step.nextStepId);
    }

  } else if (step.type === 'reasoning') {
    if (stepId === 'step_clarification_answered') {
      renderAnswerSummary();
    }
    renderReasoningIndicator(() => advanceTo(step.nextStepId), step.delay);

  } else if (step.type === 'clarification') {
    renderUserBubble(step.userBubble);
    renderClarificationCard(step);

  } else if (step.type === 'side-effect') {
    handleSideEffect(step.sideEffect);
    if (step.nextStepId) advanceTo(step.nextStepId);

  } else if (step.type === 'prefill-only') {
    setPrefill(step.prefillText, step.withAttachment);
  }

  scrollToBottom();
}

// ── Intent detection ──────────────────────────────────────────────────────────
function detectIntent(text) {
  const t = text.toLowerCase();
  if (t.includes('save') || t.includes('deploy') || t.includes('continue') ||
      t.includes('proceed') || t.includes('publish') || t.includes('launch') ||
      t.includes('go ahead') || t.includes('confirm') || t.includes('looks good') ||
      t.includes('good') || t.includes('yes') || t.includes('ok') || t.includes('sure')) return 'save';
  if (t.includes('test') || t.includes('sample')) return 'test';
  if (t.includes('update') || t.includes('mapping') || t.includes('map')) return 'mapping';
  return null;
}

// ── Send handler ──────────────────────────────────────────────────────────────
function handleSend(text, attachmentName) {
  const step = FLOW[state.currentStep];
  if (!step) return;

  if (step.inputType === 'prefill' || step.type === 'prefill-only') {
    renderUserBubble(text || step.prefillText, attachmentName);
    clearPrefill();
    advanceTo(step.nextStepId);

  } else if (step.inputType === 'free') {
    const intent = detectIntent(text);
    if (!intent) return; // ignore unknown input
    renderUserBubble(text, attachmentName);
    clearPrefill();
    state.lastUserMessage = text;

    if (intent === 'save') {
      advanceTo('step_flow_service_saved');
    } else if (intent === 'test') {
      advanceTo('step_test_triggered');
    } else if (intent === 'mapping') {
      advanceTo('step_update_mapping_intent');
    }

  } else if (step.inputType === 'prefill-with-attachment') {
    // user clicks send after selecting file
    renderUserBubble('Update mapping using this file', attachmentName);
    clearPrefill();
    fileChip().classList.add('hidden');
    state.selectedFileName = '';
    advanceTo('step_mapping_updated');
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
function init() {
  // Send button
  sendBtn().addEventListener('click', () => {
    const text = chatInput().value.trim();
    if (!text) return;
    const attachment = state.selectedFileName || null;
    chatInput().value = '';
    handleSend(text, attachment);
  });

  // Enter key
  chatInput().addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput().value.trim();
      if (!text) return;
      const attachment = state.selectedFileName || null;
      chatInput().value = '';
      handleSend(text, attachment);
    }
  });

  // Paperclip — triggers file picker
  paperclipBtn().addEventListener('click', (e) => {
    e.preventDefault();
    const step = FLOW[state.currentStep];
    if (step && step.inputType === 'prefill-with-attachment') {
      fileInput().click();
    }
  });

  // File selected
  fileInput().addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    state.selectedFileName = file.name;
    fileChipName().textContent = file.name;
    fileChip().classList.remove('hidden');
    setPrefill('Update mapping using this file', false);
    // advance state to file_attached
    advanceTo('step_file_attached');
  });

  // Remove file chip
  fileChipRemove().addEventListener('click', () => {
    state.selectedFileName = '';
    fileChip().classList.add('hidden');
    fileInput().value = '';
  });

  // Close workspace
  document.getElementById('closeWorkspaceBtn').addEventListener('click', hideWorkspace);

  // Close test report — return to technical view
  document.getElementById('closeTestReportBtn').addEventListener('click', () => {
    showTab('technical');
    buildAccordion(state.openAccordionIndex >= 0 ? state.openAccordionIndex : 0);
  });

  // Close full mapping — return to technical view
  document.getElementById('closeMappingBtn').addEventListener('click', () => {
    showTab('technical');
    buildAccordion(state.openAccordionIndex >= 0 ? state.openAccordionIndex : 0);
  });

  // Back to technical view from full mapping
  document.getElementById('mappedDataOnlyToggle').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const checked = btn.getAttribute('aria-checked') === 'true';
    btn.setAttribute('aria-checked', String(!checked));
  });

  document.getElementById('backToTechnicalBtn').addEventListener('click', () => {
    document.getElementById('workspaceTabs').classList.remove('hidden');
    showTab('technical');
    buildAccordion(state.openAccordionIndex >= 0 ? state.openAccordionIndex : 0);
  });

  // Tab switching
  document.getElementById('workspaceTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab === 'business') {
      showTab('business');
    } else if (tab === 'technical') {
      showTab('technical');
      buildAccordion(state.openAccordionIndex >= 0 ? state.openAccordionIndex : 0);
      advanceTo('step_workspace_technical_view_open');
    }
  });

  // Start the flow
  advanceTo(START_STEP_ID);
}
