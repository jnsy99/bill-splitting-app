import { useState } from "react";
import Button1 from "../common/Button1";

const FriendForm = ({ setLocalUid }) => {
  const [value, setValue] = useState("");

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
        <Button1
          buttonLabel={"Submit"}
          className={"mt-20"}
          onClick={() => {
            setLocalUid(value);
            localStorage.setItem("uid", value);
          }}
        />
      </form>
    </div>
  );
};

export default FriendForm;
