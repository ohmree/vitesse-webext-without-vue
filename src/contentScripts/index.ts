import { onMessage } from 'webext-bridge';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[my-webext] Hello world from content script');

  // Communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    if (data.title) {
      console.log(`[my-webext] Navigate from page "${data.title}"`);
    } else {
      console.log('[my-webext] Navigate from a page without a title');
    }
  });

  // Mount component to context window
  const container = document.createElement('div');
  const root = document.createElement('div');
  const styleElement = document.createElement('link');
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) ||
    container;
  styleElement.setAttribute('rel', 'stylesheet');
  styleElement.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css'),
  );
  shadowDOM.append(styleElement);
  shadowDOM.append(root);
  document.body.append(container);
})();
