import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  FormHelperText,
} from "@mui/material";

// Icons
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NumbersIcon from "@mui/icons-material/Numbers";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Interfaces
import { IUser, IClient, IBodega } from "../../interfaces";

// Services
import {
  getUser,
  getLP,
  getLPBodegas,
  getProductsLPBodega,
} from "../../services";

// Components
import {
  RegistrarPedidoSkeleton,
  Table,
  ConfirmarPedido,
} from "../../components";

// React Hook Form
import { useForm, Controller } from "react-hook-form";

// Utils
import { currencyFormatThousands } from "../../utils";

interface Props {
  isMobile: boolean;
  user: IUser;
  client: null | IClient;
  bodegas: null | IBodega;
  preProducts?: string[][];
}

interface FormValues {
  lp: number;
  product: readonly string[] | string;
  quantity: string;
  quantityBonus: string;
}

const RegistrarPedido = ({
  isMobile,
  user,
  client = null,
  bodegas = null,
  preProducts,
}: Props) => {
  const [lps, setLps] = useState<string[]>([]);
  const [products, setProducts] = useState<string[][]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [initialOrder, setInitialOrder] = useState<string[][]>([]);
  const [totalKg, setTotalKg] = useState(0);
  const [confirmOrder, setConfirmOrder] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      lp: 0,
      product: "Seleccionar",
      quantityBonus: "",
    },
  });

  const lp = watch("lp", 0);

  const handleOrderSubmit = (data: FormValues) => {
    if (bodegas) {
      setInitialOrder([
        ...initialOrder,
        [data.product[0], String(data.lp), data.quantity, data.product[1]],
      ]);
    } else {
      setInitialOrder([
        ...initialOrder,
        [
          data.product[0],
          String(data.lp),
          data.quantity,
          data.quantityBonus || "0",
          data.product[1],
          currencyFormatThousands(
            Number(data.quantity) * Number(data.product[2].replace(",", "."))
          ),
        ],
      ]);
    }
    reset({
      lp: watch("lp"),
      product: "Seleccionar",
      quantity: "",
      quantityBonus: "",
    });
  };

  const handleDeleteProduct = (product: string) => {
    setInitialOrder(initialOrder.filter((item) => item[0] !== product));
  };

  const handleConfirmPedido = () => {
    setConfirmOrder(true);
  };

  useEffect(() => {
    if (preProducts) {
      setLoading(true);
      setInitialOrder(
        preProducts.map((product) => [
          product[0],
          product[8],
          product[1],
          product[2],
          product[5],
          product[3],
        ])
      );
      setLoading(false);
    }
  }, [preProducts]);

  useEffect(() => {
    if (client) {
      const totalKg = initialOrder.reduce(
        (acc, curr) => acc + parseFloat(curr[5].replace(/\./g, "")),
        0
      );
      setTotalKg(totalKg);
    }
  }, [initialOrder, client]);

  useEffect(() => {
    setLoading(true);
    if (bodegas) {
      getLPBodegas().then(({ lps }) => {
        setLoading(false);
        setLps(lps as string[]);
      });
    } else {
      getUser(user.id).then(({ lps }) => {
        setLoading(false);
        setLps(lps[0] as string[]);
      });
    }
  }, [user.id, bodegas]);

  useEffect(() => {
    if (lp === 0) setProducts([]);
    else if (lp) {
      if (bodegas) {
        setProducts([]);
        setLoadingProducts(true);
        getProductsLPBodega(String(lp)).then(({ products }) => {
          setProducts(products);
          setLoadingProducts(false);
          reset({
            lp: watch("lp"),
            product: "Seleccionar",
            quantity: "",
            quantityBonus: "",
          });
        });
      } else {
        setProducts([]);
        setLoadingProducts(true);
        getLP(String(lp), "Pedidos").then((lp) => {
          reset({
            lp: watch("lp"),
            product: "Seleccionar",
            quantity: "",
            quantityBonus: "",
          });
          setLoadingProducts(false);
          setProducts(lp.productos);
        });
      }
    }
  }, [lp, reset, watch, bodegas]);

  if (confirmOrder)
    return (
      <ConfirmarPedido
        back={() => setConfirmOrder(false)}
        order={initialOrder}
        isMobile={isMobile}
        user={user}
        client={client}
      />
    );

  if (loading)
    return <RegistrarPedidoSkeleton isMobile={isMobile} bodegas={bodegas} />;

  return (
    <Box
      sx={{
        p: isMobile ? 0 : 1,
        pt: 0,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#001122",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            fontSize={isMobile ? 14 : 18}
            fontWeight={800}
          >
            {user.hierarchy}: Registrar pedido {bodegas && "para bodega"}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {client && (
            <Typography
              variant="h6"
              fontSize={14}
              fontWeight={500}
              sx={{
                mb: 2,
              }}
            >
              Cliente: <strong>{client.name}</strong>
            </Typography>
          )}
          <Divider
            sx={{
              mb: 2,
            }}
          />
          <Box>
            <form onSubmit={handleSubmit(handleOrderSubmit)}>
              {isMobile ? (
                <Controller
                  name="lp"
                  control={control}
                  defaultValue={0}
                  rules={{ required: "La lista de precios es obligatoria" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      sx={{ mb: 2 }}
                      error={!!errors.lp}
                      variant="standard"
                    >
                      <InputLabel id="lp-select" error={!!errors.lp}>
                        Lista de precios
                      </InputLabel>
                      <NativeSelect
                        id="lp-select"
                        inputProps={{
                          name: "Lista de precios",
                          id: "lp-select",
                        }}
                        {...field}
                        defaultValue={0}
                        value={watch("lp")}
                        startAdornment={
                          <InputAdornment position="start">
                            <MenuBookIcon />
                          </InputAdornment>
                        }
                      >
                        <option value={0}>Seleccionar</option>
                        {lps?.map((lp, index) => (
                          <option key={index} value={lp[0]}>
                            {lp[1]}
                          </option>
                        ))}
                      </NativeSelect>
                      <FormHelperText error={!!errors.lp} sx={{ ml: 1.9 }}>
                        {!!errors.lp
                          ? errors.lp.message
                          : "Selecciona la lista de precios"}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              ) : (
                <TextField
                  fullWidth
                  select
                  label="Lista de precios"
                  error={!!errors.lp}
                  sx={{ mb: 2 }}
                  helperText={
                    !!errors.lp
                      ? errors.lp.message
                      : "Selecciona la lista de precios"
                  }
                  {...register("lp", {
                    required: "La lista de precios es obligatoria",
                  })}
                  value={watch("lp")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MenuBookIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value={0}>Seleccionar</MenuItem>
                  {lps?.map((lp, index) => (
                    <MenuItem key={index} value={lp[0]}>
                      {lp[1]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {isMobile ? (
                <Controller
                  control={control}
                  name="product"
                  defaultValue={"Seleccionar"}
                  rules={{
                    required: "El producto es obligatorio",
                    validate: (value) =>
                      (Array.isArray(value) && value[0] === "Seleccionar") ||
                      String(value) === "Seleccionar"
                        ? "El producto es obligatorio"
                        : undefined,
                  }}
                  render={() => (
                    <FormControl
                      fullWidth
                      sx={{ mb: 2 }}
                      error={!!errors.product}
                      variant="standard"
                    >
                      <InputLabel id="product-select" error={!!errors.product}>
                        Productos
                      </InputLabel>
                      <NativeSelect
                        disabled={loadingProducts}
                        id="product-select"
                        inputProps={{
                          name: "Productos",
                          id: "product-select",
                        }}
                        onChange={(e) => {
                          const selectedOption = e.target.selectedOptions[0];
                          const product = JSON.parse(
                            selectedOption.dataset.product as string
                          );
                          setValue("product", product);
                        }}
                        defaultValue={"Seleccionar"}
                        startAdornment={
                          <InputAdornment position="start">
                            {loadingProducts ? (
                              <CircularProgress size={13} />
                            ) : (
                              <ShoppingCartIcon />
                            )}
                          </InputAdornment>
                        }
                      >
                        <option value={"Seleccionar"}>Seleccionar</option>
                        {products?.map((product, index) => (
                          <option
                            key={index}
                            value={product[0]}
                            data-product={JSON.stringify(product)}
                          >
                            {product[0]}
                          </option>
                        ))}
                      </NativeSelect>
                      <FormHelperText error={!!errors.product} sx={{ ml: 1.9 }}>
                        {!!errors.product
                          ? errors.product.message
                          : "Selecciona el producto"}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              ) : (
                <TextField
                  fullWidth
                  disabled={loadingProducts}
                  select
                  label="Productos"
                  error={!!errors.product}
                  sx={{ mb: 2 }}
                  helperText={
                    loadingProducts
                      ? "Cargando productos..."
                      : !!errors.product
                      ? errors.product.message
                      : "Selecciona el producto"
                  }
                  {...register("product", {
                    required: "El producto es obligatorio",
                    validate: (value) =>
                      (Array.isArray(value) && value[0] === "Seleccionar") ||
                      String(value) === "Seleccionar"
                        ? "El producto es obligatorio"
                        : undefined,
                  })}
                  value={watch("product")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {loadingProducts ? (
                          <CircularProgress size={13} />
                        ) : (
                          <ShoppingCartIcon />
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value={"Seleccionar"}>Seleccionar</MenuItem>
                  {products?.map((product, index) => (
                    <MenuItem key={index} value={product}>
                      {product[0]}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                fullWidth
                type="number"
                autoComplete="quantity"
                sx={{ marginBottom: "1em" }}
                placeholder={
                  (Array.isArray(watch("product")) &&
                    watch("product")[0] === "Seleccionar") ||
                  watch("product") === "Seleccionar"
                    ? "Seleccione un producto"
                    : `Cantidad de ${
                        Array.isArray(watch("product"))
                          ? watch("product")[0]
                          : watch("product")
                      }`
                }
                label="Cantidad"
                error={!!errors.quantity}
                helperText={
                  !!errors.quantity
                    ? errors.quantity.message
                    : (Array.isArray(watch("product")) &&
                        watch("product")[0] === "Seleccionar") ||
                      watch("product") === "Seleccionar"
                    ? "Seleccione un producto"
                    : `Cantidad de ${
                        Array.isArray(watch("product"))
                          ? watch("product")[0]
                          : watch("product")
                      }`
                }
                {...register("quantity", {
                  valueAsNumber: true,
                  validate: (value) =>
                    Number(value) >= 0 ? undefined : "Cantidad no válida",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {client && (
                <TextField
                  fullWidth
                  type="number"
                  autoComplete="quantityBonus"
                  sx={{ marginBottom: "1em" }}
                  placeholder={
                    (Array.isArray(watch("product")) &&
                      watch("product")[0] === "Seleccionar") ||
                    watch("product") === "Seleccionar"
                      ? "Seleccione un producto"
                      : `Cantidad bonificada de ${
                          Array.isArray(watch("product"))
                            ? watch("product")[0]
                            : watch("product")
                        }`
                  }
                  label="Cantidad bonificada"
                  error={!!errors.quantityBonus}
                  helperText={
                    !!errors.quantityBonus
                      ? errors.quantityBonus.message
                      : (Array.isArray(watch("product")) &&
                          watch("product")[0] === "Seleccionar") ||
                        watch("product") === "Seleccionar"
                      ? "Seleccione un producto"
                      : `Cantidad bonificada de ${
                          Array.isArray(watch("product"))
                            ? watch("product")[0]
                            : watch("product")
                        }`
                  }
                  {...register("quantityBonus", {
                    validate: (value) =>
                      Number(value) >= 0 ? undefined : "Cantidad no válida",
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  startIcon={<AddIcon />}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: isMobile ? 9.5 : 13,
                  }}
                >
                  AÑADIR AL PEDIDO
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleConfirmPedido}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: isMobile ? 9.5 : 13,
                  }}
                >
                  CONTINUAR
                </Button>
              </Box>
            </form>
            <Box
              sx={{
                overflow: "auto",
                mt: 2,
              }}
            >
              <Table
                title={`Total Kg: ${totalKg} kg`}
                columns={
                  client
                    ? [
                        "Producto",
                        "LP",
                        "Cantidad",
                        "Cantidad bonificada",
                        "V/U",
                        "TKg",
                      ]
                    : ["Producto", "LP", "Cantidad", "TKg"]
                }
                data={initialOrder}
                to="/productos"
                context={{
                  read: {
                    enabled: false,
                  },
                  delete: {
                    enabled: false,
                  },
                  update: {
                    enabled: false,
                  },
                  erase: {
                    enabled: true,
                    callback: handleDeleteProduct,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { RegistrarPedido };
