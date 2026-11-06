
const PREVIEW_META = {source: '.frontend-design/udav/2026-11-05-udav.html',topic:'УДАВ — точный главный экран',targetFile:'src/prototype.css'};

const TOKENS={brand:[{key:'--udav-lime',intent:'Активная вкладка',kind:'color',options:[{id:'Original',light:'#d6ff00',dark:'#d6ff00',note:'original default'},{id:'Soft',light:'#e1ff66',dark:'#e1ff66',note:'soft'}]}],touch:[{key:'--udav-radius',intent:'Скругление вкладок',kind:'slider',min:18,max:36,step:2,defaultValue:28,unit:'px'}]};
const SECTION_ORDER=[['Удав: акцент','brand'],['Удав: нажатия','touch']];

/* ============================================================
   DECISION SYSTEM
   ============================================================ */
const decisions = {};

function defaultId(group) {
  if (group.kind === 'segmented' || group.kind === 'dropdown' || group.kind === 'color') {
    if (group.defaultId) return group.defaultId;
    if (!group.options) return null;
    const planDefault = group.options.find(o => /default/i.test(o.note || ''));
    return (planDefault || group.options[0]).id;
  }
  return null;
}
function initDecisions() {
  for (const [, secKey] of SECTION_ORDER) {
    for (const group of TOKENS[secKey]) {
      if (group.kind === 'slider') decisions[group.key] = group.defaultValue;
      else if (group.kind === 'toggle') decisions[group.key] = !!group.defaultValue;
      else decisions[group.key] = defaultId(group);
    }
  }
}
initDecisions();

function findOption(group, id) {
  return (group.options || []).find(o => o.id === id);
}

const lightEl = () => document.getElementById('preview-light');
const darkEl  = () => document.getElementById('preview-dark');

function applyVariableToPreview(group, value) {
  if (group.kind === 'color') {
    lightEl().style.setProperty(group.key, value.light);
    darkEl().style.setProperty(group.key, value.dark);
  } else if (group.kind === 'slider') {
    const cssVal = value + (group.unit || '');
    lightEl().style.setProperty(group.key, cssVal);
    darkEl().style.setProperty(group.key, cssVal);
  } else if (group.kind === 'segmented' || group.kind === 'dropdown') {
    lightEl().style.setProperty(group.key, value.value);
    darkEl().style.setProperty(group.key, value.value);
  } else if (group.kind === 'toggle') {
    lightEl().style.setProperty(group.key, value ? '1' : '0');
    darkEl().style.setProperty(group.key, value ? '1' : '0');
  }
}

function getCurrentValueForApply(group) {
  const v = decisions[group.key];
  if (group.kind === 'color' || group.kind === 'segmented' || group.kind === 'dropdown') {
    return findOption(group, v);
  }
  return v;
}

function applyAllDecisions() {
  for (const [, secKey] of SECTION_ORDER) {
    for (const group of TOKENS[secKey]) {
      applyVariableToPreview(group, getCurrentValueForApply(group));
    }
  }
}

function visualForOption(group, opt, size) {
  if (group.kind === 'color') {
    const sw = size === 'lg' ? 'lg' : '';
    return `<span class="sw-pair"><span class="sw ${sw}" style="background:${opt.light}"></span><span class="sw ${sw}" style="background:${opt.dark}; border-color: rgba(255,255,255,0.15)"></span></span>`;
  }
  return '';
}
function summaryText(group, opt) {
  if (group.kind === 'color') return `${opt.light} / ${opt.dark}`;
  return opt.value || opt.id;
}

let activeDropdown = null;
function closeActiveDropdown() {
  if (!activeDropdown) return;
  activeDropdown.panel.classList.remove('open');
  activeDropdown.trigger.classList.remove('open');
  applyVariableToPreview(activeDropdown.group, getCurrentValueForApply(activeDropdown.group));
  activeDropdown = null;
}

function renderControls() {
  const rail = document.getElementById('controls-body');
  const helpBanner = rail.querySelector('.help-banner');
  rail.innerHTML = '';
  if (helpBanner) rail.appendChild(helpBanner);

  for (const [secTitle, secKey] of SECTION_ORDER) {
    const head = document.createElement('div');
    head.className = 'section-head';
    head.textContent = secTitle;
    rail.appendChild(head);

    for (const group of TOKENS[secKey]) {
      const row = document.createElement('div');
      row.className = 'control-row';
      row.dataset.varKey = group.key;
      row.innerHTML = `
        <div class="lbl">
          <span class="var-name">${group.key}</span>
          <span class="var-intent">${group.intent}</span>
        </div>
      `;
      if (group.kind === 'color' || group.kind === 'dropdown') renderDropdown(row, group);
      else if (group.kind === 'slider') renderSlider(row, group);
      else if (group.kind === 'segmented') renderSegmented(row, group);
      else if (group.kind === 'toggle') renderToggle(row, group);
      rail.appendChild(row);
    }
  }
}

