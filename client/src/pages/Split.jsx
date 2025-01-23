import { ArrowBigRight, Check, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../components/common/Button1";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Model";
import ManualInput from "../components/receipt/ManualInput";

const UploadReceipt = () => {
  const [customSplit, setCustomSplit] = useState("");
  const [items, setItems] = useState([]);
  const [splitOption, setSplitOption] = useState("perItem");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const payeeId = localStorage.getItem("id");
  const navigate = useNavigate();

  const addHandler = (values) => {
    setIsLoading(true);
    async function fetchItems() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bill/createBill/${payeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        alert("Something went wrong! Please try again.");
      }
      const result = await response.json();
      setItems(result.items);
      setIsLoading(false);
      setIsOpen(false);
    }
    fetchItems();
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchItems() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bill/getBills/${payeeId}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        alert("Something went wrong! Please refresh the page and try again.");
      }
      const result = await response.json();
      setItems(result?.items);
      setIsLoading(false);
    }
    fetchItems();
    setInterval(() => {
      fetchItems();
    }, 10000);
  }, [payeeId]);

  const updateHandler = (values) => {
    setIsLoading(true);
    async function fetchItems() {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/bill/updateBill/${payeeId}/${isEdit}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        alert("Something went wrong! Please try again.");
      }
      const result = await response.json();
      setItems(result.items);
      setIsLoading(false);
      setIsOpen(false);
    }
    fetchItems();
  };

  const deleteHandler = (itemId) => {
    setIsLoading(true);
    async function deleteItem() {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/bill/deleteBill/${payeeId}/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        alert("Something went wrong! Please try again.");
      }
      const result = await response.json();
      setItems(result.items);
      setIsLoading(false);
    }
    deleteItem();
  };

  const checkHandler = (itemId) => {
    setIsLoading(true);
    async function fetchItems() {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/bill/updateBill/${payeeId}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: payeeId,
          }),
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        alert("Something went wrong! Please try again.");
      }
      const result = await response.json();
      setItems(result?.items);
      setIsLoading(false);
    }
    fetchItems();
  };

  const completeHandler = async (splitOption) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/bill/updateSplitOption/${payeeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          splitOption: splitOption,
        }),
      }
    );
    if (!response.ok) {
      return alert("Something went wrong! Please try again.");
    }
  };

  function isAllUIDsValid() {
    const hasInvalidUID = items?.some((item) => item.uid.length <= 0);
    return !hasInvalidUID;
  }

  useEffect(() => {
    if (!payeeId) {
      return navigate("/");
    }
  }, [navigate, payeeId]);

  return (
    <div className="w-full">
      <p className="text-2xl">Bill Splitting</p>
      <p>{payeeId}</p>
      <Button1
        buttonLabel={"Add more"}
        className="mt-5 block !w-auto ml-auto bg-green-400 hover:bg-green-500 text-white"
        onClick={() => setIsOpen(true)}
      />
      <table className="w-full mt-5 text-start">
        <tr>
          <th className="text-start">QTY</th>
          <th className="text-start">Name</th>
          <th className="text-start">Cost</th>
          <th className="text-start">My Item</th>
          <th className="text-start">Action</th>
        </tr>
        {items?.map((item, index) => (
          <tr key={index}>
            <td className="py-2">{item.qty}</td>
            <td className="py-2">{item.name}</td>
            <td className="py-2">${item.cost}</td>
            <td className="py-2">
              <Check
                onClick={() => checkHandler(item._id)}
                className={`rounded-full p-1 cursor-pointer ${
                  item.uid.includes(payeeId) ? "bg-green-400" : "bg-gray-400"
                }`}
                color="#ffffff"
              />
            </td>
            {item.uid && (
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <Trash
                    className="cursor-pointer"
                    onClick={() => deleteHandler(item._id)}
                    size={16}
                  />
                  <Edit
                    className="cursor-pointer"
                    onClick={() => {
                      setIsOpen(true);
                      setIsEdit(item._id);
                    }}
                    size={16}
                  />
                </div>
              </td>
            )}
          </tr>
        ))}
      </table>
      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-x-1">
          <Button1
            buttonLabel={"Split per item"}
            className={
              splitOption === "perItem" && "bg-red-100 hover:bg-red-200"
            }
            disabled={isLoading}
            onClick={() => setSplitOption("perItem")}
          />
          {splitOption === "perItem" && (
            <ArrowBigRight size={40} color="#4ade80" />
          )}
        </div>
        <div className="flex items-center gap-x-1">
          <Button1
            buttonLabel={"Split equally"}
            className={
              splitOption === "equally" && "bg-red-100 hover:bg-red-200"
            }
            disabled={isLoading}
            onClick={() => setSplitOption("equally")}
          />
          {splitOption === "equally" && (
            <ArrowBigRight size={40} color="#4ade80" />
          )}
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="text"
            className={`block outline-0 rounded-md border w-full py-1 px-2 focus:ring-1 ${
              splitOption === "input" && "bg-red-50"
            }`}
            placeholder="input for customization..."
            onFocus={() => setSplitOption("input")}
            value={customSplit}
            onChange={(event) => setCustomSplit(event.target.value)}
          />
          <div>
            {splitOption === "input" && (
              <ArrowBigRight size={40} color="#4ade80" />
            )}
          </div>
        </div>
      </div>
      {isAllUIDsValid() ? (
        <Link to={`/final-bill/${splitOption}?customInput=${customSplit}`}>
          <Button1
            buttonLabel={"Complete"}
            className={"mt-5 bg-green-400 hover:bg-green-500 text-white"}
            onClick={() => completeHandler(splitOption)}
          />
        </Link>
      ) : (
        <Button1
          buttonLabel={"Complete"}
          className={"mt-5 cursor-wait"}
          disabled={true}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsEdit("");
        }}
      >
        <ManualInput
          items={items}
          id={isEdit}
          saveHandler={isEdit ? updateHandler : addHandler}
        />
      </Modal>
      {isLoading && <Loading />}
    </div>
  );
};

export default UploadReceipt;
