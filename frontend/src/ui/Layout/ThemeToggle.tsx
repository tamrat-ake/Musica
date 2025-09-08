import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../styles/theme";
import Button from "../Common/Button";
import { BiMoon } from "react-icons/bi";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <BsFillSunFill /> : <BiMoon />}
    </Button>
  );
};

export default ThemeToggle;
