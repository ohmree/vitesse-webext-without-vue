import 'vite/client';

import { sendMessage, onMessage } from 'webext-bridge';
import { Tabs } from 'webextension-polyfill';

// Only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  // eslint-disable-next-line import/no-absolute-path
  import('/@vite/client');
  // Load latest content script
  import('./content-script-hmr');
}

browser.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed');
});

let previousTabId = 0;

// Communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }: { tabId: number }) => {
  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }

  console.log('previous tab', tab);
  void sendMessage(
    'tab-prev',
    { title: tab.title },
    { context: 'content-script', tabId },
  );
});

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId);
    return {
      title: tab?.title,
    };
  } catch {
    return {
      title: undefined,
    };
  }
});
