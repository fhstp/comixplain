const toggles = document.querySelectorAll('.collapsible');
const checkboxes = document.querySelectorAll('.progress-check');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-value');

function toggleCollapsible(button) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  const content = button.parentElement.nextElementSibling;

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

function updateProgress() {
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
  const progress = Math.round((checked / total) * 100);

  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${progress}%`;
}

toggles.forEach(button => {
  button.addEventListener('click', () => toggleCollapsible(button));
});

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateProgress);
});

document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
});