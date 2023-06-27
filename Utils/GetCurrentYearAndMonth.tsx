import { IMonth, IYear } from "../../../define";
import { paramsMonth, paramsYear } from "../../screens/Params";
import { fetchData } from "../Services/api";

const config = require("../Config/config.json");
const URL = config.BASE_URL;

export const getCurrentMonthAndYearId = async () => {
  try {
    // Tải dữ liệu years từ API
    const yearsResponse: any = await fetchData(URL, paramsYear);
    const years = yearsResponse.data as IYear[];

    // Tải dữ liệu months từ API
    const monthsResponse: any = await fetchData(URL, paramsMonth);
    const months = monthsResponse.data as IMonth[];

    // Lấy ngày tháng hiện tại
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1 để đúng với danh sách months

    // Tìm id và tên của năm hiện tại trong danh sách years
    const currentYearData = years.find(year => year.nambc === currentYear.toString());
    const currentYearId = currentYearData?.id;
    const currentYearName = currentYearData?.nambc;

    // Tìm id và tên của tháng hiện tại trong danh sách months
    const currentMonthData = months.find(month => month.thang.includes(currentMonth.toString()));
    const currentMonthId = currentMonthData?.id;
    const currentMonthName = currentMonthData?.thang;

    return {
      yearId: currentYearId,
      monthId: currentMonthId,
      yearName: currentYearName,
      monthName: currentMonthName,
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