function renderDropdown(row, group) {
  const wrap = document.createElement('div');
  wrap.className = 'dropdown';
  wrap.innerHTML = `
    <button type="button" class="dd-trigger" aria-haspopup="listbox" aria-expanded="false"></button>
    <div class="dd-panel" role="listbox"></div>
  `;
  row.appendChild(wrap);
  const trigger = wrap.querySelector('.dd-trigger');
  const panel = wrap.querySelector('.dd-panel');

  const refreshTrigger = () => {
    const opt = findOption(group, decisions[group.key]);
    trigger.innerHTML = `
      <span class="left">
        <span class="opt-id">${opt.id}</span>
        <span class="visual">${visualForOption(group, opt, '')}</span>
        <span class="opt-summary">${summaryText(group, opt)}</span>
      </span>
      <span class="caret">▾</span>
    `;
  };
  refreshTrigger();

  panel.innerHTML = '';
  for (const opt of group.options) {
    const optBtn = document.createElement('button');
    optBtn.type = 'button';
    optBtn.className = 'dd-option';
    optBtn.dataset.optId = opt.id;
    optBtn.innerHTML = `
      <span class="opt-id">${opt.id}</span>
      <span class="visual">${visualForOption(group, opt, 'lg')}</span>
      <span class="opt-text">
        <div class="opt-value">${group.kind === 'color' ? `${opt.light} / ${opt.dark}` : opt.value || opt.id}</div>
        <div class="opt-note">${opt.note || ''}</div>
      </span>
    `;
    if (decisions[group.key] === opt.id) optBtn.classList.add('selected');
    optBtn.addEventListener('mouseenter', () => applyVariableToPreview(group, opt));
    optBtn.addEventListener('mouseleave', () => applyVariableToPreview(group, getCurrentValueForApply(group)));
    optBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      decisions[group.key] = opt.id;
      applyVariableToPreview(group, opt);
      panel.querySelectorAll('.dd-option').forEach(s => s.classList.remove('selected'));
      optBtn.classList.add('selected');
      refreshTrigger();
      panel.classList.remove('open');
      trigger.classList.remove('open');
      activeDropdown = null;
    });
    panel.appendChild(optBtn);
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.contains('open');
    closeActiveDropdown();
    if (!isOpen) {
      panel.classList.add('open');
      trigger.classList.add('open');
      activeDropdown = { panel, trigger, group };
    }
  });
}

function renderSlider(row, group) {
  const wrap = document.createElement('div');
  wrap.className = 'slider-control';
  const fillPct = (decisions[group.key] - group.min) / (group.max - group.min) * 100;
  wrap.innerHTML = `
    <span class="range-meta">${group.min}</span>
    <input type="range" min="${group.min}" max="${group.max}" step="${group.step}" value="${decisions[group.key]}" style="--fill: ${fillPct}%">
    <span class="range-meta">${group.max}</span>
    <span class="value-chip">${decisions[group.key]}${group.unit || ''}</span>
  `;
  row.appendChild(wrap);
  const slider = wrap.querySelector('input[type="range"]');
  const chip = wrap.querySelector('.value-chip');
  slider.addEventListener('input', () => {
    const v = Number(slider.value);
    decisions[group.key] = v;
    applyVariableToPreview(group, v);
    chip.textContent = v + (group.unit || '');
    const pct = (v - group.min) / (group.max - group.min) * 100;
    slider.style.setProperty('--fill', pct + '%');
  });
}

