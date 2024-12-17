## Overview

`HoverFill` is a versatile React component that adds an interactive, animated hover fill effect to any element. It uses GSAP (GreenSock Animation Platform) to create smooth, directional sliding animations that respond to mouse interactions.

![](https://github.com/mhr0k/hoverFill/blob/master/showcase.gif?raw=true)

## Props

| Prop       | Type               | Default   | Description                                   |
| ---------- | ------------------ | --------- | --------------------------------------------- |
| `color`    | `string`           | `'white'` | Color of the hover fill effect                |
| `opacity`  | `number`           | `1`       | Opacity of the hover fill effect              |
| `duration` | `number`           | `0.5`     | Animation duration in seconds                 |
| `pinned`   | `boolean`          | `false`   | Fills the parent element and stops animation  |
| `invert`   | `boolean`          | `false`   | Invert colors behind the SVG using blend mode |
| `z`        | `number \| 'auto'` | `'auto'`  | Z-index for the hover fill SVG                |

## Usage Example

```tsx
import HoverFill from '@/components/HoverFill';

function MyComponent() {
  return (
    <div style={{ position: 'relative' }}>
      <button>Hover me</button>
      <HoverFill invert={true} />
    </div>
  );
}
```

## How It Works

The `HoverFill` component creates an SVG overlay that animates dynamically based on the mouse enter and leave directions. It uses path animations to create a fluid sliding effect.

## Dependencies

- React
- GSAP
- @gsap/react

## Performance Notes

- Utilizes `useRef` for efficient DOM manipulation
- Lightweight and performant animation using GSAP
- Minimal DOM event listeners

## License

MIT License
