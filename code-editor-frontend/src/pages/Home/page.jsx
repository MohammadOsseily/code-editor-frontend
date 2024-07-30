import Navebar from "../../components/Navbar";
import "./styles.css";

const Home = () => {
  return (
    <div className="bg-accent h-screen">
      <div className="flex flex-row pt-20">
        <div className="card bg-neutral ml-3 w-[49%] shadow-xl h-96">
          <figure></figure>
          <div className="card-body">
            <h2 className="card-title text-primary">Shoes!</h2>
            <p className="text-primary">
              If a dog chews shoes whose shoes does he choose?
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary ">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="card bg-neutral mr-3 ml-10 w-[49%] shadow-xl">
          <figure></figure>
          <div className="card-body">
            <h2 className="card-title text-primary">Shoes!</h2>
            <p className="text-primary">
              If a dog chews shoes whose shoes does he choose?
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
