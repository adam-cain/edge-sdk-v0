export const shapeTypes = ['freehand', 'rectangle', 'circle', 'line', 'text'] as const;

export const toolTypes = [...shapeTypes, 'select'] as const;
