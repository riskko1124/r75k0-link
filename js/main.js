const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const splash = document.getElementById('splash');
const page = document.querySelector('.page');
const linksContainer = document.getElementById('links-container');
const catWrapper = document.querySelector('.cat-wrapper');
const copyToast = document.getElementById('copy-toast');
const overlay = document.getElementById('modal-overlay');
const titleEl = document.getElementById('modal-title');
const contentEl = document.getElementById('modal-content');
const closeEl = document.getElementById('modal-close');

const SPLASH_DURATION = prefersReducedMotion ? 400 : 2400;

function openModal(title, content) {
  if (!overlay || !titleEl || !contentEl) {
    return;
  }
  titleEl.textContent = title;
  contentEl.textContent = content;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!overlay) {
    return;
  }
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
}

if (closeEl) {
  closeEl.addEventListener('click', closeModal);
}

if (overlay) {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

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
  const isModalAction = linkData.type === 'modal';
  const element = document.createElement(isCopyAction || isModalAction ? 'button' : 'a');
  element.className = 'link-button';

  if (isCopyAction || isModalAction) {
    element.type = 'button';
    if (isCopyAction) {
      element.dataset.copyValue = linkData.copy;
    }
  } else {
    element.href = linkData.url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  }

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = linkData.label;
  element.appendChild(label);

  let catContainer = null;
  if (linkData.cat) {
    catContainer = document.createElement('div');
    catContainer.className = 'btn-with-cat';
    const catImage = document.createElement('img');
    catImage.className = 'cat-on-button';
    catImage.src = 'https://i.imgur.com/25ssfgl.png';
    catImage.alt = 'Mascote';
    catContainer.appendChild(catImage);
    catContainer.appendChild(element);
  }

  const bounceCatOnButton = () => {
    if (!catContainer) {
      return;
    }
    catContainer.classList.add('is-clicking');
    clearTimeout(catContainer._catTimeoutId);
    catContainer._catTimeoutId = setTimeout(() => {
      catContainer.classList.remove('is-clicking');
    }, 220);
  };

  const activate = () => {
    if (isCopyAction) {
      handleCopyAction(element.dataset.copyValue || '');
    } else if (isModalAction) {
      openModal(linkData.label, linkData.content || '');
    }
    triggerCatJump();
    bounceCatOnButton();
  };

  const pointerHandler = (event) => {
    createRipple(event);
  };

  element.addEventListener('click', (event) => {
    if (isCopyAction || isModalAction) {
      event.preventDefault();
      activate();
    } else {
      triggerCatJump();
      bounceCatOnButton();
    }
  });
  element.addEventListener('pointerdown', pointerHandler);
  element.addEventListener('keyup', (event) => {
    if ((event.code === 'Enter' || event.code === 'Space') && (isCopyAction || isModalAction)) {
      event.preventDefault();
      activate();
    }
  });

  return catContainer || element;
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
