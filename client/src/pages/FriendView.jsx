import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button1 from "../components/common/Button1";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Model";
import FriendForm from "../components/receipt/FriendForm";

const FriendView = () => {
  const [localUid, setLocalUid] = useState("");
  const [items, setItems] = useState([]);
  const [customInputSum, setCustomInputSum] = useState(0);
  const [selectOption, setSelectOption] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const findUid = localStorage.getItem("uid");

  useEffect(() => {
    if (findUid) {
      setLocalUid(findUid);
    }
  }, [findUid]);

  const checkHandler = (itemId, isChecked) => {
    setIsLoading(true);
    async function fetchItems() {
      if (params?.id) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bill/updateBill/${
            params.id
          }/${itemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: localUid, isChecked: !isChecked }),
          }
        );
        const result = await response.json();
        setIsLoading(false);
        if (!response.ok) {
          return alert(result.message);
        }
        setItems(result?.items);
      }
    }
    fetchItems();
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchItems() {
      if (params?.id) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bill/getBills/${params.id}`,
          {
            method: "GET",
          }
        );

        const result = await response.json();
        setIsLoading(false);
        if (!response.ok) {
          return alert(result.message);
        }
        setItems(result?.items);
        setSelectOption(result?.splitOption);
        if (result?.splitOption === "input") {
          getCustomBill();
        }
      }
    }
    fetchItems();
    setInterval(() => {
      fetchItems();
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, selectOption]);

  async function getCustomBill() {
    setIsLoading(true);
    if (params?.id && findUid) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bill/getCustomBill/${
          params.id
        }`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        return alert(result.message);
      }
      const findMyItem = result?.items.find((el) => el.uid === findUid);
      setCustomInputSum(findMyItem.cost);
      setIsLoading(false);
    }
  }

  function isAllUIDsValid() {
    const hasInvalidUID = items?.some((item) => item.uid.includes(localUid));
    return hasInvalidUID;
  }

  function splitCostPerItem() {
    let totalBill = 0;
    items?.forEach((item) => {
      if (item.uid.includes(localUid)) {
        totalBill = (item.cost * item.qty) / item.uid.length;
      }
    });
    return Number(totalBill.toFixed(2));
  }

  function splitEqually() {
    const uniqueUIDs = new Set(items.flatMap((item) => item.uid));
    const participants = Array.from(uniqueUIDs);
    const totalBill = items.reduce(
      (sum, item) => sum + item.cost * item.qty,
      0
    );
    const perPersonCost = totalBill / participants.length;
    return Number(perPersonCost.toFixed(2));
  }

  const finalSplit = () => {
    if (selectOption === "perItem") {
      return splitCostPerItem();
    } else if (selectOption === "equally") {
      return splitEqually();
    }
  };

  return (
    <div className="w-full">
      <p className="text-2xl">Select Your Items</p>
      <p>{localUid}</p>
      <table className="w-full mt-5 text-start">
        <tr>
          <th className="text-start">Name</th>
          <th className="text-start">Cost</th>
          <th className="text-start">My Item</th>
        </tr>
        {items?.map((item, index) => (
          <tr key={index}>
            <td className="py-2">{item.name}</td>
            <td className="py-2">${item.cost}</td>
            <td className="py-2">
              {!item.name.toLowerCase().includes("gst") && (
                <Check
                  onClick={() => checkHandler(item._id)}
                  className={`rounded-full p-1 cursor-pointer ${
                    item.uid.includes(localUid) ? "bg-green-400" : "bg-gray-400"
                  }`}
                  color="#ffffff"
                />
              )}
            </td>
          </tr>
        ))}
      </table>
      {selectOption && isAllUIDsValid() ? (
        <Button1
          buttonLabel={"Complete"}
          className={"mt-5 bg-green-400 hover:bg-green-500 text-white"}
          onClick={() => setIsCompleted(true)}
        />
      ) : (
        <Button1
          buttonLabel={"Complete"}
          className={"mt-5 cursor-wait"}
          disabled={true}
        />
      )}
      <Modal isOpen={localUid ? false : true}>
        <FriendForm setLocalUid={setLocalUid} />
      </Modal>
      {isCompleted && (
        <div className="text-start text-lg font-medium mt-5">
          <p>Your Total Bill</p>
          <p>{customInputSum || finalSplit()}</p>
        </div>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

export default FriendView;
