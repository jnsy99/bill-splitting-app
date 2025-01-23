import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button1 from "../components/common/Button1";

const Home = () => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setValue(id);
    }
  }, []);

  return (
    <div>
      <p className="text-2xl">Bill Splitting</p>
      <form className="mt-10">
        <label>Mobile Number</label>
        <input
          type="text"
          className="block outline-0 rounded-md bg-white border w-full py-1 px-2 focus:ring-1 mt-2 text-center"
          placeholder="1234567890"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
        />
        {value ? (
          <Link to={`/generate-link/${value}`}>
            <Button1
              buttonLabel={"Next"}
              className={"bg-green-400 hover:bg-green-500 text-white mt-20"}
              onClick={() => localStorage.setItem("id", value)}
            />
          </Link>
        ) : (
          <Button1 buttonLabel={"Next"} className={"mt-20"} />
        )}
      </form>
    </div>
  );
};

export default Home;
