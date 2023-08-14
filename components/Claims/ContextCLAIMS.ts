import { IContextTable } from "../../interfaces";

const CONTEXT_CLAIMS: {
  [key: string]: IContextTable;
} = {
  Vendedor: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deleteClaim=true",
    },
  },
  CEO: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deleteClaim=true",
    },
    reviewClaim: {
      enabled: true,
    },
  },
};

export { CONTEXT_CLAIMS };
