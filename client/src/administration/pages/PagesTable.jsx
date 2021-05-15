import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import PageRow from "./PageRow";
import SmallButton from "../../components/buttons/SmallButton";
import NewPageModal from "../../components/modals/NewPageModal";
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
    // ["history", "History"],
    ["remove", "Remove"],
    ["export", "Export"],
    ["open", ""],
  ]);

  // const hasEditPermission = getAuth()?.user.isAdmin;

  // if (!hasEditPermission) {
  //   columns.delete("published");
  //   columns.delete("remove");
  // }

  const headers = [...columns.values()];
  const fields = [...columns.keys()];

  return (
    <div style={{ margin: "16px" }}>
      <h1 className="d-inline-block">Pages table</h1>
      <SmallButton className="mb-3 mx-3" onClick={toggleModal}>
        Create new Page
      </SmallButton>

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
              // hasEditPermission={hasEditPermission}
            />
          ))}
        </tbody>
      </Table>
      <SmallButton onClick={toggleModal}>Create new Page</SmallButton>
      {showModal && (
        <NewPageModal
          onHide={toggleModal}
          setPages={setPages}
          redirect={false}
        />
      )}
    </div>
  );
};

export default PageTable;
