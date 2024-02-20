# Chaotic Toolbox

For now this repo is a barren wasteland. Over time, I hope to add small webcomponents that I need to use in a daily basis and I'm tired of coding over and over again

## How to use?

For now, I'm using jsfiddle to include the components where I need them.

Example:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/rmortes/chaotic-toolbox/dist/mobile-like-scroller.js"></script>
<style>
  mobile-like-scroller {
    display: block;
  }

  mobile-like-scroller > div {
    display: flex;
    flex-wrap: nowrap;
  }

  mobile-like-scroller > div > div {
    width: 30vw;
    height: 30vw;
    flex-shrink: 0;
  }
</style>
<mobile-like-scroller data-direction="x">
  <div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </div>
</mobile-like-scroller>
```

Please don't use the same URL as I'm using in the example. At least [pin the URL to a commit](https://www.jsdelivr.com/?docs=gh), since I'm not sure if I'll just leave the dist file there or if I'll use a CDN.