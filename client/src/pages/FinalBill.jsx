import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../components/common/Loading";

const FinalBill = () => {
  const [customInputArray, setCustomInputArray] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const customInput = searchParams.get("customInput");

  const navigate = useNavigate();

  const payeeId = localStorage.getItem("id");

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
  }, [payeeId]);

  function splitCostPerItem() {
    const aggregatedResults = {};
    let totalBill = 0;
    items?.forEach((item) => {
      totalBill += item.cost * item.qty;
      const perPersonCost = (item.cost * item.qty) / item.uid.length;
      item.uid.forEach((uid) => {
        if (!aggregatedResults[uid]) {
          aggregatedResults[uid] = 0;
        }
        aggregatedResults[uid] += perPersonCost;
      });
    });
    return {
      results: Object.entries(aggregatedResults).map(([uid, cost]) => ({
        uid,
        cost: cost.toFixed(2),
      })),
      totalBill: Number(totalBill.toFixed(2)),
    };
  }

  function splitEqually() {
    const uniqueUIDs = new Set(items.flatMap((item) => item.uid));
    const participants = Array.from(uniqueUIDs);
    const totalBill = items.reduce(
      (sum, item) => sum + item.cost * item.qty,
      0
    );
    const perPersonCost = totalBill / participants.length;
    const results = participants.map((uid) => ({
      uid,
      cost: Number(perPersonCost.toFixed(2)),
    }));
    return { results, totalBill: Number(totalBill.toFixed(2)) };
  }

  useEffect(() => {
    if (params.splitOption === "input" && items.length) {
      setIsLoading(true);
      async function fetchItems() {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ai/splitWithAi`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payeeId,
              prompt: customInput,
              jsArray: items,
            }),
          }
        );
        setIsLoading(false);
        const result = await response.json();
        if (!response.ok) {
          return alert(result.message);
        }
        setCustomInputArray(result);
      }
      fetchItems();
    }
  }, [customInput, items, params.splitOption, payeeId]);

  const finalSplit = () => {
    let totalBill = 0;
    customInputArray.forEach((el) => {
      totalBill += el.cost;
    });
    if (params.splitOption === "perItem") {
      return splitCostPerItem();
    } else if (params.splitOption === "equally") {
      return splitEqually();
    } else if (params.splitOption === "input") {
      return {
        results: customInputArray,
        totalBill: Number(totalBill.toFixed(2)),
      };
    }
  };

  useEffect(() => {
    if (!payeeId) {
      return navigate("/");
    }
  }, [navigate, payeeId]);

  return (
    <div className="w-full">
      <p className="text-2xl">
        Bill Split {params.splitOption === "perItem" ? "Per Item" : "Equally"}
      </p>
      <p>{payeeId}</p>
      <table className="w-full mt-5 text-start">
        <tr>
          <th className="text-start">UID</th>
          <th className="text-start">Cost</th>
          <th className="text-start">Paid</th>
        </tr>
        {finalSplit().results.map((item, index) => (
          <tr key={index}>
            <td className="py-2">{item.uid}</td>
            <td className="py-2">${item.cost}</td>
            <td className="py-2">
              <Check
                className={`rounded-full p-1 bg-green-400`}
                color="#ffffff"
              />
            </td>
          </tr>
        ))}
      </table>
      <div className="text-start text-lg font-medium mt-5">
        <p>Total Bill</p>
        <p>{finalSplit().totalBill}</p>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default FinalBill;
