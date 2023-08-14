import moment from "moment";

const normalizeDate = (date: string) => {
  return moment.utc(new Date(date)).format("DD/MM/YYYY");
};

export { normalizeDate };
