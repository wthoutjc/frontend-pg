import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

import { decode } from "next-auth/jwt";

// Interfaces
import { IUser } from "./interfaces";

const secret = process.env.NEXTAUTH_SECRET!;

export async function middleware(req: NextRequest) {
  const token = await decode({
    token: req.cookies.get("next-auth.session-token")?.value,
    secret,
  });
  const { user } = (token as { user: IUser; accessToken: string }) || {};

  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  const sellerPages =
    req.nextUrl.pathname.startsWith("/cotizaciones") ||
    req.nextUrl.pathname.startsWith("/nuevo-pedido") ||
    req.nextUrl.pathname.startsWith("/pedidos") ||
    req.nextUrl.pathname.startsWith("/pedidos-bodegas") ||
    req.nextUrl.pathname.startsWith("/Vendedor") ||
    req.nextUrl.pathname.startsWith("/vlprecios") ||
    req.nextUrl.pathname.startsWith("/agenda") ||
    req.nextUrl.pathname.startsWith("/presupuestos")

  if (isAuthPage) {
    if (isAuth) {
      const url = req.nextUrl.clone();
      url.pathname = `${user.hierarchy}`;
      return NextResponse.redirect(url);
    }
    return null;
  }

  if (isAuth) {
    switch (user.hierarchy) {
      case "Admin":
        if (
          sellerPages ||
          req.nextUrl.pathname.startsWith("/Despachador") ||
          req.nextUrl.pathname.startsWith("/Facturador") ||
          req.nextUrl.pathname.startsWith("/CEO")
        ) {
          const url = req.nextUrl.clone();
          url.pathname = "/Admin";
          return NextResponse.redirect(url);
        }
        break;
      case "CEO":
        if (
          sellerPages ||
          req.nextUrl.pathname.startsWith("/Despachador") ||
          req.nextUrl.pathname.startsWith("/Facturador") ||
          req.nextUrl.pathname.startsWith("/Admin")
        ) {
          const url = req.nextUrl.clone();
          url.pathname = "CEO";
          return NextResponse.redirect(url);
        }
        break;
      case "Despachador":
        if (
          sellerPages ||
          req.nextUrl.pathname.startsWith("/CEO") ||
          req.nextUrl.pathname.startsWith("/Facturador") ||
          req.nextUrl.pathname.startsWith("/Admin")
        ) {
          const url = req.nextUrl.clone();
          url.pathname = "Despachador";
          return NextResponse.redirect(url);
        }
        break;
      case "Facturador":
        if (
          sellerPages ||
          req.nextUrl.pathname.startsWith("/CEO") ||
          req.nextUrl.pathname.startsWith("/Despachador") ||
          req.nextUrl.pathname.startsWith("/Admin")
        ) {
          const url = req.nextUrl.clone();
          url.pathname = "Facturador";
          return NextResponse.redirect(url);
        }
        break;
      case "Vendedor":
        if (
          !sellerPages &&
          !req.nextUrl.pathname.startsWith("/claims") &&
          !req.nextUrl.pathname.startsWith("/FAQ") &&
          !req.nextUrl.pathname.startsWith("/account") &&
          !req.nextUrl.pathname.startsWith("/logout")
        ) {
          const url = req.nextUrl.clone();
          url.pathname = "Vendedor";
          return NextResponse.redirect(url);
        }
        break;
      default:
        return NextResponse.redirect(new URL(`/${user.hierarchy}`, req.url));
    }
  } else {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
}

export default withAuth({});

export const config = {
  matcher: [
    "/account",
    "/Admin",
    "/agenda",
    "/auth/:path*",
    "/bodegas",
    "/CEO",
    "/claims",
    "/clients",
    "/cotizaciones",
    "/Despachador",
    "/Facturador",
    "/FAQ",
    "/gbodegas",
    "/gpedidos",
    "/lprecios",
    "/nuevo-pedido",
    "/pedidos",
    "/pedidos-bodegas",
    "/users",
    "/Vendedor",
    "/vlprecios",
    "/zones",
    "/presupuestos",
    "/logout",
  ],
};
