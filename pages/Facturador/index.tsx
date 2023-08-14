import { ConnectedLayout, Facturador } from "../../components";

const AdminPage = () => {
  return (
    <ConnectedLayout title={"Home - Company S.A.S"}>
      <Facturador />
    </ConnectedLayout>
  );
};

export default AdminPage;
