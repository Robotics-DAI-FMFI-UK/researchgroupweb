import React, { useState } from "react";
import { useLocation } from "react-router";
import { getAuth } from "./utils/functions";
import SmallButton from "./components/buttons/SmallButton";
import NewPageModal from "./components/modals/NewPageModal";
import { usePagesContext } from "./App";

const Page404 = () => {
  const { pathname } = useLocation();
  const { pages } = usePagesContext();

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  if (pages.find((page) => page.path === pathname)) {
    // path is freshly created
    // so we don't want to render Page404
    return null;
  }

  return (
    <>
      <h2 className="pt-5">Page not found</h2>
      <h5 className="pb-3">
        Not match for <code>{pathname}</code>
      </h5>
      {getAuth() && (
        <SmallButton onClick={toggleModal}>
          Create new page with the path
        </SmallButton>
      )}
      {showModal && <NewPageModal onHide={toggleModal} path={pathname} />}
    </>
  );
};

export default Page404;
