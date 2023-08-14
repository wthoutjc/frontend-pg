import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import NextLink from "next/link";
import {
  Typography,
  Tooltip as MUITooltip,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Link,
  CircularProgress,
} from "@mui/material";

// Date
import moment from "moment";

//Charts
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, ArcElement, defaults } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip);
defaults.color = "white";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Services
import { getZone, getPresupuestoZona } from "../../services";

// Components
import { ZonaSkeleton, EditZona, Table } from "../../components";

// Utils
import { currencyFormatThousands } from "../../utils";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Tools
import { toPng } from "html-to-image";

const DATA = (meta: number, ventas: number) => {
  return {
    labels: ["Falta", "Alcanzado"],
    datasets: [
      {
        data: [ventas ? (meta - ventas < 0 ? 0 : meta - ventas) : meta, ventas],
        backgroundColor: ["rgba(26, 53, 80, 0.897)", "#66bb6a"],
        hoverBackgroundColor: ["rgba(26, 53, 80, 0.897)", "#66bb6a"],
        borderRadius: 3,
        zIndex: 1,
        borderColor: ["rgba(26, 53, 80, 0.897)", "#009432"],
        hoverOffset: 3,
      },
    ],
  };
};

interface Props {
  id: string;
  deleteZone: string;
  editZone: string;
}

interface ZonaResponse {
  budget: {
    mes: number;
    bimestre: number;
  };
  reached: {
    mes: {
      pesos: number;
      kg: number;
    };
    bimestre: {
      pesos: number;
      kg: number;
    };
  };
  seller: [number, string];
  departments: string[][];
  zone: [number, string];
  rendimiento: string[][];
}

