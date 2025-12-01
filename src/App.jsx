import { Theme } from "@radix-ui/themes";
import AppRoutes from "./routes.jsx";

const App = () => {
  return (
    <Theme accentColor='crimson' grayColor='sand' radius='large' scaling='95%'>
      <AppRoutes />
    </Theme>
  );
};

export default App;
