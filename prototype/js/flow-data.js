'use strict';

const START_STEP_ID = 'step_welcome';

// ── Business view steps ──────────────────────────────────────────────────────
const BUSINESS_STEPS = [
  { title: 'Get all accounts from Salesforce', subtitle: 'Retries automatically if Salesforce doesn\'t respond.' },
  { title: 'Check the accounts have the fields this flow needs', subtitle: 'Stops and logs a warning if no accounts come back.' },
  { title: 'Go through the accounts one at a time', subtitle: 'Carries on with the rest if a single account fails.' },
  { title: 'Keep only accounts above $10M ACV', subtitle: 'Leaves out any account with no ACV value.' },
  { title: 'Copy every account field into HubSpot\'s contact format', subtitle: 'Skips and logs any account whose fields can\'t be matched.' },
  { title: 'Create or update contacts in HubSpot', subtitle: 'Logs any contact that fails to save and continues with the rest.' },
  { title: 'Lorem ipsum transform to HubSpot format', subtitle: 'Lorem ipsum map Salesforce fields to $transformedAccounts structure.' },
  { title: 'Lorem ipsum transform to HubSpot format', subtitle: 'Lorem ipsum map Salesforce fields to $transformedAccounts structure.' },
];

// ── Technical view accordion steps ──────────────────────────────────────────
const ACCORDION_STEPS = [
  { num: 1, icon: 'snowflake', title: 'Get Document By ID', source: 'Adobe Sign', hasMapping: true, mappingKey: 'step1', expandable: true },
  { num: 2, icon: 'snowflake', title: 'Put Object', source: 'Amazon Simple Storage Service (S3)', hasMapping: true, mappingKey: 'step2', expandable: true },
  { num: 3, icon: 'snowflake', title: 'Get Document By ID', source: 'Adobe Sign', hasMapping: true, mappingKey: 'step3', expandable: true },
  { num: 4, icon: 'branch', title: 'If (/getObjectOutput/responseHeaders/Content-Length is greater than or equal to 502000)', expandable: false },
  { num: 5, icon: 'fn', title: 'Flow logCustomMessage', expandable: false, indented: true },
  { num: 6, icon: 'branch', title: 'Else', expandable: false },
  { num: 7, icon: 'fn', title: 'Exit \'Flow service\' signaling \'Failure\' "uploaded not happened"', expandable: false, indented: true },
  { num: 8, icon: 'snowflake', title: 'Get Agreement Combined Document', source: 'Adobe Sign', hasMapping: true, mappingKey: 'step8', expandable: true },
  { num: 9, icon: 'snowflake', title: 'IO streamToString', hasMapping: true, mappingKey: 'step9', expandable: true },
];

// ── Full mapping view data (richer, used on "View full mapping") ──────────────
// Each column has a `docs` array — multiple doc groups can stack in one column.
// collapsed: true = starts with ⊕ (fields hidden), false = starts with ⊖ (fields shown)
const MAPPING_DATA_FULL = {
  input: { docs: [
    { doc: 'GetDocumentByIDiutput', collapsed: true,  fields: [] },
    { doc: 'GetDocumentByIDOutput', collapsed: false, fields: [
      { tag: 'obj', name: 'stream' },
    ]},
  ]},
  putObject: { docs: [
    { doc: 'putObjectInput', collapsed: false, fields: [
      { tag: 'str', name: 'bucketName' },
      { tag: 'str', name: 'objectName' },
      { tag: 'obj', name: 'stream' },
      { tag: 'str', name: 'Content-Type' },
    ]},
  ]},
  output: { docs: [
    { doc: 'GetDocloremispum', collapsed: false, fields: [
      { tag: 'str', name: 'loremIpsum' },
      { tag: 'str', name: 'objectName' },
      { tag: 'obj', name: 'Placeholder' },
      { tag: 'str', name: 'loremIpsum' },
      { tag: 'str', name: 'objectName' },
      { tag: 'obj', name: 'Placeholder' },
      { tag: 'str', name: 'loremIpsum' },
      { tag: 'str', name: 'objectName' },
      { tag: 'obj', name: 'Placeholder' },
    ]},
  ]},
  pipelineOut: { docs: [
    { doc: 'GetDocloremispum', collapsed: false, fields: [
      { tag: 'str', name: 'isSuccess' },
      { tag: 'str', name: 'placeholder' },
    ]},
    { doc: 'responseHeaders', collapsed: false, isNested: true, fields: [
      { tag: 'str', name: 'amd-request-id' },
      { tag: 'str', name: 'Server' },
      { tag: 'str', name: 'Content-Length' },
      { tag: 'str', name: 'Connection' },
      { tag: 'str', name: 'Content-Type' },
      { tag: 'str', name: 'amz-version-id' },
      { tag: 'str', name: 'Last-Modified' },
      { tag: 'str', name: 'ETag' },
    ]},
  ]},
};

