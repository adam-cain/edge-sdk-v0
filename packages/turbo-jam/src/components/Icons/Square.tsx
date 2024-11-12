import { IconProps } from ".";

const SquareIcon: React.FC<IconProps> = ({ width = "24", height = "24", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    stroke="currentColor"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SquareIcon;
