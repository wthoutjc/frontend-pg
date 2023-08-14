import { useState, useMemo } from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

// Next Tools
import { useRouter } from "next/router";
import NextLink from "next/link";

// Redux
import { useAppSelector } from "../../../hooks";

const words: { [key: string]: string } = {
  gbodegas: "Gestor de bodegas",
  gpedidos: "Gestor de pedidos",
  users: "Usuarios",
  lprecios: "Listas de precios",
  zones: "Zonas",
  clients: "Clientes",
  bodegas: "Bodegas",
  "new-user": "Nuevo usuario",
  "new-client": "Nuevo cliente",
  "new-zone": "Nueva zona",
  "new-lp": "Nueva lista de precios",
  "new-bodega": "Nueva bodega",
  "nuevo-pedido": "Nuevo pedido",
  pedidos: "Pedidos",
  agenda: "Agenda",
  vlprecios: "Listas de precios",
  cotizaciones: "Cotización",
  account: "Mi cuenta",
  "pedidos-bodegas": "Pedidos de bodegas",
  Admin: "Administrador",
  "verify-email": "Verificar correo electrónico",
  "restore-password": "Restaurar contraseña",
  "register-lp": "Registrar lista de precios",
  "register-presupuesto": "Registrar presupuesto",
  "register-pedido": "Registrar pedido",
  claims: "Reclamaciones",
  "new-claim": "Registrar reclamación",
  "clean-cache": "Limpiar cache",
  presupuestos: "Presupuestos",
  logout: "Cerrar sesión",
};

const WordTranslate = (word: string): string => {
  return words[word] || word;
};

const BreadcrumbsC = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [paths, setPaths] = useState<string[]>([]);
  const [to, setTo] = useState<string[]>([]);

  const router = useRouter();
  const { asPath } = router;

  useMemo(() => {
    const hasQueryParams = router.asPath.split("?").length > 1;
    let calc: string[] = [];

    if (hasQueryParams) calc = asPath.split("?")[0].split("/").slice(1);
    else calc = asPath.split("/").slice(1);

    setPaths(calc);
    setTo(calc.map((path, index) => calc.slice(0, index + 1).join("/")));
  }, [asPath, router]);

  return (
    <Box sx={isMobile ? { p: 0.4 } : { p: 1, boxSizing: "border-box" }}>
      <Breadcrumbs
        sx={{
          color: "gray",
          display: "flex",
          width: "fit-content",
          borderRadius: 5,
          p: 0.5,
          pl: 2,
          pr: 2,
          backgroundColor: "#112233",
        }}
      >
        {paths?.map((path, index) =>
          index + 1 === paths.length ? (
            <Typography
              key={path}
              color="white"
              fontSize={isMobile ? 12 : 14}
              fontWeight={600}
            >
              {WordTranslate(path)}
            </Typography>
          ) : (
            <NextLink key={path} href={`/${to[index]}`} passHref>
              <Typography
                key={path}
                color="white"
                fontSize={isMobile ? 11 : 14}
              >
                {WordTranslate(path)}
              </Typography>
            </NextLink>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
};

export { BreadcrumbsC };