// ── Mapping table data keyed by step ─────────────────────────────────────────
// Each entry has: input, putObject (middle-left), output (middle-right), pipelineOut
// Arrows connect output → pipelineOut columns only.

// Step 1 — Get Document By ID (Adobe Sign) — original
const MAPPING_DATA_STEP1 = {
  input:       { doc: 'GetDocumentByIDOutput',  fields: [{ tag: 'obj', name: 'stream',    required: true }] },
  putObject:   { doc: 'putObjectInput',          fields: [
    { tag: 'str', name: 'bucketName',   required: true },
    { tag: 'str', name: 'objectName',   required: true },
    { tag: 'obj', name: 'stream',       required: true },
    { tag: 'str', name: 'Content-Type', required: true },
  ]},
  output:      { doc: 'GetDocIoremispum', fields: [
    { tag: 'str', name: 'loremIpsum',  required: true },
    { tag: 'str', name: 'objectName',  required: true },
    { tag: 'obj', name: 'Placeholder', required: true },
  ]},
  pipelineOut: { doc: 'GetDocIoremispum', fields: [
    { tag: 'str', name: 'date',        required: true },
    { tag: 'str', name: 'placeholder', required: true },
  ]},
};

// Step 1 — after mapping update
const MAPPING_DATA_STEP1_UPDATED = {
  input:       { doc: 'GetDocumentByIDOutput', fields: [{ tag: 'obj', name: 'stream', required: true }] },
  putObject:   { doc: 'putObjectInput', fields: [
    { tag: 'str', name: 'objectName',   required: true },
    { tag: 'obj', name: 'stream',       required: true },
    { tag: 'str', name: 'Content-Type', required: true },
  ]},
  output:      { doc: 'GetDocIoremispum', fields: [
    { tag: 'str', name: 'loremIpsum',  required: true },
    { tag: 'str', name: 'objectName',  required: true },
    { tag: 'obj', name: 'Placeholder', required: true },
  ]},
  pipelineOut: { doc: 'GetDocIoremispum', fields: [
    { tag: 'str', name: 'date',        required: true },
    { tag: 'str', name: 'placeholder', required: true },
  ]},
};

// Step 2 — Put Object (S3)
const MAPPING_DATA_STEP2 = {
  input:       { doc: 'SalesforceAccountOutput', fields: [
    { tag: 'str', name: 'accountId',   required: true },
    { tag: 'str', name: 'accountName', required: true },
    { tag: 'obj', name: 'metadata',    required: false },
  ]},
  putObject:   { doc: 's3PutObjectInput', fields: [
    { tag: 'str', name: 'bucketName',  required: true },
    { tag: 'str', name: 'objectKey',   required: true },
    { tag: 'str', name: 'contentType', required: true },
    { tag: 'obj', name: 'body',        required: true },
  ]},
  output:      { doc: 's3PutObjectOutput', fields: [
    { tag: 'str', name: 'eTag',        required: true },
    { tag: 'str', name: 'versionId',   required: false },
  ]},
  pipelineOut: { doc: 'pipelineS3Result', fields: [
    { tag: 'str', name: 'uploadKey',   required: true },
    { tag: 'str', name: 'eTag',        required: true },
  ]},
};

