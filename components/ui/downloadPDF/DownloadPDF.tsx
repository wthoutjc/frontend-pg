import NextImage from "next/image";
import { Box, Typography } from "@mui/material";

// Interfaces
import { IInfoPedido, IInfoPedidoBodega } from "../../../interfaces";

// Utils
import {
  currencyFormatDecimals,
  currencyFormatThousands,
} from "../../../utils";

interface Props {
  idPedido: string;
  infoPedido?: IInfoPedido;
  infoPedidoBodega?: IInfoPedidoBodega;
  pedido: string[][];
}

const DownloadPDF = ({
  idPedido,
  infoPedido,
  infoPedidoBodega,
  pedido,
}: Props) => {
  return (
    <>
      <Box className="download-pdf">
        <Box className="download-header">
          <Box className="download-logos">
            <Box
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  mr: 2,
                }}
              >
                <NextImage
                  src="/images/company.jpeg"
                  width={80}
                  height={25}
                  alt="Company S.A.S."
                />
              </Box>
              <Box className="download-nit-num-pedido">
                <Typography
                  variant="h6"
                  fontSize={6}
                  fontFamily={"Times New Roman"}
                  fontWeight={800}
                >
                  NIT. 830 127 368-2
                </Typography>
                <h6>Nº {idPedido}</h6>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <NextImage
                src="/images/agrosal.jpeg"
                width={35}
                height={15}
                alt="Agrosal"
              />
              <Box
                sx={{
                  ml: 1,
                }}
              >
                <NextImage
                  src="/images/Rentasal.png"
                  width={60}
                  height={15}
                  alt="Rentasal Company S.A.S."
                />
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <Box>
                <NextImage
                  src="/images/vaca.jpeg"
                  width={17}
                  height={18}
                  alt="Company S.A.S."
                />
              </Box>
              <Box>
                <NextImage
                  src="/images/fedesal.jpeg"
                  width={20}
                  height={18}
                  alt="Fedesal"
                />
              </Box>
            </Box>
          </Box>
          <Box className="download-general-info">
            {infoPedidoBodega && (
              <>
                <>
                  <Box className="download-name-client">
                    <Typography
                      variant="h6"
                      fontSize={6}
                      fontFamily={"Times New Roman"}
                      fontWeight={800}
                    >
                      Bodega: {infoPedidoBodega.nameBodega}
                    </Typography>
                  </Box>
                  <Box className="download-name-seller">
                    <Typography
                      variant="h6"
                      fontSize={6}
                      fontFamily={"Times New Roman"}
                      fontWeight={800}
                    >
                      Nombre vendedor: {infoPedidoBodega.nameSeller}
                    </Typography>
                  </Box>
                  <Box className="download-fecha-pedido">
                    <Typography
                      variant="h6"
                      fontSize={6}
                      fontFamily={"Times New Roman"}
                      fontWeight={800}
                    >
                      Fecha: {infoPedidoBodega.date}
                    </Typography>
                  </Box>
                </>
              </>
            )}
            {infoPedido && (
              <>
                <Box className="download-name-client">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Cliente: {infoPedido.nameClient}
                  </Typography>
                </Box>
                <Box className="download-id-client">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    NIT ó C.C.: {infoPedido.idClient}
                  </Typography>
                </Box>
                <Box className="download-direccion-client">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Dirección: {infoPedido.clientAddress}
                  </Typography>
                </Box>
                <Box className="download-phone-client">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Celular ó Teléfono: {infoPedido.clientPhone}
                  </Typography>
                </Box>
                {infoPedido.clientCity && (
                  <Box className="download-city-client">
                    <Typography
                      variant="h6"
                      fontSize={6}
                      fontFamily={"Times New Roman"}
                      fontWeight={800}
                    >
                      Ciudad: {infoPedido.clientCity}
                    </Typography>
                  </Box>
                )}
                <Box className="download-departamento-client">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Departamento: {infoPedido.clientDepartment}
                  </Typography>
                </Box>
                <Box className="download-name-seller">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Nombre vendedor: {infoPedido.nameSeller}
                  </Typography>
                </Box>
                <Box className="download-fecha-pedido">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    Fecha: {infoPedido.date}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box className="downlaod-table">
          <table className="table-pdf-download">
            <thead>
              <tr>
                {infoPedido
                  ? [
                      "Producto",
                      "Cnt",
                      "CntBnf",
                      "TKg",
                      "TKgBnf",
                      "VU",
                      "VT",
                      "VTBnf",
                    ].map((column, index) => {
                      return (
                        <td key={index}>
                          <h5>{column}</h5>
                        </td>
                      );
                    })
                  : ["Producto", "Cnt", "TKg"].map((column, index) => {
                      return (
                        <td key={index}>
                          <h5>{column}</h5>
                        </td>
                      );
                    })}
              </tr>
            </thead>
            <tbody>
              {pedido.map((row, index) => {
                return (
                  <tr key={index}>
                    {infoPedido
                      ? row?.slice(0, 8).map((dataRow, index) => {
                          return (
                            <td key={index}>
                              <p>{dataRow}</p>
                            </td>
                          );
                        })
                      : row?.slice(0, 3).map((dataRow, index) => {
                          return (
                            <td key={index}>
                              <p>{dataRow}</p>
                            </td>
                          );
                        })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        <Box className="downlaod-footer">
          <Box className="download-tyc">
            <p>
              AL MOMENTO DE FORMULAR ESTE PEDIDO EL CLIENTE DECLARA CONOCER Y
              ACEPTAR LAS CONDICIONES DE VENTA Y SU DESPACHO QUEDA SUJETO A LA
              APROBACION DE NUESTRO DEPARTAMENTO DE CREDITO
            </p>
          </Box>
          <Box className="download-specific-info">
            {infoPedidoBodega && (
              <>
                <Box className="download-tkgfact">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    TOTAL KG FACT.{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedidoBodega.totalKg)
                    )}
                  </Typography>
                </Box>
              </>
            )}
            {infoPedido && (
              <>
                <Box className="download-tkgfact">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    TOTAL KG FACT.{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.totalKg)
                    )}
                  </Typography>
                </Box>
                <Box className="download-tkgfactbonif">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    TOTAL KG BONIF.{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.totalKgBnf)
                    )}
                  </Typography>
                </Box>
                <Box className="download-subtotal">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    SUBTOTAL{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.totalPesos)
                    )}
                  </Typography>
                </Box>
                <Box className="download-iva">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    I.V.A.{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.iva)
                    )}
                  </Typography>
                </Box>
                <Box className="download-ivabonif">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    I.V.A. BONIF{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.ivaBnf)
                    )}
                  </Typography>
                </Box>
                <Box className="download-total">
                  <Typography
                    variant="h6"
                    fontSize={6}
                    fontFamily={"Times New Roman"}
                    fontWeight={800}
                  >
                    TOTAL{" "}
                    {currencyFormatThousands(
                      currencyFormatDecimals(infoPedido.total)
                    )}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box className="download-extra-info">
          <h3>
            Ubicación -
            www.company.com
          </h3>
          <h4>OBSERVACIONES: </h4>
          <h5> {infoPedido?.obs || infoPedidoBodega?.obs || "S/O"} </h5>
        </Box>
      </Box>
    </>
  );
};

export { DownloadPDF };
