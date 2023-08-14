import { ConnectedLayout, PresupuestosVendedor } from "../../components";

const PresupuestosPage = () => {
  return (
    <ConnectedLayout title={"Presupuestos - Company S.A.S"}>
      <PresupuestosVendedor />
    </ConnectedLayout>
  );
};

export default PresupuestosPage;
