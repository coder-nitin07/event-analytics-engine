import axios from "axios";

const TOTAL_REQUESTS = 1000;
const CONCURRENT_REQUESTS = 50;

const API_URL = "http://localhost:3000/api/track-event";

// generate random event
const generateEvent = () => {
  const types = ["click", "view", "purchase"];
  return {
    eventType: types[Math.floor(Math.random() * types.length)],
    userId: "user_" + Math.floor(Math.random() * 100)
  };
};

const sendRequest = async () => {
  try {
    await axios.post(API_URL, generateEvent());
  } catch (err) {
    console.error(
        "Request failed:",
        err.response?.status,
        err.response?.data || err.message
    );
   }
};

const runLoadTest = async () => {
  console.log(`Starting load test with ${TOTAL_REQUESTS} requests...`);

  const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENT_REQUESTS);

  for (let i = 0; i < batches; i++) {
    const requests = [];

    for (let j = 0; j < CONCURRENT_REQUESTS; j++) {
      requests.push(sendRequest());
    }

    await Promise.all(requests);

    console.log(`Batch ${i + 1}/${batches} completed`);
  }

  console.log("Load test completed 🚀");
};

runLoadTest();