// Step 3 — Get Document By ID (Adobe Sign) — second call
const MAPPING_DATA_STEP3 = {
  input:       { doc: 'pipelineS3Result', fields: [
    { tag: 'str', name: 'uploadKey', required: true },
  ]},
  putObject:   { doc: 'adobeGetDocInput', fields: [
    { tag: 'str', name: 'documentId', required: true },
    { tag: 'str', name: 'object',     required: true },
  ]},
  output:      { doc: 'adobeGetDocOutput', fields: [
    { tag: 'str', name: 'documentId', required: true },
    { tag: 'obj', name: 'document',   required: true },
    { tag: 'str', name: 'status',     required: true },
  ]},
  pipelineOut: { doc: 'pipelineDocResult', fields: [
    { tag: 'obj', name: 'document',   required: true },
    { tag: 'str', name: 'status',     required: true },
  ]},
};

// Step 8 — Get Agreement Combined Document (Adobe Sign)
const MAPPING_DATA_STEP8 = {
  input:       { doc: 'pipelineDocResult', fields: [
    { tag: 'str', name: 'agreementId', required: true },
    { tag: 'str', name: 'object',      required: true },
  ]},
  putObject:   { doc: 'agreementCombinedInput', fields: [
    { tag: 'str', name: 'agreementId',  required: true },
    { tag: 'str', name: 'attachAudit',  required: false },
    { tag: 'str', name: 'versionId',    required: false },
  ]},
  output:      { doc: 'agreementCombinedOutput', fields: [
    { tag: 'obj', name: 'stream',       required: true },
    { tag: 'str', name: 'Content-Type', required: true },
  ]},
  pipelineOut: { doc: 'pipelineCombinedDoc', fields: [
    { tag: 'obj', name: 'stream',       required: true },
    { tag: 'str', name: 'mimeType',     required: true },
  ]},
};

// Step 9 — IO streamToString
const MAPPING_DATA_STEP9 = {
  input:       { doc: 'pipelineCombinedDoc', fields: [
    { tag: 'obj', name: 'stream', required: true },
  ]},
  putObject:   { doc: 'streamToStringInput', fields: [
    { tag: 'obj', name: 'inputStream', required: true },
    { tag: 'str', name: 'encoding',    required: false },
  ]},
  output:      { doc: 'streamToStringOutput', fields: [
    { tag: 'str', name: 'result',      required: true },
    { tag: 'str', name: 'byteLength',  required: false },
  ]},
  pipelineOut: { doc: 'pipelineStringResult', fields: [
    { tag: 'str', name: 'content',     required: true },
  ]},
};

// ── Mapping lookup by key ─────────────────────────────────────────────────────
const MAPPING_BY_KEY = {
  step1: MAPPING_DATA_STEP1,
  step2: MAPPING_DATA_STEP2,
  step3: MAPPING_DATA_STEP3,
  step8: MAPPING_DATA_STEP8,
  step9: MAPPING_DATA_STEP9,
};
const MAPPING_BY_KEY_UPDATED = {
  step1: MAPPING_DATA_STEP1_UPDATED,
  step2: MAPPING_DATA_STEP2,
  step3: MAPPING_DATA_STEP3,
  step8: MAPPING_DATA_STEP8,
  step9: MAPPING_DATA_STEP9,
};

// Keep these aliases so existing references in engine.js still resolve
const MAPPING_DATA_ORIGINAL = MAPPING_DATA_STEP1;
const MAPPING_DATA_UPDATED   = MAPPING_DATA_STEP1_UPDATED;

