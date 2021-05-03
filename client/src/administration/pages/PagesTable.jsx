import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import PageRow from "./PageRow";
import SmallButton from "../../components/buttons/SmallButton";
import NewPageModal from "../../components/modals/NewPageModal";
import NavbarSloths from "../../navigation/NavSloths";
import { usePagesContext } from "../../App";
import { getAuth } from "../../utils/functions";

const PageTable = () => {
  const { pages, setPages } = usePagesContext();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prev) => !prev);

  const columns = new Map([
    // field: heading
    ["title", "Title"],
    ["path", "Path"],
    ["description", "Description"],
    ["created_by", "Author"],
    ["published", "Published"],
    // ["history", "History"], // TODO
    ["remove", "Remove"],
    ["export", "Export"],
    ["open", ""],
  ]);

  const hasEditPermission = getAuth()?.user.isAdmin;

  if (!hasEditPermission) {
    columns.delete("published");
    columns.delete("remove");
  }

  const headers = [...columns.values()];
  const fields = [...columns.keys()];
  console.log(pages);
  return (
    <div style={{ margin: "16px" }}>
      <h1>Pages table</h1>
      {/*{hasEditPermission && <NavbarSloths pages={pages} setPages={setPages} />}*/}
      <Table responsive>
        <thead>
          <tr>
            {headers.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <PageRow
              page={page}
              setPages={setPages}
              fields={fields}
              hasEditPermission={hasEditPermission}
            />
          ))}
        </tbody>
      </Table>
      {/*{hasEditPermission && (*/}
      <SmallButton onClick={toggleModal}>Create new Page</SmallButton>
      {/*)}*/}
      {showModal && <NewPageModal onHide={toggleModal} setPages={setPages} />}
    </div>
  );
};

export default PageTable;
