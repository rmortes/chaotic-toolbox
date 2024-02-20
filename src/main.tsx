import '@storylite/storylite/styles.css'
// import './styles/components.css'
// import './styles/storylite-overrides.css'

import { renderStoryLiteApp } from '@storylite/storylite'
import stories from '@storylite/vite-plugin:stories'

const rootElement = document.getElementById('app') as HTMLElement

renderStoryLiteApp(rootElement, stories, {
  title: ' ⚡️ Chaotic Toolbox',
  useIframeStyles: true,
})
