const CONTEXTS = {
  NoAutorizado: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: true,
      param: "?autorizePedido=true",
    },
    complete: {
      enabled: false,
    },
  },
  Autorizado: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: false,
    },
    unauthorized: {
      enabled: true,
    },
    invoice: {
      enabled: true,
    },
    complete: {
      enabled: false,
    },
  },
  Facturado: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: false,
    },
    unauthorized: {
      enabled: false,
    },
    dispatch: {
      enabled: true,
    },
    invoice: {
      enabled: false,
    },
    complete: {
      enabled: false,
    },
  },
  Incompletos: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: false,
    },
    dispatch: {
      enabled: true,
    },
    invoice: {
      enabled: false,
    },
    complete: {
      enabled: true,
    },
  },
  Despachado: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: false,
    },
    invoice: {
      enabled: false,
    },
    complete: {
      enabled: false,
    },
  },
  Eliminados: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: false,
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: false,
    },
    invoice: {
      enabled: false,
    },
    complete: {
      enabled: false,
    },
  },
  Default: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedido=true",
    },
    viewObs: {
      enabled: true,
    },
    autorize: {
      enabled: true,
      param: "?autorizePedido=true",
    },
    complete: {
      enabled: false,
    },
  },
};

export { CONTEXTS };
