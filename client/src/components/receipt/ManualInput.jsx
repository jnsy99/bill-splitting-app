import { useEffect, useState } from "react";
import Button1 from "../common/Button1";

const ManualInput = ({ items, id, saveHandler, doneBtn, doneButton }) => {
  const [values, setValues] = useState({
    qty: "",
    name: "",
    cost: "",
  });

  const valuesHandler = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (id) {
      const findItem = items.find((el) => el._id === id);
      setValues(findItem);
    }
  }, [id, items]);

  return (
    <form
      className="text-start space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        saveHandler(values);
      }}
    >
      <div>
        <label>QTY</label>
        <input
          type="number"
          className="block outline-0 rounded-md bg-white border w-full py-1 px-2 focus:ring-1 mt-1"
          placeholder="2"
          name="qty"
          onChange={valuesHandler}
          required
          value={values.qty}
        />
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          className="block outline-0 rounded-md bg-white border w-full py-1 px-2 focus:ring-1 mt-1"
          placeholder="Chicken"
          name="name"
          onChange={valuesHandler}
          required
          value={values.name}
        />
      </div>
      <div>
        <label>Cost</label>
        <input
          type="number"
          className="block outline-0 rounded-md bg-white border w-full py-1 px-2 focus:ring-1 mt-1"
          placeholder="16"
          name="cost"
          onChange={valuesHandler}
          required
          value={values.cost}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button1
          buttonLabel={"Save"}
          className={"bg-green-400 hover:bg-green-500 text-white"}
        />
        {doneBtn && (
          <Button1
            buttonLabel={"Done"}
            buttonType={"button"}
            onClick={doneButton}
          />
        )}
      </div>
    </form>
  );
};

export default ManualInput;