function renderSegmented(row, group) {
  const wrap = document.createElement('div');
  wrap.className = 'segmented';
  for (const opt of group.options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.optId = opt.id;
    btn.textContent = opt.id;
    if (decisions[group.key] === opt.id) btn.classList.add('active');
    btn.addEventListener('click', () => {
      decisions[group.key] = opt.id;
      applyVariableToPreview(group, opt);
      wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    wrap.appendChild(btn);
  }
  row.appendChild(wrap);
}

function renderToggle(row, group) {
  const wrap = document.createElement('div');
  wrap.className = 'toggle-control' + (decisions[group.key] ? ' on' : '');
  wrap.innerHTML = `
    <span class="toggle-state">${decisions[group.key] ? 'on' : 'off'}</span>
    <span class="toggle-switch"></span>
  `;
  row.appendChild(wrap);
  wrap.addEventListener('click', () => {
    decisions[group.key] = !decisions[group.key];
    wrap.classList.toggle('on', decisions[group.key]);
    wrap.querySelector('.toggle-state').textContent = decisions[group.key] ? 'on' : 'off';
    applyVariableToPreview(group, decisions[group.key]);
  });
}

document.addEventListener('click', (e) => {
  if (activeDropdown && !activeDropdown.panel.contains(e.target) && !activeDropdown.trigger.contains(e.target)) {
    closeActiveDropdown();
  }
});

/* ============================================================
   COMMENT SYSTEM
   ============================================================ */
const SCOPE_OPTIONS = [
  { id: 'this',          label: 'This element' },
  { id: 'all-matching',  label: 'All matching' },
  { id: 'all-like-this', label: 'All like this' },
  { id: 'global',        label: 'Global' }
];

const directEditInitialValues = new Map();

function editableKey(el) {
  return el.dataset.fdId || elementToPathPart(el);
}

function getEditableValue(el) {
  if (el.matches('input, textarea, select')) {
    return el.value;
  }
  return el.textContent.trim();
}

function setEditableValue(el, value) {
  if (el.matches('input, textarea, select')) {
    el.value = value;
    return;
  }
  el.textContent = value;
}

function directEditSelector(key) {
  return `[data-fd-id="${key}"]`;
}

function syncEditableMirrors(sourceEl) {
  const key = editableKey(sourceEl);
  const value = getEditableValue(sourceEl);
  document.querySelectorAll(`${directEditSelector(key)}[data-fd-editable]`).forEach(el => {
    if (el !== sourceEl) setEditableValue(el, value);
  });
}

function initDirectEdits() {
  document.querySelectorAll('[data-fd-editable]').forEach(el => {
    const key = editableKey(el);
    if (!directEditInitialValues.has(key)) {
      directEditInitialValues.set(key, getEditableValue(el));
    }
    if (el.dataset.fdEditable === 'text') {
      el.setAttribute('contenteditable', 'plaintext-only');
      el.setAttribute('spellcheck', 'false');
      el.setAttribute('tabindex', '0');
    }
    const sync = () => syncEditableMirrors(el);
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
  });
}

function collectDirectEdits() {
  const edits = [];
  const seen = new Set();
  document.querySelectorAll('[data-fd-editable]').forEach(el => {
    const key = editableKey(el);
    if (seen.has(key)) return;
    seen.add(key);
    const initial = directEditInitialValues.get(key);
    const value = getEditableValue(el);
    if (initial !== undefined && value !== initial) {
      edits.push({
        selector: directEditSelector(key),
        label: key,
        kind: el.dataset.fdEditable || 'text',
        value,
        initial
      });
    }
  });
  return edits;
}

function resetDirectEdits() {
  document.querySelectorAll('[data-fd-editable]').forEach(el => {
    const key = editableKey(el);
    if (directEditInitialValues.has(key)) {
      setEditableValue(el, directEditInitialValues.get(key));
    }
  });
}

const comments = [];
let nextCommentId = 1;
let commentMode = false;
let markersVisible = false;
let popoverEditingId = null;
let popoverTargetEl = null;
let popoverTargetSelector = null;

const markersLayer = document.getElementById('markers-layer');
const previewPair = document.getElementById('preview-pair');

function setCommentMode(on) {
  commentMode = on;
  document.body.classList.toggle('comment-mode', on);
  document.getElementById('comment-mode-btn').classList.toggle('toggled', on);
  document.getElementById('comment-mode-label').textContent = on ? 'Exit Comment Mode' : 'Comment Mode';
  if (!on) { hidePickerOverlay(); hidePickerHint(); }
}

function setMarkersVisible(on) {
  markersVisible = on;
  document.body.classList.toggle('markers-visible', on);
  document.getElementById('markers-btn').classList.toggle('toggled', on);
  document.getElementById('markers-label').textContent = on ? 'Hide Markers' : 'Show Markers';
}

function resolveSelectorForElement(el) {
  let cursor = el;
  let subPath = [];
  let anchorEl = null;
  while (cursor && cursor !== document.body) {
    if (cursor.dataset && cursor.dataset.fdId) { anchorEl = cursor; break; }
    subPath.unshift(elementToPathPart(cursor));
    cursor = cursor.parentElement;
  }
  if (!anchorEl) {
    return {
      selector: elementToPathPart(el),
      anchorFdId: null, subSelector: null,
      label: '(no anchor)', hasWarning: true
    };
  }
  const anchorId = anchorEl.dataset.fdId;
  if (subPath.length === 0) {
    return {
      selector: `[data-fd-id="${anchorId}"]`,
      anchorFdId: anchorId, subSelector: null,
      label: anchorId, hasWarning: false
    };
  }
  const sub = subPath.join(' > ');
  return {
    selector: `[data-fd-id="${anchorId}"] > ${sub}`,
    anchorFdId: anchorId, subSelector: sub,
    label: `${anchorId} > ${sub}`, hasWarning: false
  };
}
function elementToPathPart(el) {
  const tag = el.tagName.toLowerCase();
  const cls = (el.className && typeof el.className === 'string')
    ? el.className.trim().split(/\s+/).filter(c => c && !c.startsWith('comment-')).slice(0, 2).join('.')
    : '';
  return cls ? `${tag}.${cls}` : tag;
}

function findMirrorElement(el) {
  const lightRoot = document.getElementById('preview-light');
  const darkRoot = document.getElementById('preview-dark');
  const inLight = lightRoot.contains(el);
  const inDark = darkRoot.contains(el);
  if (!inLight && !inDark) return null;
  const sourceRoot = inLight ? lightRoot : darkRoot;
  const mirrorRoot = inLight ? darkRoot : lightRoot;
  const path = [];
  let cursor = el;
  while (cursor && cursor !== sourceRoot) {
    const parent = cursor.parentElement;
    if (!parent) return null;
    path.unshift(Array.from(parent.children).indexOf(cursor));
    cursor = parent;
  }
  let mirror = mirrorRoot;
  for (const idx of path) {
    if (!mirror.children[idx]) return null;
    mirror = mirror.children[idx];
  }
  return mirror;
}

function tagElementForComment(el, commentId) {
  const tag = `c${commentId}`;
  el.setAttribute('data-fd-comment-target', tag);
  const mirror = findMirrorElement(el);
  if (mirror) mirror.setAttribute('data-fd-comment-target', tag);
  return tag;
}
function untagComment(commentId) {
  const tag = `c${commentId}`;
  document.querySelectorAll(`[data-fd-comment-target="${tag}"]`).forEach(el => {
    el.removeAttribute('data-fd-comment-target');
  });
}
function untagAllComments() {
  document.querySelectorAll('[data-fd-comment-target]').forEach(el => {
    el.removeAttribute('data-fd-comment-target');
  });
}

const pickerOverlay = document.getElementById('picker-overlay');
const pickerHint = document.getElementById('picker-hint');

function showPickerOverlay(el) {
  const rect = el.getBoundingClientRect();
  pickerOverlay.style.top = rect.top + 'px';
  pickerOverlay.style.left = rect.left + 'px';
  pickerOverlay.style.width = rect.width + 'px';
  pickerOverlay.style.height = rect.height + 'px';
  pickerOverlay.classList.add('visible');
}
function hidePickerOverlay() { pickerOverlay.classList.remove('visible'); }
function showPickerHint(text, x, y, warning) {
  pickerHint.textContent = text;
  pickerHint.classList.toggle('warning', !!warning);
  pickerHint.classList.add('visible');
  pickerHint.style.left = (x + 14) + 'px';
  pickerHint.style.top  = (y + 18) + 'px';
}
function hidePickerHint() { pickerHint.classList.remove('visible'); }

previewPair.addEventListener('mousemove', (e) => {
  if (!commentMode) return;
  const t = e.target;
  if (!t || t === pickerOverlay || pickerOverlay.contains(t)) return;
  if (t.closest('.comment-list-panel') || t.closest('.comment-popover') || t.closest('.markers-layer')) return;
  const previewEl = t.closest('.preview');
  if (!previewEl) return;
  showPickerOverlay(t);
  const resolved = resolveSelectorForElement(t);
  showPickerHint(resolved.label, e.clientX, e.clientY, resolved.hasWarning);
});

previewPair.addEventListener('mouseleave', () => {
  if (commentMode) { hidePickerOverlay(); hidePickerHint(); }
});

previewPair.addEventListener('click', (e) => {
  if (!commentMode) return;
  const t = e.target;
  if (!t || t.closest('.comment-list-panel') || t.closest('.comment-popover')) return;
  const previewEl = t.closest('.preview');
  if (!previewEl) return;
  e.preventDefault();
  e.stopPropagation();

  const existingTag = t.getAttribute('data-fd-comment-target');
  if (existingTag) {
    const existing = comments.find(c => c.targetAttr === existingTag);
    if (existing) { openCommentPopover(t, existing.id); return; }
  }
  openCommentPopover(t);
}, true);

const popover = document.getElementById('comment-popover');
const popTarget = document.getElementById('pop-target');
const popWarning = document.getElementById('pop-warning');
const popTextarea = document.getElementById('pop-textarea');
const popScopeOptions = document.getElementById('pop-scope-options');
const popDelete = document.getElementById('pop-delete');
const parentLink = document.getElementById('parent-link');
const childLink = document.getElementById('child-link');

function renderScopeOptions(activeId) {
  popScopeOptions.innerHTML = '';
  for (const opt of SCOPE_OPTIONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scope-opt' + (opt.id === activeId ? ' selected' : '');
    btn.dataset.scope = opt.id;
    btn.innerHTML = `<div>${opt.label}</div>`;
    btn.addEventListener('click', () => {
      popScopeOptions.querySelectorAll('.scope-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    popScopeOptions.appendChild(btn);
  }
}
function getSelectedScope() {
  const sel = popScopeOptions.querySelector('.scope-opt.selected');
  return sel ? sel.dataset.scope : 'this';
}
function updateNavLinks() {
  if (!popoverTargetEl) {
    parentLink.disabled = true; childLink.disabled = true; return;
  }
  const parent = popoverTargetEl.parentElement;
  parentLink.disabled = !parent || !parent.closest('.preview') || parent.classList.contains('preview');
  const firstChild = popoverTargetEl.firstElementChild;
  childLink.disabled = !firstChild;
}

function openCommentPopover(targetEl, existingId = null) {
  popoverTargetEl = targetEl;
  let resolved, comment, defaultScope = 'this', defaultText = '';
  if (existingId !== null) {
    comment = comments.find(c => c.id === existingId);
    if (!comment) return;
    popoverEditingId = existingId;
    if (comment.scope === 'global') {
      resolved = { selector: '(global)', anchorFdId: null, subSelector: null, label: '(global)', hasWarning: false };
    } else {
      resolved = {
        selector: comment.fallbackSelector,
        anchorFdId: comment.anchorFdId,
        subSelector: comment.subSelector,
        label: comment.label,
        hasWarning: comment.hasWarning
      };
    }
    defaultScope = comment.scope;
    defaultText = comment.text;
    popDelete.style.display = 'inline-block';
  } else {
    popoverEditingId = null;
    resolved = resolveSelectorForElement(targetEl);
    popDelete.style.display = 'none';
  }
  popoverTargetSelector = resolved;
  popTarget.textContent = resolved.label;
  popWarning.style.display = resolved.hasWarning ? 'block' : 'none';
  popTextarea.value = defaultText;
  renderScopeOptions(defaultScope);
  updateNavLinks();

  const r = targetEl.getBoundingClientRect();
  let left = Math.min(r.left, window.innerWidth - 380);
  left = Math.max(12, left);
  let top = r.bottom + 8;
  if (top + 360 > window.innerHeight) top = Math.max(12, r.top - 360);
  popover.style.left = left + 'px';
  popover.style.top = top + 'px';
  popover.classList.add('open');
  popTextarea.focus();
}
function closeCommentPopover() {
  popover.classList.remove('open');
  popoverEditingId = null;
  popoverTargetEl = null;
  popoverTargetSelector = null;
}

parentLink.addEventListener('click', () => {
  if (!popoverTargetEl) return;
  const parent = popoverTargetEl.parentElement;
  if (!parent || !parent.closest('.preview') || parent.classList.contains('preview')) return;
  popoverTargetEl = parent;
  const resolved = resolveSelectorForElement(parent);
  popoverTargetSelector = resolved;
  popTarget.textContent = resolved.label;
  popWarning.style.display = resolved.hasWarning ? 'block' : 'none';
  updateNavLinks();
});
childLink.addEventListener('click', () => {
  if (!popoverTargetEl) return;
  const firstChild = popoverTargetEl.firstElementChild;
  if (!firstChild) return;
  popoverTargetEl = firstChild;
  const resolved = resolveSelectorForElement(firstChild);
  popoverTargetSelector = resolved;
  popTarget.textContent = resolved.label;
  popWarning.style.display = resolved.hasWarning ? 'block' : 'none';
  updateNavLinks();
});

document.getElementById('pop-cancel').addEventListener('click', closeCommentPopover);
document.getElementById('pop-save').addEventListener('click', () => {
  const text = popTextarea.value.trim();
  if (!text) { showToast('Note is empty'); return; }
  const scope = getSelectedScope();
  const resolved = popoverTargetSelector;
  if (popoverEditingId !== null) {
    const c = comments.find(x => x.id === popoverEditingId);
    if (c) {
      untagComment(c.id);
      if (scope !== 'global' && popoverTargetEl) {
        const tag = tagElementForComment(popoverTargetEl, c.id);
        c.targetAttr = tag;
        c.anchorFdId = resolved.anchorFdId;
        c.subSelector = resolved.subSelector;
        c.fallbackSelector = resolved.selector;
        c.label = resolved.label;
        c.hasWarning = resolved.hasWarning;
      } else {
        c.targetAttr = null;
        c.anchorFdId = null; c.subSelector = null; c.fallbackSelector = null;
        c.label = '(global)'; c.hasWarning = false;
      }
      c.scope = scope;
      c.text = text;
    }
  } else {
    const id = nextCommentId++;
    let targetAttr = null;
    if (scope !== 'global' && popoverTargetEl) {
      targetAttr = tagElementForComment(popoverTargetEl, id);
    }
    comments.push({
      id, targetAttr,
      anchorFdId: scope === 'global' ? null : resolved.anchorFdId,
      subSelector: scope === 'global' ? null : resolved.subSelector,
      fallbackSelector: scope === 'global' ? null : resolved.selector,
      label: scope === 'global' ? '(global)' : resolved.label,
      hasWarning: scope === 'global' ? false : resolved.hasWarning,
      scope, text
    });
  }
  closeCommentPopover();
  refreshMarkersAndList();
});
popDelete.addEventListener('click', () => {
  if (popoverEditingId === null) return;
  deleteCommentById(popoverEditingId);
  closeCommentPopover();
});

function deleteCommentById(id) {
  const i = comments.findIndex(c => c.id === id);
  if (i < 0) return;
  untagComment(id);
  comments.splice(i, 1);
  refreshMarkersAndList();
}

function renderMarkers() {
  markersLayer.innerHTML = '';
  comments.forEach((c, idx) => {
    if (c.scope === 'global') return;
    if (!c.targetAttr) return;
    const num = idx + 1;
    const els = document.querySelectorAll(`[data-fd-comment-target="${c.targetAttr}"]`);
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const marker = document.createElement('span');
      marker.className = 'comment-marker';
      marker.textContent = num;
      marker.title = `Comment ${num}`;
      marker.style.left = (rect.right - 9) + 'px';
      marker.style.top  = (rect.top - 9) + 'px';
      marker.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        openCommentPopover(el, c.id);
      });
      markersLayer.appendChild(marker);
    });
  });
}

function refreshCommentList() {
  const body = document.getElementById('clp-body');
  document.getElementById('clp-count').textContent = `(${comments.length})`;
  document.getElementById('comment-count').textContent = `(${comments.length})`;
  if (comments.length === 0) {
    body.innerHTML = `<div class="empty-state">No comments yet. Click <strong>Comment Mode</strong> in the header, then click any element in the preview to annotate.</div>`;
    return;
  }
  body.innerHTML = '';
  comments.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'clp-item';
    item.dataset.commentId = c.id;
    const target = c.scope === 'global'
      ? '(global)'
      : (c.subSelector ? `[data-fd-id="${c.anchorFdId}"] > ${c.subSelector}` : (c.anchorFdId ? `[data-fd-id="${c.anchorFdId}"]` : c.fallbackSelector));
    item.innerHTML = `
      <div class="clp-item-head">
        <span class="clp-num">${idx + 1}</span>
        <span class="clp-scope">${c.scope}</span>
        <div class="clp-actions">
          <button class="clp-edit" title="Edit">✎</button>
          <button class="clp-delete" title="Delete">✕</button>
        </div>
      </div>
      <div class="clp-target">${target}</div>
      <div class="clp-text">${escapeHtml(c.text)}</div>
      <div class="clp-edit-form">
        <textarea>${escapeHtml(c.text)}</textarea>
        <div class="clp-edit-actions">
          <button class="clp-edit-cancel" title="Cancel">✕</button>
          <button class="clp-edit-save" title="Save">✓</button>
        </div>
      </div>
    `;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.clp-actions') || e.target.closest('.clp-edit-form')) return;
      if (item.classList.contains('editing')) return;
      if (c.scope === 'global') {
        openCommentPopover(document.getElementById('preview-light'), c.id);
        return;
      }
      const el = c.targetAttr
        ? document.querySelector(`[data-fd-comment-target="${c.targetAttr}"]`)
        : (c.anchorFdId ? document.querySelector(`[data-fd-id="${c.anchorFdId}"]`) : null);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => openCommentPopover(el, c.id), 250);
      }
    });
    item.querySelector('.clp-edit').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      item.classList.add('editing');
      const ta = item.querySelector('.clp-edit-form textarea');
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    });
    item.querySelector('.clp-delete').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      deleteCommentById(c.id);
    });
    item.querySelector('.clp-edit-save').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const newText = item.querySelector('.clp-edit-form textarea').value.trim();
      if (!newText) { showToast('Note is empty'); return; }
      c.text = newText;
      refreshCommentList();
    });
    item.querySelector('.clp-edit-cancel').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      item.querySelector('.clp-edit-form textarea').value = c.text;
      item.classList.remove('editing');
    });
    body.appendChild(item);
  });
}
function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
function refreshMarkersAndList() { renderMarkers(); refreshCommentList(); }

