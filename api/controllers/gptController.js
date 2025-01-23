const serverError = require("../utils/serverError");
const BillModel = require("../models/BillModel");
const CustomBill = require("../models/CustomBill");

async function openAI({ model, systemPrompt, userPrompt }) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GPT_API}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 500,
    }),
  });
  return response;
}

const splitWithAi = async (req, res) => {
  const { payeeId, jsArray, prompt } = req.body;
  const response = await openAI({
    model: "gpt-4",
    systemPrompt: `You are an AI assistant designed to help split costs based on provided item details. Your response should only include the calculated JSON array. Do not add any explanation or additional text.
      Example Input: [
      {
        "id": "1",
        "cost": 20,
        "qty": 2,
        "uid": ["123", "234"]
      },
      {
        "id": "2",
        "cost": 15,
        "qty": 1,
        "uid": ["123"]
      },
      {
        "id": "2",
        "cost": 10,
        "qty": 2,
        "uid": ["123", "234"]
      }
    ]
     
    Example Output: [
      {
        "uid": "123",
        "cost": 30
      },
      {
        "uid": "234",
        "cost": 15
      }
    ]`,
    userPrompt: `So this the message from users: ${prompt}. This is the items: ${JSON.stringify(
      jsArray
    )}`,
  });

  if (!response.ok) {
    return res.status(500).json({
      message: "Error generating array from the AI service!",
    });
  }
  const data = await response.json();
  const result = data.choices[0]?.message?.content?.trim();
  const arrayMatch = result.match(/\[([\s\S]*?)\]/);
  if (arrayMatch) {
    const extractedArray = convertUidArray(`[${arrayMatch[1]}]`);
    res.status(200).json(extractedArray);
    const findOne = await CustomBill.findOne({ id: payeeId });
    if (findOne) {
      CustomBill.findOneAndUpdate({ id: payeeId, items: extractedArray });
    } else {
      CustomBill.create({ id: payeeId, items: extractedArray });
    }
  } else {
    res.status(400).json({ message: "Array not found in GPT response!" });
  }
};

const addBill = async (res, id, items) => {
  await BillModel.deleteMany({ id });
  BillModel.create({ id, items })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      serverError(res);
    });
};

function convertToArray(text) {
  const items = text
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const match = line.match(
        /{ qty: ([0-9.]+), name: "(.+?)", cost: ([0-9.]+) }/
      );
      if (match) {
        return {
          qty: parseFloat(match[1]),
          name: match[2],
          cost: parseFloat(match[3]),
        };
      }
      return null;
    })
    .filter((item) => item !== null);
  return items;
}

function convertUidArray(text) {
  const items = text
    .trim()
    .split("},")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const match = line.match(/"uid":\s*"(.+?)",\s*"cost":\s*([0-9.]+)/);
      if (match) {
        return {
          uid: match[1],
          cost: parseFloat(match[2]),
        };
      }
      return null;
    })
    .filter((item) => item !== null);
  return items;
}

async function processWithOpenAI(req, res) {
  const { textData, id } = req.body;
  try {
    const prompt = `
    The following is raw text extracted from a restaurant receipt. 
    Format the data as a **JavaScript array of objects** with the following fields:
    - **qty**: the item quantity, if available.
    - **name**: the item name.
    - **cost**: the total cost as a number.
    
    **Output format**: Only return the array, nothing else.
    
    Raw Text:
    ${textData}

    Output example:
    [
      { qty: 1, name: "Biryani", cost: 4.40 },
      { qty: 2, name: "Chicken", cost: 2.50 },
      { name: "GST 7%", cost: 1.50 } // Calculate based on sub total.
    ]
    `;
    const response = await openAI({
      model: "gpt-4",
      systemPrompt:
        "You are an assistant that only formats text into JavaScript arrays without any explanation.",
      userPrompt: prompt,
    });

    if (!response.ok) {
      return res.status(500).json({
        message: "Error generating array from the AI service!",
      });
    }
    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim();
    const arrayMatch = result.match(/\[([\s\S]*?)\]/);
    if (arrayMatch) {
      const extractedArray = convertToArray(`[${arrayMatch[1]}]`);
      addBill(res, id, extractedArray);
    } else {
      res.status(400).json({ message: "Array not found in GPT response!" });
    }
  } catch {
    serverError(res);
  }
}

module.exports = {
  processWithOpenAI,
  splitWithAi,
};
