import {
  ElementType,
  ComponentPropsWithoutRef,
  useRef,
  forwardRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Determine which edge of an element a mouse event entered (or left) from
 *
 * @param {MouseEvent} e - The mouse event
 * @param {HTMLElement} el - The element to check
 * @returns {string} The edge of the element the mouse entered from (top, bottom, left, right)
 */
const getMouseEnterDirection = (e: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  let topEdgeDistance = Math.abs(rect.top - e.clientY);
  let bottomEdgeDistance = Math.abs(rect.bottom - e.clientY);
  let leftEdgeDistance = Math.abs(rect.left - e.clientX);
  let rightEdgeDistance = Math.abs(rect.right - e.clientX);

  const min = Math.min(
    topEdgeDistance,
    bottomEdgeDistance,
    leftEdgeDistance,
    rightEdgeDistance
  );

  switch (min) {
    case topEdgeDistance:
      return 'top';
    case bottomEdgeDistance:
      return 'bottom';
    case leftEdgeDistance:
      return 'left';
    case rightEdgeDistance:
      return 'right';
  }
};

interface HoverFillProps<T extends ElementType> {
  /**
   * The component type to render as (defaults to 'div')
   */
  as?: T;
  /**
   * The content to render inside the HoverFill
   */
  children?: React.ReactNode;
  /**
   * Color of the svg fill. Defaults to 'white'.
   */
  fillColor?: string;
  /**
   * Opacity of the svg fill. Defaults to 1.
   */
  fillOpacity?: number;
  /**
   * Duration of the animation in seconds. Defaults to 0.5.
   */
  fillDuration?: number;
  /**
   * If true, fills the element and stops the animation.
   */
  fillPin?: boolean;
  /**
   * Invert the colors behind the SVG using blend mode.
   */
  fillInvertColors?: boolean;
  /**
   * Animate tab navigation. (Must be tabbable element)
   */
  fillOnTab?: boolean;
  /**
   * Animation direction for focus on tab
   */
  fillTabEnter?: 'up' | 'down' | 'left' | 'right';
  /**
   * Animation direction for blur on tab
   */
  fillTabLeave?: 'up' | 'down' | 'left' | 'right';
  /**
   * Invert the animation direction for mouse enter/leave
   */
  fillInvert?: boolean;
  /**
   * The z-index of the svg.
   */
  fillZ?: 'auto' | number;
}

const HoverFill = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      children,
      fillColor = 'white',
      fillOpacity = 1,
      fillDuration = 0.5,
      fillPin = false,
      fillInvertColors = false,
      fillOnTab = false,
      fillTabEnter = 'up',
      fillTabLeave = 'down',
      fillInvert = false,
      fillZ = fillInvertColors ? 'auto' : -1,
      ...props
    }: HoverFillProps<T> & ComponentPropsWithoutRef<T>,
    forwardedRef: React.ForwardedRef<HTMLElement>
  ) => {
    const Component = (as || 'div') as ElementType;

    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const containerRef = useRef<HTMLElement | null>(null);
    const [isFilled, setIsFilled] = useState(false);

    const syncForwardedRef = (el: HTMLElement) => {
      if (!el) return;
      containerRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    const vbCenter = `0 0 100 100`;
    const vbTop = '0 101 100 100';
    const vbBottom = '0 -101 100 100';
    const vbLeft = '101 0 100 100';
    const vbRight = '-101 0 100 100';

    const squarePath = `M 0 0 Q 50 0 100 0 Q 100 50 100 100 Q 50 100 0 100 Q 0 50 0 0`;
    const concaveTopPath = `M 0 0 Q 50 50 100 0 Q 100 50 100 100 Q 50 100 0 100 Q 0 50 0 0`;
    const concaveRightPath = `M 0 0 Q 50 0 100 0 Q 50 50 100 100 Q 50 100 0 100 Q 0 50 0 0`;
    const concaveBottomPath = `M 0 0 Q 50 0 100 0 Q 100 50 100 100 Q 50 50 0 100 Q 0 50 0 0`;
    const concaveLeftPath = `M 0 0 Q 50 0 100 0 Q 100 50 100 100 Q 50 100 0 100 Q 50 50 0 0`;
    const convexTopPath =
      'M 0 0 Q 50 -50 100 0 Q 100 50 100 100 Q 50 100 0 100 Q 0 50 0 0';
    const convexBottomPath =
      'M 0 0 Q 50 0 100 0 Q 100 50 100 100 Q 50 150 0 100 Q 0 50 0 0';
    const convexLeftPath = `M 0 0 Q 50 0 100 0 Q 100 50 100 100 Q 50 100 0 100 Q -50 50 0 0`;
    const convexRightPath = `M 0 0 Q 50 0 100 0 Q 150 50 100 100 Q 50 100 0 100 Q 0 50 0 0`;

    const animation = (vbFrom: string, vbTo: string, drawPath: string) => {
      const svg = svgRef.current;
      const path = pathRef.current;
      const tl = gsap.timeline({
        defaults: { duration: fillDuration, ease: 'power2.out' },
      });
      tl.set(svg, { attr: { viewBox: vbFrom } });

      tl.to(
        svg,
        {
          attr: {
            viewBox: vbTo,
          },
        },
        0
      );
      tl.to(
        path,
        {
          attr: {
            d: drawPath,
          },
        },
        0
      ).to(
        path,
        {
          attr: {
            d: squarePath,
          },
        },
        '-=70%'
      );
    };

    const slideDownOut = () => {
      animation(vbCenter, vbBottom, concaveTopPath);
    };

    const slideUpIn = () => {
      animation(vbBottom, vbCenter, convexTopPath);
    };

    const slideUpOut = () => {
      animation(vbCenter, vbTop, concaveBottomPath);
    };

    const slideDownIn = () => {
      animation(vbTop, vbCenter, convexBottomPath);
    };

    const slideLeftIn = () => {
      animation(vbLeft, vbCenter, convexRightPath);
    };

    const slideRightIn = () => {
      animation(vbRight, vbCenter, convexLeftPath);
    };

    const slideLeftOut = () => {
      animation(vbCenter, vbLeft, concaveRightPath);
    };

    const slideRightOut = () => {
      animation(vbCenter, vbRight, concaveLeftPath);
    };

    const { contextSafe } = useGSAP(() => {
      gsap.set(svgRef.current, {
        attr: { viewBox: fillPin ? vbCenter : vbTop },
      });
      gsap.set(pathRef.current, { attr: { d: squarePath } });
    });

    const handleMouseEnter = contextSafe((e: MouseEvent) => {
      if (isFilled) return;
      setIsFilled(true);
      if (fillPin) return;
      const mouseDirection = getMouseEnterDirection(e, e.target as HTMLElement);
      if (mouseDirection === 'bottom') fillInvert ? slideDownIn() : slideUpIn();
      else if (mouseDirection === 'top')
        fillInvert ? slideUpIn() : slideDownIn();
      else if (mouseDirection === 'left')
        fillInvert ? slideRightIn() : slideLeftIn();
      else fillInvert ? slideLeftIn() : slideRightIn();
    });

    const handleMouseLeave = contextSafe((e: MouseEvent) => {
      if (!isFilled) return;
      setIsFilled(false);
      if (fillPin) return;
      const mouseDirection = getMouseEnterDirection(e, e.target as HTMLElement);
      if (mouseDirection === 'bottom')
        fillInvert ? slideUpOut() : slideDownOut();
      else if (mouseDirection === 'top')
        fillInvert ? slideDownOut() : slideUpOut();
      else if (mouseDirection === 'left')
        fillInvert ? slideLeftOut() : slideLeftOut();
      else fillInvert ? slideLeftOut() : slideRightOut();
    });

    const handleFocus = contextSafe(() => {
      if (isFilled) return;
      setIsFilled(true);
      if (fillPin) return;
      slideUpIn();
    });

    const handleBlur = contextSafe(() => {
      if (!isFilled) return;
      setIsFilled(false);
      if (fillPin) return;
      slideDownOut();
    });

    return (
      <Component
        ref={syncForwardedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(fillOnTab ? { onFocus: handleFocus, onBlur: handleBlur } : {})}
        {...props}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 0 0"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            fill: fillColor,
            fillOpacity: String(fillOpacity),
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            pointerEvents: 'none',
            mixBlendMode: fillInvertColors ? 'difference' : 'normal',
            zIndex: fillZ,
          }}
        >
          <path ref={pathRef}></path>
        </svg>
        {children}
      </Component>
    );
  }
);

export default HoverFill;
