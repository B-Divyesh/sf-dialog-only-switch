const routeFocusKey = 'dialog-only-switch:route-focus';

function focusRouteHeading() {
  const heading = document.querySelector('h1');
  if (!(heading instanceof HTMLElement)) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  let announcer = document.querySelector('#route-announcer');
  if (!(announcer instanceof HTMLElement)) {
    announcer = document.createElement('div');
    announcer.id = 'route-announcer';
    announcer.className = 'visually-hidden';
    announcer.setAttribute('aria-live', 'polite');
    document.body.append(announcer);
  }
  announcer.textContent = `Page loaded: ${heading.textContent?.trim() ?? document.title}`;
}

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(link instanceof HTMLAnchorElement) || link.origin !== location.origin || link.target || link.hasAttribute('download')) return;
  sessionStorage.setItem(routeFocusKey, '2');
});

window.addEventListener('pageshow', (event) => {
  const remaining = Number(sessionStorage.getItem(routeFocusKey) ?? 0);
  if (remaining < 1 && !event.persisted) return;
  if (remaining > 1) sessionStorage.setItem(routeFocusKey, String(remaining - 1));
  else sessionStorage.removeItem(routeFocusKey);
  requestAnimationFrame(focusRouteHeading);
});