previewPair.addEventListener('scroll', renderMarkers);
window.addEventListener('resize', renderMarkers);

document.getElementById('comment-mode-btn').addEventListener('click', () => setCommentMode(!commentMode));
document.getElementById('markers-btn').addEventListener('click', () => setMarkersVisible(!markersVisible));
document.getElementById('comment-list-btn').addEventListener('click', () => {
  document.getElementById('comment-list-panel').classList.toggle('open');
});
document.getElementById('clp-close').addEventListener('click', () => {
  document.getElementById('comment-list-panel').classList.remove('open');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (popover.classList.contains('open')) { closeCommentPopover(); return; }
    if (commentMode) { setCommentMode(false); return; }
    closeActiveDropdown();
  }
});

/* ============================================================
   EXPORT
   ============================================================ */
function buildExportMarkdown() {
  const lines = [];
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  lines.push('## Frontend design round-trip');
  lines.push('Source: ' + PREVIEW_META.source);
  lines.push('Captured at: ' + ts + ' (local)');
  lines.push('Skill: frontend-design');
  lines.push('Topic: ' + PREVIEW_META.topic);
  lines.push('');

  const changedDecisions = collectChangedDecisions();
  const directEdits = collectDirectEdits();
  const hasDecisions = changedDecisions.size > 0;
  const hasDirectEdits = directEdits.length > 0;
  const hasComments = comments.length > 0;

  if (!hasDecisions && !hasDirectEdits && !hasComments) return null;

  if (hasDecisions) {
    lines.push('### Decisions');
    lines.push('');
    for (const [secTitle, secKey] of SECTION_ORDER) {
      const groupsInSec = TOKENS[secKey].filter(g => changedDecisions.has(g.key));
      if (groupsInSec.length === 0) continue;
      lines.push('#### ' + secTitle);
      for (const group of groupsInSec) appendDecisionLines(lines, group);
      lines.push('');
    }
  }

  if (hasDirectEdits) {
    lines.push('### Direct edits');
    lines.push('');
    directEdits.forEach((edit, idx) => {
      lines.push('#### Edit ' + (idx + 1));
      lines.push('- Element: `' + edit.selector + '` (' + edit.label + ')');
      lines.push('- Kind: ' + edit.kind);
      const valueLines = edit.value.split('\n');
      lines.push('- Value: ' + valueLines[0]);
      for (let i = 1; i < valueLines.length; i++) lines.push('  ' + valueLines[i]);
      lines.push('');
    });
  }

  if (hasComments) {
    lines.push('### Element comments');
    lines.push('');
    comments.forEach((c, idx) => {
      lines.push('#### Comment ' + (idx + 1));
      let elementLine;
      if (c.scope === 'global') {
        elementLine = '- Element: (global)';
      } else if (c.anchorFdId) {
        const sel = c.subSelector
          ? `\`[data-fd-id="${c.anchorFdId}"] > ${c.subSelector}\` (descendant of ${c.anchorFdId})`
          : `\`[data-fd-id="${c.anchorFdId}"]\` (${c.anchorFdId})`;
        elementLine = `- Element: ${sel}`;
      } else {
        elementLine = `- Element: \`${c.fallbackSelector}\` (warning: no data-fd-id anchor — selector is best-effort)`;
      }
      lines.push(elementLine);
      lines.push('- Scope: ' + c.scope);
      const noteLines = c.text.split('\n');
      lines.push('- Note: ' + noteLines[0]);
      for (let i = 1; i < noteLines.length; i++) lines.push('  ' + noteLines[i]);
      lines.push('');
    });
  }

  lines.push('### Apply');
  lines.push('');
  lines.push('When applying these changes:');
  lines.push('');
  let step = 1;
  if (hasDecisions) {
    lines.push(step + '. **Token decisions** — write into `' + PREVIEW_META.targetFile + '` under `:root` (typography/radius/spacing), `.theme-light`, and `.theme-dark` blocks. Components must consume the CSS variables; do not hardcode values per component.');
    lines.push('');
    step += 1;
  }
  if (hasDirectEdits) {
    lines.push(step + '. **Direct edits** — locate each edited element via its `data-fd-id` in the corresponding source. Apply value changes to components, props, fixtures, or locale keys as appropriate. Do not bypass i18n for user-facing copy when the project has i18n.');
    lines.push('');
    step += 1;
  }
  if (hasComments) {
    lines.push(step + '. **Element comments** — locate each commented element via its `data-fd-id` in the corresponding source. Apply the change as instructed by the Note text. Honor the Scope:');
    lines.push('   - `this` → modify only this specific instance');
    lines.push('   - `all-matching` → modify the component-level CSS / source so all matching elements get the change');
    lines.push('   - `all-like-this` → modify the shared component such that all elements sharing the data-fd-id family pick up the change');
    lines.push('   - `global` → modify the global token / theme file');
    lines.push('');
    step += 1;
  }
  lines.push(step + '. **Verify** — build / lint / preview as appropriate for the project. Optionally regenerate the preview HTML to confirm the new state.');
  return lines.join('\n');
}

