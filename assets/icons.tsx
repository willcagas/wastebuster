import { Ionicons, FontAwesome5, FontAwesome6, FontAwesome } from "@expo/vector-icons";

interface IconProps {
  color?: string;
  size?: number;
  [key: string]: any;
}

type IconsType = {
  [key: string]: (props: IconProps) => JSX.Element;
}

export const icons: IconsType = {
  index: (props: IconProps) => <FontAwesome6 name="binoculars" size={26} {...props} />,
  events: (props: IconProps) => <Ionicons name="earth" size={26} {...props} />,
  redesign: (props: IconProps) => <FontAwesome5 name="lightbulb" size={26} {...props} />,
  more: (props: IconProps) => <FontAwesome name="leaf" size={26} {...props} />,
}