const Zona = ({ id, deleteZone, editZone }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);

  const [mode, setMode] = useState<{
    delete: boolean;
    edit: boolean;
  }>({
    delete: deleteZone === "true",
    edit: editZone === "true",
  });

  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );
  const [month, setMonth] = useState<{
    now: number;
    current: number;
  }>({
    now: Number(moment(Date.now()).format("M")),
    current: Number(moment(Date.now()).format("M")),
  });

  const [infoZona, setInfoZona] = useState<ZonaResponse | null>(null);
  const [presupuestoZona, setPresupuestoZona] = useState<string[][]>([]);

  const htmlRef = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);
  const [lineModeView, setLineModeView] = useState<"pesos" | "kg">("pesos");

  const [loading, setLoading] = useState(true);

  const htmlToImage = () => {
    if (htmlRef.current) {
      setLoading(true);
      toPng(htmlRef.current).then((dataUrl) => {
        setLoading(false);
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img && infoZona) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Zona ${infoZona.zone[1]}""`,
          section: "share",
          type: "share",
          info: {
            title: `${infoZona.zone[1]} - Company S.A.S.`,
            text: `Zona ${infoZona.zone[1]}: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  const htmlToImageCallback = useCallback(() => {
    htmlToImage();
  }, []);

  useEffect(() => {
    if (infoZona) {
      const timeoutId = setTimeout(htmlToImageCallback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [infoZona, htmlToImageCallback]);

  useEffect(() => {
    const nameMonths = Array.from(
      { length: month.now },
      (_, index) => index + 1
    ).map((month) => moment(`${month}`, "M").format("MMMM"));
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
  }, [month]);

  useEffect(() => {
    setInfoZona(null);
    getZone(id, month.current).then((res) => {
      const { budget, departments, seller, zone, reached, rendimiento } = res;
      setInfoZona({
        budget,
        departments,
        seller,
        zone,
        reached,
        rendimiento,
      });
      getPresupuestoZona(Number(id)).then(({ ok, presupuesto }) => {
        setPresupuestoZona(presupuesto);
      });
    });
  }, [id, month]);

  useEffect(() => {
    if (mode.delete && infoZona) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deleteZona",
          title: `BORRAR ${infoZona?.zone[1]}`,
          info: infoZona?.zone,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode.delete, dispatch, infoZona]);

  if (mode.edit && infoZona)
    return (
      <EditZona
        zone={infoZona.zone}
        departmentsR={infoZona.departments}
        callback={() => setMode({ ...mode, edit: false })}
      />
    );

  return (
    <>
      {infoZona ? (
        <Box
          sx={{
            p: isMobile ? 0 : 1,
            pt: 0,
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Head>
            <meta
              property="og:title"
              content={`${infoZona.zone[1]} - Company S.A.S.`}
            />
            <meta
              property="og:description"
              content={`Información de zona ${infoZona.zone[1]}`}
            />
            <meta
              property="og:image"
              content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
            />
          </Head>
          <Box
            sx={{
              backgroundColor: "#001122",
              borderRadius: isMobile ? 0 : 3,
              overflow: "hidden",
              height: "inherit",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                overflow: "auto",
                height: "inherit",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  mb: 1,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  fontSize={isMobile ? "0.8rem" : "1rem"}
                  sx={{
                    width: isMobile ? "100%" : "40%",
                    mb: isMobile ? 2 : 0,
                  }}
                >
                  {infoZona.zone &&
                  Array.isArray(infoZona.zone) &&
                  infoZona.zone.length > 0
                    ? infoZona.zone[1]
                    : "Error al carga la información"}
                </Typography>
                {month && date && (
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id="select-month">Mes</InputLabel>
                    <Select
                      labelId="select-month"
                      label="Mes"
                      value={month.current}
                      onChange={(e) =>
                        setMonth({
                          ...month,
                          current: Number(e.target.value),
                        })
                      }
                    >
                      {date.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Box
                  sx={{
                    height: "fit-content",
                    width: isMobile ? "100%" : "20%",
                    mr: isMobile ? 0 : 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: isMobile ? "flex-start" : "space-evenly",
                      mb: 2,
                    }}
                  >
                    <Chip
                      size={isMobile ? "small" : "medium"}
                      label="Zona"
                      color="primary"
                      variant="filled"
                      sx={{
                        mr: isMobile ? 2 : 0,
                      }}
                    />
                    <Chip
                      size={isMobile ? "small" : "medium"}
                      label="Activa"
                      color="success"
                      variant="filled"
                    />
                  </Box>
                  {infoZona.zone ? (
                    <Box
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 3,
                        borderTop: "3px solid #badc58",
                        p: isMobile ? 1 : 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        Información de la zona
                      </Typography>
                      <Typography variant="body2">
                        {infoZona.zone[1]} • {infoZona.zone[0]}
                      </Typography>
                    </Box>
                  ) : (
                    "Sin información, error."
                  )}
                  <Box
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 3,
                      borderTop: "3px solid #f6e58d",
                      p: isMobile ? 1 : 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      Vendedor asignado
                    </Typography>
                    {infoZona.seller ? (
                      <NextLink href={`/users/${infoZona.seller[0]}`}>
                        <Link>
                          <Typography
                            variant="body2"
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {infoZona.seller
                              ? infoZona.seller[1]
                              : "Sin vendedor asignado"}
                          </Typography>
                        </Link>
                      </NextLink>
                    ) : (
                      <Typography variant="body2">
                        Sin vendedor asignado
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 3,
                      borderTop: "3px solid #60a3bc",
                      p: isMobile ? 1 : 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#112233",
                      }}
                    >
                      Departamentos asignados
                    </Typography>
                    {infoZona.departments &&
                    Array.isArray(infoZona.departments) &&
                    infoZona.departments.length > 0 ? (
                      infoZona.departments.map((info, index) => (
                        <Typography key={index} variant="body2">
                          {info[1]}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2">
                        Sin departamentos asignados
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 3,
                      borderTop: "3px solid #45aaf2",
                      p: isMobile ? 1 : 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      Presupuesto de la zona
                    </Typography>
                    <Typography variant="body2">
                      Mes:{" "}
                      <strong>
                        ${" "}
                        {infoZona.budget && infoZona.budget.mes
                          ? currencyFormatThousands(String(infoZona.budget.mes))
                          : "Sin presupuesto"}
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      Bimestre:{" "}
                      <strong>
                        ${" "}
                        {infoZona.budget && infoZona.budget.bimestre
                          ? currencyFormatThousands(
                              String(infoZona.budget.bimestre)
                            )
                          : "Sin presupuesto"}
                      </strong>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 3,
                      borderTop: "3px solid #8e44ad",
                      p: isMobile ? 1 : 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        mb: 1,
                      }}
                    >
                      Opciones
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={isMobile ? 13 : 14} />
                      ) : (
                        <MUITooltip title="Compartir">
                          <IconButton size={"small"} onClick={handleShare}>
                            <ShareIcon
                              fontSize={isMobile ? "small" : "medium"}
                            />
                          </IconButton>
                        </MUITooltip>
                      )}
                      <MUITooltip title="Editar">
                        <IconButton
                          size={"small"}
                          onClick={() =>
                            setMode({
                              ...mode,
                              edit: true,
                            })
                          }
                        >
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </MUITooltip>
                      <MUITooltip title="Eliminar">
                        <IconButton
                          size={"small"}
                          sx={{
                            backgroundColor: "#d63031",
                            ":hover": {
                              backgroundColor: "#b71c1c",
                            },
                          }}
                          onClick={() => setMode({ ...mode, delete: true })}
                        >
                          <DeleteIcon
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        </IconButton>
                      </MUITooltip>
                    </Box>
                  </Box>
                </Box>
                <Box
                  ref={htmlRef}
                  sx={{
                    width: isMobile ? "100%" : "30%",
                    height: "fit-content",
                    backgroundColor: "#112233",
                    borderRadius: 3,
                    p: isMobile ? 1 : 2,
                    mr: isMobile ? 0 : 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    mb: isMobile ? 2 : 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    fontSize={isMobile ? 12 : 14}
                    textAlign={"center"}
                  >
                    Metas para la zona {infoZona.zone[1]}
                  </Typography>
                  <Box
                    sx={{
                      width: isMobile ? "100%" : "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      textAlign={"center"}
                      sx={{ mb: 2 }}
                      fontSize={isMobile ? 11 : 12}
                    >
                      Mes
                    </Typography>
                    <Box
                      sx={{
                        maxWidth: isMobile ? "100px" : "200px",
                      }}
                    >
                      <Doughnut
                        data={DATA(
                          infoZona.budget && infoZona.budget.mes
                            ? infoZona.budget.mes
                            : 0,
                          infoZona.reached && infoZona.reached.mes
                            ? infoZona.reached.mes.pesos
                            : 0
                        )}
                        options={{
                          cutout: isMobile ? 25 : 45,
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                          elements: {
                            arc: {
                              borderWidth: 0,
                            },
                          },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mr: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#66bb6a",
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontSize={isMobile ? 10 : 12}
                          color="text.secondary"
                        >
                          Alcanzado
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "rgba(26, 53, 80, 0.897)",
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontSize={isMobile ? 10 : 12}
                          color="text.secondary"
                        >
                          Falta
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        width: "45%",
                      }}
                      textAlign={"center"}
                      fontSize={isMobile ? 10 : 12}
                    >
                      Total dinero:{" "}
                      <strong>
                        ${" "}
                        {infoZona.reached && infoZona.reached.mes
                          ? currencyFormatThousands(
                              infoZona.reached.mes.pesos || 0
                            )
                          : 0}
                      </strong>
                    </Typography>
                    <Divider orientation="vertical" />
                    <Typography
                      variant="body2"
                      sx={{
                        width: "45%",
                      }}
                      textAlign={"center"}
                      fontSize={isMobile ? 10 : 12}
                    >
                      Total kg:{" "}
                      <strong>
                        {infoZona.reached && infoZona.reached.mes
                          ? currencyFormatThousands(
                              infoZona.reached.mes.kg || 0
                            )
                          : 0}{" "}
                        kg
                      </strong>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      textAlign={"center"}
                      sx={{ mb: 2 }}
                    >
                      Bimestre
                    </Typography>
                    <Box
                      sx={{
                        maxWidth: isMobile ? "100px" : "200px",
                      }}
                    >
                      <Doughnut
                        data={DATA(
                          infoZona.budget && infoZona.budget.bimestre
                            ? infoZona.budget.bimestre
                            : 0,
                          infoZona.reached && infoZona.reached.bimestre
                            ? infoZona.reached.bimestre.pesos
                            : 0
                        )}
                        options={{
                          cutout: isMobile ? 25 : 45,
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                          elements: {
                            arc: {
                              borderWidth: 0,
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          mr: 2,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#66bb6a",
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontSize={isMobile ? 10 : 12}
                          color="text.secondary"
                        >
                          Alcanzado
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "rgba(26, 53, 80, 0.897)",
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontSize={isMobile ? 10 : 12}
                          color="text.secondary"
                        >
                          Falta
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        width: "45%",
                      }}
                      fontSize={isMobile ? 10 : 12}
                      textAlign={"center"}
                    >
                      Total dinero:{" "}
                      <strong>
                        ${" "}
                        {infoZona.reached && infoZona.reached.bimestre
                          ? currencyFormatThousands(
                              infoZona.reached.bimestre.pesos
                            )
                          : 0}
                      </strong>
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      variant="body2"
                      sx={{
                        width: "45%",
                      }}
                      fontSize={isMobile ? 10 : 12}
                      textAlign={"center"}
                    >
                      Total kg:{" "}
                      <strong>
                        {infoZona.reached && infoZona.reached.bimestre
                          ? currencyFormatThousands(
                              infoZona.reached.bimestre.kg
                            )
                          : 0}{" "}
                        kg
                      </strong>
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: isMobile ? "100%" : "50%",
                    backgroundColor: "#112233",
                    borderRadius: 3,
                    p: isMobile ? 1 : 2,
                    overflow: "hidden",
                    height: "fit-content",
                  }}
                >
                  <Typography
                    variant="body1"
                    textAlign={"center"}
                    sx={{ mb: 2, mt: 2 }}
                    fontWeight={600}
                  >
                    Rendimiento anual
                  </Typography>
                  <Box
                    sx={{
                      boxShadow: "0px 0px 5px 1px #001122",
                      borderRadius: 3,
                      overflow: "hidden",
                      width: "95%",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                      }}
                    >
                      <FormControl variant="outlined" fullWidth size="small">
                        <InputLabel id="select-month">Vista</InputLabel>
                        <Select
                          labelId="select-month"
                          label="Vista"
                          value={lineModeView}
                          onChange={(e) =>
                            setLineModeView(e.target.value as "pesos" | "kg")
                          }
                        >
                          <MenuItem value={"pesos"}>Dinero</MenuItem>
                          <MenuItem value={"kg"}>Kilos</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Line
                      style={{
                        padding: "10px",
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: "Mes",
                              font: {
                                family: "Montserrat",
                                size: 14,
                              },
                            },
                            grid: {
                              display: true,
                              color: "#2d3436",
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text:
                                lineModeView === "pesos" ? "Pesos" : "Kilos",
                              font: {
                                family: "Montserrat",
                                size: 14,
                              },
                            },
                            grid: {
                              display: true,
                              color: "#2d3436",
                            },
                          },
                        },
                      }}
                      data={{
                        labels: infoZona.rendimiento.map((data) => data[0]),
                        datasets: [
                          {
                            label: "Rendimiento",
                            fill: false,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 2,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "#112233",
                            pointHoverBorderColor: "white",
                            pointHoverBorderWidth: 1,
                            pointRadius: 3,
                            data:
                              lineModeView === "pesos"
                                ? infoZona.rendimiento.map((data) => data[1])
                                : infoZona.rendimiento.map((data) => data[2]),
                          },
                        ],
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      overflow: "auto",
                      width: "100%",
                    }}
                  >
                    <Table
                      title={`Presupuesto zona`}
                      columns={["Mes", "Presupuesto"]}
                      to="none"
                      loading={!presupuestoZona}
                      data={presupuestoZona}
                      context={{
                        read: {
                          enabled: false,
                        },
                        update: {
                          enabled: false,
                        },
                        delete: {
                          enabled: false,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <ZonaSkeleton isMobile={isMobile} />
      )}
    </>
  );
};

export { Zona };