function collectChangedDecisions() {
  const changed = new Set();
  for (const [, secKey] of SECTION_ORDER) {
    for (const group of TOKENS[secKey]) {
      const cur = decisions[group.key];
      if (group.kind === 'slider') {
        if (cur !== group.defaultValue) changed.add(group.key);
      } else if (group.kind === 'toggle') {
        if (!!cur !== !!group.defaultValue) changed.add(group.key);
      } else {
        if (cur !== defaultId(group)) changed.add(group.key);
      }
    }
  }
  return changed;
}

function appendDecisionLines(lines, group) {
  if (group.kind === 'color') {
    const opt = findOption(group, decisions[group.key]);
    lines.push(`- \`${group.key}\` (light) → \`${opt.light}\``);
    lines.push(`- \`${group.key}\` (dark)  → \`${opt.dark}\``);
    const rejected = group.options.filter(o => o.id !== opt.id)
      .map(o => `${o.id}(L:${o.light}/D:${o.dark})`).join(', ');
    if (rejected) lines.push(`  - rejected: ${rejected}`);
  } else if (group.kind === 'slider') {
    lines.push(`- \`${group.key}\` → \`${decisions[group.key]}${group.unit || ''}\` (slider, range ${group.min}-${group.max}, step ${group.step})`);
  } else if (group.kind === 'segmented' || group.kind === 'dropdown') {
    const opt = findOption(group, decisions[group.key]);
    const label = group.options.map(o => o.id === opt.id ? `[${o.id}]` : o.id).join(' | ');
    lines.push(`- \`${group.key}\` → \`${opt.value || opt.id}\` (segmented: ${label})`);
    const rejected = group.options.filter(o => o.id !== opt.id).map(o => `${o.id}(${o.value || o.id})`).join(', ');
    if (rejected) lines.push(`  - rejected: ${rejected}`);
  } else if (group.kind === 'toggle') {
    lines.push(`- \`${group.key}\` → \`${decisions[group.key]}\` (toggle)`);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 2200);
}
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showToast('Copied (fallback)');
  }
}

