import { useState, useEffect } from "react";
import { breakpoints } from "@/components/store/layout/categories-header/offer-tags-links/breakpoints";

function getCurrentBreakpointValue() {
  let currentValue = 1; // default fallback
  for (const bp of breakpoints) {
    // If this breakpoint matches, update currentValue
    if (typeof window !== "undefined" && window.matchMedia(bp.query).matches) {
      currentValue = bp.value;
    }
  }
  return currentValue;
}

/**
 * Custom hook to get numeric "value" of current breakpoint.
 */
export function useBreakpointValue() {
  const [value, setValue] = useState<number>(() => getCurrentBreakpointValue());

  useEffect(() => {
    function handleResize() {
      setValue(getCurrentBreakpointValue());
    }

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return value;
}
