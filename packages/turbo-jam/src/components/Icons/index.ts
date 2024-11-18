export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: number | string;
    height?: number | string;
    className?: string
}

export { default as CircleIcon } from './Circle';
export { default as SquareIcon } from './Square';
export { default as FreeDrawIcon } from './FreeDraw';
export { default as LineDrawIcon } from './Line';
export { default as TextIcon } from './Text';
export { default as CollapseIcon } from './Collapse';
export { default as CursorIcon } from './Cursor';