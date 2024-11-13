import { shapeTypes } from "./shapes";

export const toolTypes = [...shapeTypes, 'select'] as const;
export type ToolType = typeof toolTypes[number];