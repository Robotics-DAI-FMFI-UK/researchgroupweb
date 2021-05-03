import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import useGetAxios from "../../utils/hooks/useGetAxios";
import { FetchError, FetchLoading } from "../../components/Fetchers";
import UserRow from "./UserRow";
import SmallButton from "../../components/buttons/SmallButton";
import AuthModal from "../../authorization/AuthModal";
import { getAuth } from "../../utils/functions";

const UsersTable = () => {
  const { data, isLoaded, error } = useGetAxios("/users");

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prev) => !prev);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  if (error) return <FetchError e={error.message} />;
  if (!isLoaded || !data) return <FetchLoading />;

  const columns = new Map([
    // field: heading
    ["avatar", ""],
    ["name", "Name"],
    ["email", "email"],
    ["isAdmin", "Admin"],
    ["register_date", "Register"],
    // ["pages", "Pages"], // TODO
    ["remove", "Remove"],
  ]);

  const hasEditPermission = getAuth()?.user.isAdmin;

  if (!hasEditPermission) {
    columns.delete("isAdmin");
    columns.delete("remove");
  }

  const headers = [...columns.values()];
  const fields = [...columns.keys()];

  return (
    <div style={{ margin: "16px" }}>
      <h1>Users table</h1>
      <Table responsive>
        <thead>
          <tr>
            {headers.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              user={user}
              fields={fields}
              setUsers={setUsers}
              hasEditPermission={hasEditPermission}
            />
          ))}
        </tbody>
      </Table>
      {hasEditPermission && (
        <SmallButton onClick={toggleModal}>Create new user</SmallButton>
      )}
      {showModal && (
        <AuthModal action="register" onHide={toggleModal} setUsers={setUsers} />
      )}
    </div>
  );
};

export default UsersTable;
