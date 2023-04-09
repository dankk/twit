import { useEffect, useState } from "react";

export function useScrollPosition(elementId: string) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const element = document.getElementById(elementId);

  function handleScroll() {
    if (!element) return;
    const height = element.scrollHeight - element.clientHeight;

    const windowScroll = element.scrollTop;

    const scrolled = (windowScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    if (!element) return;
    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [element]);

  return scrollPosition;
}
