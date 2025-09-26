const toggles = document.querySelectorAll('.collapsible');
const checkboxes = document.querySelectorAll('.progress-check');
const complianceRate = document.getElementById('compliance-rate')
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-value');
const onlineBtn = document.getElementById('online-tab');
const offlineBtn = document.getElementById('offline-tab');
const onlineWrap = document.getElementById('online-version');
const pdfWrap = document.getElementById('pdf-version');


function toggleCollapsible(button) {
  const content = button.nextElementSibling;
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isExpanded));
  content.hidden = isExpanded;

  
  if (isExpanded) {
    button.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    content.style.display = 'none';
  } else {
    button.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    content.style.display = 'block';
  }
}

function initCollapsibles() {
  document.querySelectorAll('.collapsible').forEach((btn, i) => {
    const panel = btn.nextElementSibling;
    const id = panel.id || `collapsible-panel-${i}`;
    panel.id = id;
    btn.setAttribute('aria-controls', id);
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btn.id || (btn.id = `collapsible-btn-${i}`));
    if (btn.getAttribute('aria-expanded') !== 'true') {
      panel.hidden = true;
    }
  });
}

function updateProgress() {
  const all = Array.from(document.querySelectorAll('.progress-check'));
  const active = all.filter(cb => !cb.disabled);
  const total = active.length;
  const checked = active.filter(cb => cb.checked).length;
  const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${progress}%`;

  document.getElementById('progress-bar').setAttribute('aria-valuenow', String(progress));
  
  if (progress !== 100) {
    const compliance = document.getElementById('compliance-rate');
    compliance.style.backgroundImage = '';
    compliance.style.color = 'var(--text)';
    compliance.style.backgroundClip = '';
  } else {
    const compliance = document.getElementById('compliance-rate');
    compliance.style.backgroundImage = 'var(--gradient)';
    compliance.style.color = 'transparent';
    compliance.style.backgroundClip = 'text';
  }
}

toggles.forEach(button => {
  button.addEventListener('click', () => toggleCollapsible(button));
});

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateProgress);
});

function setStickyOffsets() {
  const tabs = document.getElementById('tabs');
  const h = tabs ? tabs.offsetHeight : 0;
  document.documentElement.style.setProperty('--tabs-height', `${h}px`);
}

window.addEventListener('resize', setStickyOffsets);
document.addEventListener('DOMContentLoaded', setStickyOffsets);
if ('fonts' in document && document.fonts?.ready) {
  document.fonts.ready.then(setStickyOffsets);
}


function sizePdfEmbed() {
  if (!document.body.classList.contains('pdf-active')) return;

  const banner = document.getElementById('banner');
  const tabs = document.getElementById('tabs');
  const downloadButton = document.getElementById('download-button');
  const footer = document.getElementById('footer');
  const pdfWrap = document.getElementById('pdf-version');
  const linkRow = pdfWrap.querySelector(':scope > div:first-child');

  const vh = window.innerHeight;
  const bannerH = banner ? banner.offsetHeight : 0;
  const tabsH = tabs ? tabs.offsetHeight : 0;
  const downloadButtonH = downloadButton ? downloadButton.offsetHeight : 0;
  const footerH = footer ? footer.offsetHeight : 0;
  const linkH = linkRow ? linkRow.offsetHeight : 0;
  const gaps = 12 + 12;

  const available = Math.max(200, vh - bannerH - tabsH - downloadButtonH - footerH - linkH - gaps);
  document.documentElement.style.setProperty('--pdf-embed-h', `${available}px`);
}

window.addEventListener('resize', sizePdfEmbed);

activateTab = function(which) {
  const isOnline = which === 'online';
  const onlineTab = document.getElementById('online-tab');
  const offlineTab = document.getElementById('offline-tab');

  document.querySelectorAll('#tablist > div').forEach(div => div.classList.remove('active'));

  if (isOnline) {
    document.body.classList.remove('pdf-active');
    onlineTab.parentElement.classList.add('active');
    onlineTab.setAttribute('aria-selected', 'true');
    offlineTab.setAttribute('aria-selected', 'false');

    document.getElementById('online-version').hidden = false;
    document.getElementById('pdf-version').hidden = true;
  } else {
    document.body.classList.add('pdf-active');
    offlineTab.parentElement.classList.add('active');
    offlineTab.setAttribute('aria-selected', 'true');
    onlineTab.setAttribute('aria-selected', 'false');

    document.getElementById('online-version').hidden = true;
    document.getElementById('pdf-version').hidden = false;
    sizePdfEmbed();
  }

  if (typeof setStickyOffsets === 'function') setStickyOffsets();
};

onlineBtn.addEventListener('click', () => activateTab('online'));
offlineBtn.addEventListener('click', () => activateTab('offline'));

document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  activateTab('online')
});

function labelGuidelineCheckboxes() {
  document.querySelectorAll('.guideline-grid').forEach((row, i) => {
    const cb = row.querySelector('input.progress-check');
    const btn = row.querySelector('button.collapsible');
    if (cb && btn) {
      const title = btn.firstChild?.textContent?.trim() || `Guideline ${i+1}`;
      cb.setAttribute('aria-label', `Mark guideline "${title}" as complied with`);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCollapsibles();
  labelGuidelineCheckboxes();
});
