const moment = require("moment"); // Import moment.js for easier date handling

const getDateRange = (filterType) => {
  let startDate, endDate;

  switch (filterType) {
    case "today":
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;

    case "week":
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
      break;

    case "month":
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
      break;

    case "year":
      startDate = moment().startOf("year").toDate();
      endDate = moment().endOf("year").toDate();
      break;

    default:
      return null; // No filter applied
  }

  return { startDate, endDate };
};


module.exports=getDateRange