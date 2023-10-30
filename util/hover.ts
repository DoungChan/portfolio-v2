export function addHoverListener(element: HTMLElement): boolean {
  let isHovered = false;

  element.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  element.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  return isHovered;
}