// ── Test report data ─────────────────────────────────────────────────────────
const TEST_REPORT_DATA = [
  { name: 'GetDocumentByID_invalidInput', fields: [
    { name: 'id', value: 'invalidid' },
    { name: 'documentId', value: 'documentid' },
    { name: 'object', value: 'agreements' },
  ]},
  { name: 'GetAuditTrialInput', fields: [
    { name: 'id', value: 'InvalidID' },
    { name: 'object', value: 'agreements' },
  ]},
  { name: 'GetFormDataInput', fields: [
    { name: 'id', value: 'invalidformid' },
    { name: 'object', value: 'agreements' },
    { name: 'inputStream', value: 'java.io.ByteArrayInputStream' },
  ]},
  { name: 'getAgreementCombinedDocumentInput', fields: [
    { name: 'object', value: 'agreements' },
    { name: 'id', value: 'invalidid' },
  ]},
];

// ── Flow steps ───────────────────────────────────────────────────────────────
// Step types:
//   agent         — agent message, auto-advances after optional delay
//   reasoning     — shows reasoning spinner + dots, then auto-advances
//   user-prefill  — pre-filled input suggestion, user clicks to send
//   user-free     — free text input, intent detection drives nextStepId
//   clarification — clarification card with options
//   side-effect   — triggers a workspace UI change, then auto-advances

