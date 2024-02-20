import { Story } from '@storylite/storylite'
import "../lib/components/mobile-like-scroller/main"
// import '../src/styles/components.css'

export default {
  title: 'Mobile-like Scroller',
  navigation: {
    icon: <span>📱</span>,
    hidden: false,
  },
  component: () => <mobile-like-scroller data-direction="x" style={{ display: "block", maxWidth: "50vw" }}>
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      <div style={{ width: "30vw", height: "30vw", backgroundColor: "red", flexShrink: 0 }}>1</div>
      <div style={{ width: "30vw", height: "30vw", backgroundColor: "blue", flexShrink: 0 }}>2</div>
      <div style={{ width: "30vw", height: "30vw", backgroundColor: "green", flexShrink: 0 }}>3</div>
      <div style={{ width: "30vw", height: "30vw", backgroundColor: "yellow", flexShrink: 0 }}>4</div>
      <div style={{ width: "30vw", height: "30vw", backgroundColor: "purple", flexShrink: 0 }}>5</div>
    </div>
  </mobile-like-scroller>,
} satisfies Story
