const CONTEXTS_BODEGA = {
  PorDespachar: {
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: true,
      param: "?deletePedidoBodega=true",
    },
    viewObsBodega: {
      enabled: true,
    },
    dispatchBodega: {
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
      param: "?deletePedidoBodega=true",
    },
    viewObsBodega: {
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
    dispatchBodega: {
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
      param: "?deletePedidoBodega=true",
    },
    viewObsBodega: {
      enabled: true,
    },
    dispatchBodega: {
      enabled: true,
      param: "?dispatchBodega=true",
    },
    completeBodega: {
      enabled: true,
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
    viewObsBodega: {
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
    dispatchBodega: {
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
      param: "?deletePedidoBodega=true",
    },
    viewObsBodega: {
      enabled: true,
    },
    dispatchBodega: {
      enabled: true,
      param: "?dispatchBodega=true",
    },
  },
};

export { CONTEXTS_BODEGA };
