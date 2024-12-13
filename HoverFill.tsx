import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface UseHoverFillProps {
  /**
   * Color of the hover fill effect. Defaults to 'white'.
   */
  color?: string;
  /**
   * Opacity of the hover fill effect. Defaults to 1.
   */
  opacity?: number;
  /**
   * Duration of the animation in seconds. Defaults to 0.5.
   */
  duration?: number;
  /**
   * If set true, fills the parent element and stops the animation.
   */
  pinned?: boolean;
  /**
   * Invert the colors behind the SVG using blend mode
   */
  invert?: boolean;
  /**
   * Z-index value for the hover fill SVG element. Defaults to -1.
   */
  z?: number | 'auto';
}

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

export default function HoverFill({
  color = 'white',
  opacity = 1,
  duration = 0.5,
  pinned = false,
  invert = false,
  z = 'auto',
}: UseHoverFillProps) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const hovered = useRef(false);

  const vbCenter = `0 0 100 100`;
  const vbTop = '0 101 100 100';
  const vbBottom = '0 -101 100 100';
  const vbLeft = '101 0 100 100';
  const vbRight = '-101 0 100 100';
  const vbInit = pinned ? vbCenter : hovered.current ? vbCenter : vbTop;

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

  useEffect(() => {
    if (!svgRef.current || !pathRef.current) return;

    const parent = (svgRef.current as SVGSVGElement).parentElement;
    if (!parent) return;

    const handleMouseEnter = (e: MouseEvent) => {
      if (hovered.current) return;
      hovered.current = true;
      if (pinned) return;
      const mouseDirection = getMouseEnterDirection(e, e.target as HTMLElement);
      if (mouseDirection === 'bottom') slideUpIn();
      else if (mouseDirection === 'top') slideDownIn();
      else if (mouseDirection === 'left') slideLeftIn();
      else if (mouseDirection === 'right') slideRightIn();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (!hovered.current) return;
      hovered.current = false;
      if (pinned) return;
      const mouseDirection = getMouseEnterDirection(e, e.target as HTMLElement);
      if (mouseDirection === 'bottom') slideDownOut();
      else if (mouseDirection === 'top') slideUpOut();
      else if (mouseDirection === 'left') slideLeftOut();
      else if (mouseDirection === 'right') slideRightOut();
    };

    const svg = svgRef.current;
    const path = pathRef.current;

    const animation = (vbFrom: string, vbTo: string, drawPath: string) => {
      const tl = gsap.timeline({
        defaults: { duration: duration, ease: 'power2.out' },
      });
      tl.set(svg, { attr: { viewBox: vbFrom } });
      tl.set(path, { attr: { d: squarePath } });

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

    parent.addEventListener('mouseenter', handleMouseEnter);
    parent.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      parent.removeEventListener('mouseenter', handleMouseEnter);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pinned]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={vbInit}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        fill: color,
        fillOpacity: String(opacity),
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        pointerEvents: 'none',
        zIndex: z,
        mixBlendMode: invert ? 'difference' : 'normal',
      }}
    >
      <path ref={pathRef} d={squarePath}></path>
    </svg>
  );
}
