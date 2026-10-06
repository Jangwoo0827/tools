import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'Dev Tools',
  version: '0.1.0',
  description: '개인용 개발자 도구 모음',
  icons: { '16': 'icon-16.png', '48': 'icon-48.png', '128': 'icon-128.png' },
  action: {
    default_title: 'Dev Tools',
    default_popup: 'src/popup/index.html',
    default_icon: { '16': 'icon-16.png', '48': 'icon-48.png' },
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  permissions: ['activeTab', 'scripting', 'cookies', 'storage', 'clipboardWrite'],
  host_permissions: ['<all_urls>'],
})
