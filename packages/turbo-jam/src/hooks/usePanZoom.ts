import { useState, useRef, useEffect } from "react";

export function usePanZoom(boardRef: React.RefObject<HTMLDivElement>) {
  // Pan and Zoom State
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Touch Pan and Zoom State
  const [isPinching, setIsPinching] = useState(false);
  const lastTouchDistanceRef = useRef<number | null>(null);
  const lastTouchMidpointRef = useRef<{ x: number; y: number } | null>(null);

  // Handle Keyboard Events for Panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isSpacePressed) {
      setIsPanning(true);
      panStartRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      const deltaX = event.clientX - panStartRef.current!.x;
      const deltaY = event.clientY - panStartRef.current!.y;
      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      panStartRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      setIsPinching(true);
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistanceRef.current = distance;
      const midpoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
      lastTouchMidpointRef.current = midpoint;
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isPinching && event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const currentMidpoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };

      const scaleChange = currentDistance / lastTouchDistanceRef.current!;
      const newScale = scale * scaleChange;

      // Limit scale
      const limitedNewScale = Math.max(0.1, Math.min(newScale, 10));

      // Adjust panOffset to keep midpoint stationary
      const rect = boardRef.current?.getBoundingClientRect();
      if (rect) {
        const prevScale = scale;

        const clientX = currentMidpoint.x - rect.left;
        const clientY = currentMidpoint.y - rect.top;

        const originX = (clientX - panOffset.x) / prevScale;
        const originY = (clientY - panOffset.y) / prevScale;

        const newPanOffsetX = clientX - originX * limitedNewScale;
        const newPanOffsetY = clientY - originY * limitedNewScale;

        // Update panOffset based on movement of the midpoint
        const deltaX = currentMidpoint.x - lastTouchMidpointRef.current!.x;
        const deltaY = currentMidpoint.y - lastTouchMidpointRef.current!.y;

        setPanOffset(() => ({
          x: newPanOffsetX + deltaX,
          y: newPanOffsetY + deltaY,
        }));
        setScale(limitedNewScale);
      } else {
        setScale(limitedNewScale);
      }

      // Update last distance and midpoint
      lastTouchDistanceRef.current = currentDistance;
      lastTouchMidpointRef.current = currentMidpoint;
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) {
      setIsPinching(false);
      lastTouchDistanceRef.current = null;
      lastTouchMidpointRef.current = null;
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const delta = -event.deltaY;

    // Adjust scale
    const zoomFactor = 1.1;
    let newScale = scale;

    if (delta > 0) {
      // Zoom in
      newScale *= zoomFactor;
    } else if (delta < 0) {
      // Zoom out
      newScale /= zoomFactor;
    }

    // Limit scale
    newScale = Math.max(0.1, Math.min(newScale, 10));

    // To keep the point under the cursor stationary, adjust panOffset accordingly
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const prevScale = scale;

      const originX = (clientX - panOffset.x) / prevScale;
      const originY = (clientY - panOffset.y) / prevScale;

      const newPanOffsetX = clientX - originX * newScale;
      const newPanOffsetY = clientY - originY * newScale;

      setScale(newScale);
      setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
    } else {
      setScale(newScale);
    }
  };

  return {
    panOffset,
    scale,
    isPanning,
    isPinching,
    isSpacePressed,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  };
}