document.getElementById('export-btn').addEventListener('click', async () => {
  const md = buildExportMarkdown();
  if (md === null) {
    showToast('Nothing to export — change a decision, edit text, or add a comment first');
    return;
  }
  document.getElementById('export-pre').textContent = md;
  document.getElementById('export-modal').classList.add('open');
  await copyToClipboard(md);
});
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('export-modal').classList.remove('open');
});
document.getElementById('copy-again').addEventListener('click', async () => {
  await copyToClipboard(document.getElementById('export-pre').textContent);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  initDecisions();
  resetDirectEdits();
  untagAllComments();
  comments.length = 0;
  nextCommentId = 1;
  closeCommentPopover();
  setCommentMode(false);
  setMarkersVisible(false);
  document.getElementById('comment-list-panel').classList.remove('open');
  renderControls();
  applyAllDecisions();
  refreshMarkersAndList();
  showToast('Reset');
});

document.getElementById('toggle-controls-btn').addEventListener('click', () => {
  const layout = document.querySelector('.main-layout');
  const collapsed = layout.classList.toggle('controls-collapsed');
  const btn = document.getElementById('toggle-controls-btn');
  btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
  btn.title = collapsed ? 'Show controls panel' : 'Collapse controls panel';
  document.getElementById('toggle-controls-icon').textContent = collapsed ? '▶' : '◀';
  document.getElementById('toggle-controls-label').textContent = collapsed ? 'Show' : 'Collapse';
  if (collapsed && activeDropdown) closeActiveDropdown();
});

/* Pane expand/collapse — split / light-expanded / dark-expanded.
   Knob changes still apply to BOTH themes regardless of which pane is visible,
   because applyVariableToPreview() always writes to both lightEl() and darkEl(). */
const previewGrid = document.querySelector('.preview-grid');
function getPaneState() {
  if (previewGrid.classList.contains('light-expanded')) return 'light-expanded';
  if (previewGrid.classList.contains('dark-expanded')) return 'dark-expanded';
  return 'split';
}
function setPaneState(next) {
  previewGrid.classList.remove('light-expanded', 'dark-expanded');
  if (next === 'light-expanded') previewGrid.classList.add('light-expanded');
  if (next === 'dark-expanded') previewGrid.classList.add('dark-expanded');
  setTimeout(renderMarkers, 240);
}
document.querySelectorAll('.pane-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pane = btn.dataset.pane;
    const cur = getPaneState();
    if (pane === 'light') setPaneState(cur === 'split' ? 'light-expanded' : 'split');
    else                  setPaneState(cur === 'split' ? 'dark-expanded'  : 'split');
  });
});

renderControls();
applyAllDecisions();
initDirectEdits();
refreshCommentList();
