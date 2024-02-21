import { Story } from '@storylite/storylite'
import "../lib/components/mobile-like-scroller/main"
import './mobile-like-scroller-arrows.stories.scss'

export default {
  title: 'Mobile-like Scroller with Arrows',
  navigation: {
    icon: <span>📱</span>,
    hidden: false,
  },
  component: () => <>
    <mobile-like-scroller data-direction="x" style={{ display: "block", maxWidth: "50vw" }}>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <div style={{ width: "30vw", height: "30vw", backgroundColor: "red", flexShrink: 0 }}>1</div>
        <div style={{ width: "30vw", height: "30vw", backgroundColor: "blue", flexShrink: 0 }}>2</div>
        <div style={{ width: "30vw", height: "30vw", backgroundColor: "green", flexShrink: 0 }}>3</div>
        <div style={{ width: "30vw", height: "30vw", backgroundColor: "yellow", flexShrink: 0 }}>4</div>
        <div style={{ width: "30vw", height: "30vw", backgroundColor: "purple", flexShrink: 0 }}>5</div>
      </div>
      <div className="arrows_ui" data-ui>
        <button className="arrow left-arrow" data-scroll-axis="x" data-scroll-amount="-100">
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08725 9.8826L0.550781 9.34613L4.75314 5.131L0.550781 0.915866L1.08725 0.379395L5.85163 5.131L1.08725 9.8826Z"
              fill="#1C1B1F"
            />
          </svg>
        </button>
        <button className="arrow right-arrow" data-scroll-axis="x" data-scroll-amount="100">
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08725 9.8826L0.550781 9.34613L4.75314 5.131L0.550781 0.915866L1.08725 0.379395L5.85163 5.131L1.08725 9.8826Z"
              fill="#1C1B1F"
            />
          </svg>
        </button>
      </div>
    </mobile-like-scroller>,
  </>
} satisfies Story
