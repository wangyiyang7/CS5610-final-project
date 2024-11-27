import HomeComponent from "../components/Home.js";
import addItemToCart from "../functions.js";

const Home = () => {
  return (
    <div>
      <HomeComponent func={addItemToCart} />
    </div>
  );
};

export default Home;
