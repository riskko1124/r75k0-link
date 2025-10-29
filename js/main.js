const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const splash = document.getElementById('splash');
const page = document.querySelector('.page');
const linksContainer = document.getElementById('links-container');
const catWrapper = document.querySelector('.cat-wrapper');
const copyToast = document.getElementById('copy-toast');

const SPLASH_DURATION = prefersReducedMotion ? 400 : 2400;

function revealPage() {
  page.classList.add('show');
  splash.classList.add('hide');
  if (!prefersReducedMotion) {
    setTimeout(() => splash.remove(), 1000);
  }
}

async function loadLinks() {
  try {
    const response = await fetch('data/links.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Erro ao carregar links: ${response.status}`);
    }
    const links = await response.json();
    links.forEach((link) => {
      const element = createLinkElement(link);
      linksContainer.appendChild(element);
    });
  } catch (error) {
    console.error(error);
    const fallback = document.createElement('p');
    fallback.textContent = 'Não foi possível carregar os links agora.';
    fallback.classList.add('links-error');
    linksContainer.appendChild(fallback);
  }
}

function createLinkElement(linkData) {
  const isCopyAction = Object.prototype.hasOwnProperty.call(linkData, 'copy');
  const element = document.createElement(isCopyAction ? 'button' : 'a');
  element.className = 'link-button';

  if (isCopyAction) {
    element.type = 'button';
    element.dataset.copyValue = linkData.copy;
  } else {
    element.href = linkData.url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  }

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = linkData.label;
  element.appendChild(label);

  const interactionHandler = (event) => {
    if (isCopyAction) {
      event.preventDefault();
      handleCopyAction(element.dataset.copyValue || '');
    }
    triggerCatJump();
  };

  const pointerHandler = (event) => {
    createRipple(event);
  };

  element.addEventListener('click', interactionHandler);
  element.addEventListener('pointerdown', pointerHandler);
  element.addEventListener('keyup', (event) => {
    if ((event.code === 'Enter' || event.code === 'Space') && isCopyAction) {
      event.preventDefault();
      handleCopyAction(element.dataset.copyValue || '');
      triggerCatJump();
    }
  });

  return element;
}

function createRipple(event) {
  if (prefersReducedMotion) {
    return;
  }
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;

  let x = rect.width / 2;
  let y = rect.height / 2;
  if (event.clientX && event.clientY) {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }

  ripple.style.left = `${x - size / 2}px`;
  ripple.style.top = `${y - size / 2}px`;

  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

async function handleCopyAction(value) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      throw new Error('Clipboard API indisponível');
    }
  } catch (error) {
    fallbackCopy(value);
  } finally {
    showToast();
  }
}

function fallbackCopy(value) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showToast() {
  copyToast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    copyToast.classList.remove('show');
  }, 1500);
}

function triggerCatJump() {
  if (!catWrapper || prefersReducedMotion) {
    return;
  }
  catWrapper.classList.remove('jump');
  // force reflow
  void catWrapper.offsetWidth;
  catWrapper.classList.add('jump');
  clearTimeout(triggerCatJump.timeoutId);
  triggerCatJump.timeoutId = setTimeout(() => {
    catWrapper.classList.remove('jump');
  }, 600);
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealPage, SPLASH_DURATION);
  loadLinks();
});
