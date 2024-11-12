import { IconProps } from ".";

interface CollapseProps extends IconProps {
    collapsed: boolean
}

const CollapseIcon: React.FC<CollapseProps> = ({ collapsed, width = "24", height = "24", ...props }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        stroke="currentColor"
    >
        {collapsed ? 
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l7 7 7-7" />
        :
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 19l-7-7-7 7" /> 
        }
    </svg>
);

export default CollapseIcon;