import { dashboardMockUrl } from "../api/api";
import { httpClient } from "../api/httpClient";

export const fetchDummyData = async (timeRange) => {
    try {
      const response = await httpClient.get(dashboardMockUrl);
      const data = response.data;
  
      if (timeRange === "1 Day") return data["1day"];
      if (timeRange === "1 Week") return data["1week"];
      if (timeRange === "1 Month") return data["1month"];
      if (timeRange === "1 Year") return data["1year"];
      return data["1week"];
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };
