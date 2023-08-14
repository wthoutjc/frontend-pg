import NextImage from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  IconButton,
  Tooltip,
  Link,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Card,
  CardActions,
  CardHeader,
} from "@mui/material";

// React Hook Form
import { useForm } from "react-hook-form";

// Inrterfaces
import { ILp } from "../../interfaces";

// Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArticleIcon from "@mui/icons-material/Article";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

// Components
import { Table, TableEdit } from "../../components";

//Drag and drop
import Dropzone from "react-dropzone";

// Services
import {
  assignLP,
  getAllSellers,
  LoadExcelLP,
  updateLP,
  uploadLPToS3,
  getTokenAPI,
  deleteLPFromS3,
} from "../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  lp: ILp;
  productos: string[][];
  vendedor: string[];
  backCallback: () => void;
  category: "Pedidos" | "Bodegas";
}

const EditLprecio = ({
  lp,
  productos,
  vendedor,
  backCallback,
  category,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const { isMobile } = useAppSelector((state) => state.ui);

  const [productosData, setProductosData] = useState<string[][]>(productos);

  const [renderUploadPDF, setRenderUploadPDF] = useState(!lp.link);
  const [filePDF, setFilePDF] = useState<{
    loaded: boolean;
    file: File | null;
  }>({
    loaded: false,
    file: null,
  });
  const [fileExcel, setFileExcel] = useState<{
    loaded: boolean;
    file: File | null;
  }>({
    loaded: false,
    file: null,
  });

  const [loading, setLoading] = useState({
    sellers: false,
    update: false,
    loadingFile: false,
    loadingPDF: false,
  });

  const [sellers, setSellers] = useState<
    [number, string, string, string, string][]
  >([]);
  const [seller, setSeller] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ILp>({
    defaultValues: lp,
  });

  const [checked, setChecked] = useState({
    excel: false,
    manual: false,
  });

  const handleUpdateLp = (data: ILp) => {
    setLoading({ ...loading, update: true });
    updateLP(
      data,
      category === "Pedidos"
        ? productosData.map((row) => [row[0], row[1].replace(".", ""), row[2]])
        : productosData.map((row) => [row[0], row[1]]),
      category
    ).then((res) => {
      setLoading({ ...loading, update: false });
      const notification = {
        id: uuid(),
        title: res.ok ? "Éxito" : "Error",
        message: res.message,
        type: res.ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      if (res.ok) router.push("/lprecios");
    });
  };

  const handleLoadSellers = () => {
    setLoading({
      ...loading,
      sellers: true,
    });
    getAllSellers().then((res) => {
      setLoading({
        ...loading,
        sellers: false,
      });
      if (res.ok) {
        setSellers(res.users);
      }
    });
  };

  const handleAssignSeller = (id: number) => {
    if (seller) {
      setLoading({
        ...loading,
        sellers: true,
      });
      assignLP(seller, id, category).then((res) => {
        setLoading({
          ...loading,
          sellers: false,
        });
        const notification = {
          id: uuid(),
          title: res.ok ? "Éxito" : "Error",
          message: res.message,
          type: res.ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        if (res.ok) router.push(`/lprecios`);
      });
    }
  };

  const loadLP = () => {
    setLoading({
      ...loading,
      loadingFile: true,
    });
    if (fileExcel.file && token) {
      LoadExcelLP(fileExcel.file, category, token).then((res) => {
        setFileExcel({ loaded: false, file: null });
        setLoading({
          ...loading,
          loadingFile: false,
        });
        if (res.ok) {
          if (res.lp) {
            return setProductosData(
              category === "Pedidos"
                ? res.lp.map((data) => [data[0], data[1].toString(), data[2]])
                : res.lp.map((data) => [data[0], data[1]])
            );
          }
        }
        const notification = {
          id: uuid(),
          title: "Error:",
          message: res.message,
          type: "error" as "error" | "success" | "info" | "warning",
          autoDismiss: 5000,
        };
        return dispatch(newNotification(notification));
      });
    }
  };

  const handleDeletePDF = () => {
    alert("¿Está seguro de eliminar el PDF?");
    if (token) {
      setLoading({
        ...loading,
        loadingPDF: true,
      });
      deleteLPFromS3(lp.id, category, token).then(({ message, ok }) => {
        setLoading({
          ...loading,
          loadingPDF: false,
        });
        const notification = {
          id: uuid(),
          title: ok ? "Éxito:" : "Error:",
          message,
          type: ok ? "success" : ("error" as "error" | "success"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        if (ok) router.push("/lprecios");
      });
    }
  };

  const handleUploadPDF = () => {
    if (filePDF.file && token) {
      setLoading({
        ...loading,
        loadingPDF: true,
      });
      uploadLPToS3(lp.id, filePDF.file, category, token).then(
        ({ message, ok }) => {
          setLoading({
            ...loading,
            loadingPDF: false,
          });
          const notification = {
            id: uuid(),
            title: ok ? "Éxito:" : "Error:",
            message,
            type: ok ? "success" : ("error" as "error" | "success"),
            autoDismiss: 5000,
          };
          dispatch(newNotification(notification));
          if (ok) router.push("/lprecios");
        }
      );
    } else {
      alert("No PDF");
    }
  };

  useEffect(() => {
    getTokenAPI().then(({ token }) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    const allowExtension = /(.xlsx)$/i;
    if (fileExcel.file) {
      if (!allowExtension.exec(fileExcel.file.name)) {
        setFileExcel({
          loaded: false,
          file: null,
        });
        const notification = {
          id: uuid(),
          title: "Error:",
          message: "El archivo no es un archivo de excel",
          type: "error" as "error" | "success" | "info" | "warning",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
      }
    }
  }, [fileExcel, dispatch]);

  useEffect(() => {
    const allowExtension = /(.pdf)$/i;
    if (filePDF.file) {
      if (!allowExtension.exec(filePDF.file.name)) {
        setFilePDF({
          loaded: false,
          file: null,
        });
        const notification = {
          id: uuid(),
          title: "Error:",
          message: "El archivo no es un archivo de PDF",
          type: "error" as "error" | "success" | "info" | "warning",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
      }
    }
  }, [filePDF, dispatch]);

  useEffect(() => {
    if (fileExcel.loaded) {
      setChecked({
        ...checked,
        excel: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileExcel.loaded]);

  useEffect(() => {
    if (filePDF.loaded) {
      setRenderUploadPDF(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filePDF.loaded]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, height: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          height: "inherit",
          overflow: isMobile ? "auto" : "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            display: "flex",
            flexDirection: "column",
            mb: 2,
            pt: 0,
          }}
        >
          <Box
            sx={{
              mb: 1,
              mt: 0.5,
            }}
          >
            {loading.update && <LinearProgress />}
            <Tooltip title="Volver">
              <IconButton
                onClick={backCallback}
                size={isMobile ? "small" : "medium"}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="body2"
            fontSize={isMobile ? 14 : 18}
            fontWeight={600}
          >
            Editar lista de precios: Company S.A.S.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={isMobile ? 12 : 16}
          >
            Actualiza la información de la lista de precios en Company S.A.S.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflow: isMobile ? "none" : "auto",
          }}
        >
          <form
            onSubmit={handleSubmit(handleUpdateLp)}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
              height: "100%",
              backgroundColor: "#001122",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: isMobile ? "100%" : "30%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  pb: 0,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  fontSize={isMobile ? 14 : 18}
                  sx={{
                    mb: 2,
                  }}
                >
                  Información
                </Typography>
                <TextField
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                  type="text"
                  autoComplete="name-lp"
                  sx={{ marginBottom: "1em" }}
                  placeholder="Ej: 1001231235"
                  label="Nombre de la lista de precios"
                  error={!!errors.name}
                  helperText={
                    !!errors.name
                      ? errors.name.message
                      : "Escribe el nombre de la lista de precios"
                  }
                  {...register("name", {
                    required: "El nombre es requerido",
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                  select
                  sx={{ marginBottom: "1em" }}
                  label="Marca"
                  error={!!errors.brand}
                  helperText={
                    !!errors.brand
                      ? errors.brand.message
                      : "Selecciona la marca de la lista de precios"
                  }
                  {...register("brand", {
                    required: "La marca es requerida",
                  })}
                  defaultValue={watch("brand")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ArticleIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value={""}>Seleccionar</MenuItem>
                  <MenuItem value={"Agrosal"}>Agrosal</MenuItem>
                  <MenuItem value={"Rentasal"}>Rentasal</MenuItem>
                  <MenuItem value={"Fedesal"}>Fedesal</MenuItem>
                  <MenuItem value={"Personalizadas"}>Personalizadas</MenuItem>
                </TextField>

                {lp.link && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                      }}
                      fontWeight={600}
                    >
                      Archivo asociado
                    </Typography>
                    <Card
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <CardHeader
                        avatar={
                          <NextImage
                            src="/images/pdf.png"
                            alt="PDF - Company S.A.S"
                            width={30}
                            height={30}
                          />
                        }
                        title={`${lp.link.split("/")[1]}`}
                        subheader={`${lp.brand}`}
                      />
                      <CardActions disableSpacing>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => handleDeletePDF()}
                            sx={{
                              backgroundColor: "#d63031",
                              ":hover": {
                                backgroundColor: "#b71c1c",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  height: "50%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  pt: 0,
                }}
              >
                <Button
                  size={isMobile ? "small" : "medium"}
                  type="submit"
                  disabled={loading.update}
                  variant="contained"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                >
                  {loading.update ? "Actualizando..." : "Actualizar"}
                </Button>
                {renderUploadPDF && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                      }}
                      fontWeight={600}
                    >
                      Sin archivo PDF asociado
                    </Typography>
                    <Dropzone
                      onDrop={(file) =>
                        setFilePDF({
                          ...filePDF,
                          loaded: true,
                          file: file[0],
                        })
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          sx={{
                            backgroundColor: "#112233",
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            borderRadius: 3,
                            border: "1px dashed #fff",
                            cursor: "pointer",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                              }}
                            >
                              Suelta un archivo PDF .pdf aquí
                            </Typography>
                          </Box>
                          <input {...getInputProps()} />
                          <label>
                            <Button
                              size="small"
                              variant="contained"
                              component="span"
                              startIcon={<PlagiarismIcon fontSize="small" />}
                            >
                              Seleccionar archivo
                            </Button>
                          </label>
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                )}
                {filePDF.loaded && (
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#112233",
                      p: 1,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontSize={12}
                      sx={{
                        mr: 2,
                      }}
                    >
                      Archivo seleccionado:{" "}
                      <strong>{filePDF.file?.name}</strong>
                    </Typography>
                    {loading.loadingPDF ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mr: 2,
                        }}
                      >
                        <CircularProgress size={20} />
                      </Box>
                    ) : (
                      <>
                        <Tooltip title="Enviar">
                          <IconButton
                            size="small"
                            onClick={() => handleUploadPDF()}
                            sx={{ mr: 1 }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            sx={{
                              backgroundColor: "#d63031",
                              ":hover": {
                                backgroundColor: "#b71c1c",
                              },
                            }}
                            onClick={() => {
                              setFilePDF({
                                loaded: false,
                                file: null,
                              });
                              setRenderUploadPDF(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                )}
                <Typography
                  variant="body1"
                  fontWeight={600}
                  fontSize={isMobile ? 14 : 18}
                >
                  Vendedores
                </Typography>
                {Array.isArray(vendedor) && vendedor.length > 0 ? (
                  vendedor.map((dataStr, index) => {
                    const data = JSON.parse(dataStr);
                    return (
                      <NextLink key={index} href={`/users/${data.id}`} passHref>
                        <Link
                          sx={{
                            mb: 1,
                            fontSize: isMobile ? 12 : 16,
                          }}
                        >
                          {data.vendedor}
                        </Link>
                      </NextLink>
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                    }}
                  >
                    No hay vendedores asignados a esta lista de precios
                  </Typography>
                )}
                {Array.isArray(sellers) && sellers.length > 0 && (
                  <TextField
                    fullWidth
                    select
                    label="Vendedor"
                    onChange={(e) => setSeller(Number(e.target.value))}
                    value={seller}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                    }}
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {sellers?.map((seller, index) => {
                      return (
                        <MenuItem key={index} value={seller[0]}>
                          {seller[1]} {seller[2]}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
                <Button
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#20bf6b",
                    mb: 2,
                    color: "#001122",
                    ":hover": {
                      color: "#20bf6b",
                    },
                  }}
                  disabled={loading.sellers}
                  onClick={
                    sellers.length > 0
                      ? () => handleAssignSeller(Number(lp.id))
                      : () => handleLoadSellers()
                  }
                  startIcon={
                    loading.sellers ? (
                      <CircularProgress size={20} />
                    ) : (
                      <AddBoxIcon />
                    )
                  }
                >
                  {sellers.length > 0 ? (
                    loading.sellers ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Asignar vendedor"
                    )
                  ) : (
                    "Cargar vendedores"
                  )}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{ width: isMobile ? "100%" : "70%", p: 2, overflow: "auto" }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  mb: 2,
                }}
              >
                Editor de productos
              </Typography>
              <Box>
                {fileExcel.loaded && (
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#112233",
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        mr: 2,
                      }}
                    >
                      Archivo seleccionado:{" "}
                      <strong>{fileExcel.file?.name}</strong>
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SendIcon />}
                      sx={{
                        mr: 2,
                      }}
                      onClick={() => loadLP()}
                    >
                      Cargar
                    </Button>
                    <Tooltip title="Eliminar">
                      <IconButton
                        sx={{
                          backgroundColor: "#d63031",
                          ":hover": {
                            backgroundColor: "#b71c1c",
                          },
                        }}
                        onClick={() => {
                          setFileExcel({
                            loaded: false,
                            file: null,
                          });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <FormControlLabel
                  control={<Checkbox checked={checked.excel} />}
                  sx={{
                    width: "fit-content",
                  }}
                  onChange={() =>
                    setChecked({ manual: false, excel: !checked.excel })
                  }
                  label="Excel"
                />
                <FormControlLabel
                  control={<Checkbox checked={checked.manual} />}
                  sx={{
                    width: "fit-content",
                  }}
                  onChange={() =>
                    setChecked({ manual: !checked.manual, excel: false })
                  }
                  label="Manual"
                />
              </Box>
              <Box>
                {checked.excel && (
                  <Dropzone
                    onDrop={(file) =>
                      setFileExcel({
                        ...fileExcel,
                        loaded: true,
                        file: file[0],
                      })
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        sx={{
                          backgroundColor: "#112233",
                          display: "flex",
                          flexDirection: "column",
                          p: 2,
                          borderRadius: 3,
                          border: "1px dashed #fff",
                          cursor: "pointer",
                          justifyContent: "center",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                            }}
                          >
                            Suelta un archivo Excel .xlsx aquí
                          </Typography>
                        </Box>
                        <input {...getInputProps()} />
                        <label>
                          <Button
                            size="small"
                            variant="contained"
                            component="span"
                            startIcon={<PlagiarismIcon fontSize="small" />}
                          >
                            Seleccionar archivo
                          </Button>
                        </label>
                      </Box>
                    )}
                  </Dropzone>
                )}
              </Box>
              {checked.manual ? (
                <TableEdit
                  loading={loading.loadingFile}
                  title={checked.manual ? "Modo editor manual" : "Productos"}
                  columns={
                    category === "Pedidos"
                      ? ["Producto", "Precio", "Kg"]
                      : ["Producto", "Kg"]
                  }
                  data={productosData}
                />
              ) : (
                <Table
                  title={checked.manual ? "Modo editor manual" : "Productos"}
                  columns={
                    category === "Pedidos"
                      ? ["Producto", "Precio", "Kg"]
                      : ["Producto", "Kg"]
                  }
                  to="none"
                  loading={loading.loadingFile}
                  data={productosData}
                  context={{
                    delete: {
                      enabled: false,
                    },
                    read: {
                      enabled: false,
                    },
                    update: {
                      enabled: false,
                    },
                  }}
                />
              )}
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { EditLprecio };
