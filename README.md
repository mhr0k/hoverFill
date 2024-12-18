# HoverFill

## Overview

`HoverFill` is a versatile React wrapper component that creates an interactive, animated hover fill effect. It uses GSAP (GreenSock Animation Platform) to create smooth, directional sliding animations that respond to mouse interactions.

![HoverFill Showcase](https://github.com/mhr0k/hoverFill/blob/master/showcase.gif?raw=true)

## Props

| Prop               | Type                                  | Default                          | Description                                          |
| ------------------ | ------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `as`               | `ElementType`                         | `'div'`                          | The component type to render as                      |
| `fillColor`        | `string`                              | `'white'`                        | Color of the SVG fill effect                         |
| `fillOpacity`      | `number`                              | `1`                              | Opacity of the SVG fill effect                       |
| `fillDuration`     | `number`                              | `0.5`                            | Animation duration in seconds                        |
| `fillPin`          | `boolean`                             | `false`                          | Fills the element and stops the animation            |
| `fillInvertColors` | `boolean`                             | `false`                          | Invert the colors behind the SVG using blend mode    |
| `fillOnTab`        | `boolean`                             | `false`                          | Animate tab navigation (must be a tabbable element)  |
| `fillTabEnter`     | `'up' \| 'down' \| 'left' \| 'right'` | `'up'`                           | Animation direction for focus on tab                 |
| `fillTabLeave`     | `'up' \| 'down' \| 'left' \| 'right'` | `'down'`                         | Animation direction for blur on tab                  |
| `fillInvert`       | `boolean`                             | `false`                          | Invert the animation direction for mouse enter/leave |
| `fillZ`            | `'auto' \| number`                    | `fillInvertColors ? 'auto' : -1` | The z-index of the SVG overlay                       |

## Usage Example

```tsx
import HoverFill from '@/components/HoverFill';

function MyComponent() {
  return (
    <HoverFill
      as="button"
      fillInvertColors={true}
      style={{ position: 'relative' }} // Important for SVG positioning
    >
      Hover me
    </HoverFill>
  );
}
```

## Important Notes

- `HoverFill` must have a `position` value of `relative`, `absolute`, or `fixed` for the SVG overlay to correctly fill the element.
- The component supports both mouse and keyboard (tab) interactions.

## How It Works

The `HoverFill` component creates an SVG overlay that animates dynamically based on the mouse enter and leave directions. Key features include:

- Detects the direction of mouse entry/exit
- Uses sophisticated path animations for fluid sliding effects
- Supports customizable fill color, opacity, and animation duration
- Can pin the fill state or allow dynamic interactions
- Provides tab navigation animation support

## Key Features

- Wrapper component that can be applied to any React element
- Supports forwarding refs
- Highly customizable animation parameters
- Performance-optimized with GSAP and React hooks
- Supports both mouse and keyboard interactions

## Dependencies

- React
- GSAP
- @gsap/react

## License

MIT License
