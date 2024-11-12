import { IconProps } from ".";

const LineDrawIcon: React.FC<IconProps> = ({ width = "24", height = "24", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    stroke="currentColor"
  >
    <path
      d="M17.13,22.5H9.87a2,2,0,1,1,0-4.05h1.86L5.06,11.78a2,2,0,0,1-.19-2.65A1.92,1.92,0,0,1,7.68,9l4.05,4.05L15.81,10a1.9,1.9,0,0,1,2.49.18h0a17.3,17.3,0,0,1,4.17,6.74l.06.19"
      
      fill="none"
      strokeWidth="1.91"
      strokeMiterlimit="10"
    />
    <path
      d="M13,1.5H8.25A1.91,1.91,0,0,0,6.34,3.41h0A1.92,1.92,0,0,0,8.25,5.32h2.86A1.9,1.9,0,0,1,13,7.23h0a1.91,1.91,0,0,1-1.91,1.91H8.29"
      
      fill="none"
      strokeWidth="1.91"
      strokeMiterlimit="10"
    />
  </svg>
);

export default LineDrawIcon;
