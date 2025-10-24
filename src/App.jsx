import { Theme } from "@radix-ui/themes/dist/cjs/index.js";
import GymWorkoutApp from "./components/gym-workout-app";

const App = () => {
  return (
    <>
      <Theme
        accentColor='crimson'
        grayColor='sand'
        radius='large'
        scaling='95%'
      >
        <GymWorkoutApp />
      </Theme>
    </>
  );
};

export default App;
