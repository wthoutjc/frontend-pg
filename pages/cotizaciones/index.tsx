import { useRouter } from "next/router";
import { useEffect } from "react";

const CotizacionesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/pedidos");
  }, [router]);

  return;
};

export default CotizacionesPage;
