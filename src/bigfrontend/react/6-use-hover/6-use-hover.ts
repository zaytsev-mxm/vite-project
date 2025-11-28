import { type Ref, useEffect, useState } from 'react';

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
  const [element, setElement] = useState<T | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const elementRef = (node: T) => {
    setElement(node);
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    element?.addEventListener('mouseenter', handleMouseEnter);
    element?.addEventListener('mouseleave', handleMouseLeave);

    return function cleanup() {
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [element]);

  return [elementRef, isHovered];
}