const FLOW = {

  step_welcome: {
    type: 'agent',
    agentMessage: 'How can I help you today, Isaac?',
    showWelcomeCards: true,
    inputType: 'prefill',
    prefillText: 'Sync all Salesforce account with HubSpot CRM contacts if the account ACV is greater than $10M',
    nextStepId: 'step_user_prompt_sent',
  },

  step_user_prompt_sent: {
    type: 'reasoning',
    userBubble: null, // set by engine from prefill
    delay: 2500,
    nextStepId: 'step_agent_recommends_project',
  },

  step_agent_recommends_project: {
    type: 'agent',
    showReasoning: true,
    agentMessage: `Both the Salesforce and HubSpot connectors are available in <strong>project_flow_service2</strong>, so that's the project I'd recommend using.<br><br>Shall I proceed with it?<br><br>Alternatively, you can:<br>1. Choose from all available projects<br>2. Create a new project`,
    inputType: 'prefill',
    prefillText: 'Use project_flow_service2',
    nextStepId: 'step_clarification_questions',
  },

  step_clarification_questions: {
    type: 'clarification',
    userBubble: 'Use project_flow_service2',
    agentMessage: 'I have a few questions about the logic — or you can share a document and I\'ll work from that.',
    questions: [
      {
        question: 'When you say \'sync\', do you mean?',
        options: [
          { label: 'Upsert - create new and update existing records' },
          { label: 'Create only - add new records and skip existing ones' },
        ],
        disabledOption: 'Other...',
        skipLabel: 'Skip',
      },
      {
        question: 'What is the error handling strategy?',
        options: [
          { label: 'Overwrite it' },
          { label: 'Skip and log the error' },
          { label: 'Stop the flow and raise an alert' },
        ],
        disabledOption: null,
        skipLabel: 'Skip',
      },
      {
        question: 'You mentioned \'ACV\' as a filter condition. What is the exact field name?',
        options: [
          { label: 'ACV__c' },
          { label: 'Annual_Contract_Value' },
          { label: 'Skip and log' },
        ],
        disabledOption: null,
        skipLabel: 'Skip',
      },
    ],
    nextStepId: 'step_clarification_answered',
  },

  step_clarification_answered: {
    type: 'reasoning',
    // userBubble is set dynamically by engine (captures selected answer)
    delay: 2500,
    nextStepId: 'step_flow_service_ready',
  },

  step_flow_service_ready: {
    type: 'agent',
    showReasoning: true,
    agentMessage: `Here's the flow service — both the business logic and technical view with mapping are ready. Review and let me know if anything needs changing.<br><br>If you're happy with it, I can deploy it on design runtime. You can continue to make changes.`,
    showFlowServiceCard: true,
    flowServiceCardState: 'details', // shows "View details" link
    inputType: 'free',
    nextStepId: null, // driven by card click
  },

  step_workspace_business_view: {
    type: 'side-effect',
    sideEffect: 'open_workspace_business',
    nextStepId: null, // workspace open; next driven by tab click → step_workspace_technical_view_open
  },

  step_workspace_technical_view_open: {
    type: 'side-effect',
    sideEffect: 'open_workspace_technical',
    nextStepId: null,
  },

  step_workspace_technical_view_all_collapsed: {
    type: 'side-effect',
    sideEffect: 'collapse_all_accordion',
    nextStepId: null,
  },

  step_workspace_full_mapping_view: {
    type: 'side-effect',
    sideEffect: 'open_full_mapping',
    nextStepId: null,
  },

  step_flow_service_saved: {
    type: 'agent',
    showReasoning: true,
    agentMessage: `I've saved your flow service successfully on design runtime. You can continue refining it, and once you're ready, you can run a test to validate the setup.<br><br>If you prefer I can help you with two additional things:<br>1. Update the mapping<br>2. Test with sample data`,
    updateFlowCardToActive: true,
    updateWorkspaceBadgeToActive: true,
    inputType: 'free',
    nextStepId: null, // intent-driven
  },

  step_test_intent: {
    type: 'prefill-only',
    prefillText: 'Test with sample data',
    nextStepId: 'step_test_triggered',
  },

  step_test_triggered: {
    type: 'agent',
    agentMessage: 'I have tested your flow service.',
    showTestResult: true,
    showTestReportCard: true,
    testReportCardState: 'details',
    inputType: 'free',
    nextStepId: null, // driven by card click
  },

  step_test_report_open: {
    type: 'side-effect',
    sideEffect: 'open_test_report',
    nextStepId: null, // end of flow
  },

  // ── UPDATE MAPPING BRANCH ──────────────────────────────────────────────────

  step_update_mapping_intent: {
    type: 'agent',
    showReasoning: true,
    agentMessage: `You can update the mapping in a few ways:<br>1. Upload a mapping file — share a CSV<br>2. Edit locally — download the mapping, update it, upload it back<br>3. <a href="#" onclick="return false;">Edit in the product ↗</a> — open the canvas and change it directly`,
    inputType: 'prefill-with-attachment',
    prefillText: 'Update mapping using this file',
    prefillAttachment: 'mapping_01.csv',
    nextStepId: null, // driven by file picker interaction
  },

  step_file_picker_open: {
    type: 'side-effect',
    sideEffect: 'open_file_picker',
    nextStepId: null,
  },

  step_file_attached: {
    type: 'prefill-only',
    prefillText: 'Update mapping using this file',
    withAttachment: true,
    nextStepId: 'step_mapping_updated',
  },

  step_mapping_updated: {
    type: 'agent',
    showReasoning: true,
    agentMessage: `I have made the following updates<br><br><strong>Change to step 1:</strong> Get Document By ID from Adobe Sign<br>— encoding → set to <em>"UTF-8"</em> (was: not mapped)<br><br><strong>Changes to step 3:</strong> Get Document By ID from Adobe Sign<br>— documentId → from <span style="color:#0f62fe">pipeline.id</span> (was: from <span style="color:#0f62fe">GetDocumentByIDOutput.docId</span>)<br>— inputStream → from <span style="color:#0f62fe">getAgreementCombinedDocumentOutput.stream</span> (was: from <span style="color:#0f62fe">putObjectOutput.stream</span>)`,
    updateMappingData: true,
    showFlowServiceCardViewing: true, // re-show the flow card in Active+Viewing state
    inputType: 'free',
    nextStepId: 'step_test_intent', // merges back to happy path
  },
};
