import React, { useEffect, useState } from "react";
import SmallButton from "../components/buttons/SmallButton";

import axios from "axios";
import { NavSloth } from "./NavSloth";
import { getAuth, getErrorMsg, objectId } from "../utils/functions";
import { usePagesContext } from "../App";
import MyGridLayout from "../components/MyGridLayout";
import { RiDownloadFill } from "react-icons/ri";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useToastContext } from "../providers/ToastProvider";
import useWarning from "../utils/hooks/useWarning";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";

const NavSloths = () => {
  const { setSuccessToast, setErrorToast } = useToastContext();
  const [warning, setWarning] = useWarning();

  const { pages } = usePagesContext();
  const options = pages.map((page) => {
    return {
      value: page._id,
      label: page.title,
    };
  });

  const [layout, setLayout] = useState({ lg: [] });
  const [items, setItems] = useState();

  const [exportData, setExportData] = useState();
  const [filename, setFilename] = useState("Import form local file");

  const [publishedId, setPublishedId] = useState();
  const [currentId, setCurrentId] = useState();
  const [navbarVersions, setNavbarVersions] = useState([]);

  const loadNavbarData = (data) => {
    console.log("data", data);
    const load_items = [];
    const load_layout = [];

    data.items.forEach((item) => {
      const item_pages = [];
      item.pages.forEach((pageId) => {
        const page = pages.find((p) => p._id === pageId);
        if (page) {
          item_pages.push({
            value: page._id,
            label: page.title,
          });
        }
      });

      load_items.push({
        ...item,
        pages: item_pages,
      });

      load_layout.push({
        i: item._id,
        x: item.x,
        ...why,
      });
    });

    load_items.sort((a, b) => a.x - b.x);

    console.log("load_items", load_items);
    console.log("load_layout", load_layout);
    setCurrentId(data._id);

    setItems(load_items);
    setLayout({ lg: load_layout });
  };

  useEffect(() => {
    axios
      .get("/navbars")
      .then((res) => {
        setNavbarVersions(res.data);
      })
      .catch((e) => {
        console.log("error", e);
      });

    axios
      .get("/navbars/published")
      .then((res) => {
        loadNavbarData(res.data);
        setPublishedId(res.data._id);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  useEffect(() => {
    if (layout.lg.length && items) {
      setExportData(processExportData());
    }
  }, [layout, items]);

  const onLayoutChange = (layout, layouts) => {
    setLayout(layouts);
  };

  const processExportData = () => {
    let sortLayout = layout.lg;
    sortLayout.sort((a, b) => a.x - b.x);

    const arr = sortLayout.map((position) => {
      const item = getItem(position.i);
      if (!item) return "";
      if (item.pages.length === 0) {
        return "";
      }
      if (item.pages.length === 1) {
        return getPageTitle(item.pages[0].value);
      }
      const titles = item.pages.map((page) => getPageTitle(page.value));
      return [item.name, ...titles];
    });

    // console.log("arr", arr);
    return arr.filter((a) => a);
  };

  const save = () => {
    let sortLayout = layout.lg;
    sortLayout.sort((a, b) => a.x - b.x);

    const updatedItems = sortLayout.map((position) => {
      const item = getItem(position.i);
      return {
        // _id: sloth.i,
        x: position.x,
        pages: item?.pages?.map((page) => page.value) || [],
        name: item?.name,
      };
    });

    console.log("updatedItems", updatedItems);
    // return;

    axios
      .post("/navbars", {
        created_by: getAuth()?.user._id,
        items: updatedItems,
      })
      .then((res) => {
        setSuccessToast("Navbar saved successfully");
        setNavbarVersions((prev) => [...prev, res.data]);
        setWarning(false);
        setCurrentId(res.data._id);
        console.log(res);
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
      });
  };

  const getItem = (i) => {
    return items.find((item) => item._id === i);
  };

  const getPageTitle = (i) => {
    return pages.find((page) => page._id === i).title;
  };

  const processImportData = (importData) => {
    console.log(importData);

    setLayout({ lg: [] });

    const import_items = [];
    const import_layout = [];

    for (let x = 0; x < MAX_SLOTHS; x++) {
      if (x > importData.length - 1) {
        const newId = objectId();

        import_items.push({
          _id: newId,
          name: "",
          pages: [],
        });

        import_layout.push({
          i: newId,
          x: x,
          ...why,
        });
        continue;
      }

      const item = importData[x];

      if (typeof item === "string") {
        const page = pages.find((page) => page.title === item);
        const item_pages = [
          {
            value: page._id,
            label: page.title,
          },
        ];

        const newId = objectId();

        import_items.push({
          _id: newId,
          name: "",
          pages: item_pages,
        });

        import_layout.push({
          i: newId,
          x: x,
          ...why,
        });
      } else {
        const item_pages = [];
        for (let i = 1; i < item.length; i++) {
          const page = pages.find((page) => page.title === item[i]);
          item_pages.push({
            value: page._id,
            label: page.title,
          });
        }

        const newId = objectId();

        import_items.push({
          _id: newId,
          name: item[0],
          pages: item_pages,
        });

        import_layout.push({
          i: newId,
          x: x,
          ...why,
        });
      }
    }

    console.log("import_items", import_items);
    console.log("import_layout", import_layout);

    setItems(import_items);
    setLayout({ lg: import_layout });
    setWarning(true);
  };

  const onUploadChange = async (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    if (!file) return;

    setFilename(file.name);
    // e.preventDefault();
    // return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios
        .post("/navbars/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          processImportData(res.data.readFile);
        })
        .catch((err) => {
          console.log("err", err);
          setErrorToast(getErrorMsg(err));
        });
    } catch (err) {
      console.log("err", err);
      setErrorToast("Upload failed");
    }
  };

  async function publishVersion(data) {
    loadNavbarData(data);
    setWarning(false);
    setPublishedId(data._id);

    await axios
      .patch("/navbars", {
        currentId: data._id,
        prevId: publishedId,
      })
      .then((res) => {
        setSuccessToast("change published navbar");
      })
      .catch((err) => {
        console.log("err", err);
        setErrorToast(getErrorMsg(err));
      });
  }

  async function changeVersion(data) {
    loadNavbarData(data);
    setWarning(false);
  }

  async function removeVersion(data) {
    if (data._id === publishedId) {
      setErrorToast("cannot remove current version");
      return;
    }

    await axios
      .delete("/navbars/" + data._id)
      .then((res) => {
        setSuccessToast("remove versions succeeded");
        setNavbarVersions((prevState) => {
          return prevState.filter((nav) => nav._id !== data._id);
        });
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
      });
  }

  return (
    <div className="full-width p-4">
      <div className="d-xl-none">
        <h6>
          You have to use larger display to be able to modify content of
          navigation bar
        </h6>
      </div>
      <Row
        style={{
          width: "1000px",
          minWidth: "800px",
          // maxHeight: "66px",
          // height: "300px",
        }}
        className="d-none d-xl-block"
      >
        <Col xs="3">
          {navbarVersions.map((version, i) => {
            return (
              <ButtonGroup className="d-block">
                <SmallButton
                  onClick={() => removeVersion(version)}
                  variant="link"
                >
                  <span>&times;</span>
                </SmallButton>
                <SmallButton
                  onClick={() => changeVersion(version)}
                  variant="link"
                >
                  <span
                    style={{
                      color: version._id === currentId ? "red" : "blue",
                      // textDecoration: version._id === currentId && "underline",
                    }}
                  >
                    {version.create_date.substr(0, 16).replace("T", ", ")}
                  </span>
                </SmallButton>

                {version._id === publishedId ? (
                  <span>*</span>
                ) : (
                  <SmallButton
                    onClick={() => publishVersion(version)}
                    variant="link"
                  >
                    publish
                  </SmallButton>
                )}
              </ButtonGroup>
            );
          })}
        </Col>
        <Col>
          <div>
            <ButtonGroup>
              <SmallButton onClick={save} disabled={!warning}>
                Save navbar
              </SmallButton>
              <SmallButton title="export">
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(exportData)
                  )}`}
                  download="data.json"
                >
                  <RiDownloadFill size={"18"} color={"white"} />
                </a>
              </SmallButton>
            </ButtonGroup>
          </div>
          <Form.File
            className="d-inline-block"
            custom
            label={filename}
            onChange={onUploadChange}
          />

          <MyGridLayout
            setWarning={setWarning}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 8 }}
            layouts={layout}
            onLayoutChange={onLayoutChange}
            compactType={compactType}
            preventCollision={!compactType}
            measureBeforeMount={!animated}
            useCSSTransforms={animated}
            draggableHandle=".handle"
            isBounded={true}
            isResizable={false}
            isDraggable={true}
            style={{ background: "transparent" }}
          >
            {layout.lg.map((sloth) => (
              <div key={sloth.i} style={{ background: "transparent" }}>
                <NavSloth
                  setWarning={setWarning}
                  item={getItem(sloth.i)}
                  setNavItems={setItems}
                  options={options}
                />
              </div>
            ))}
          </MyGridLayout>
        </Col>
      </Row>
    </div>
  );
};

const compactType = "horizontal";
const animated = true;

const MAX_SLOTHS = 8;
const why = { w: 1, h: 1, y: 0 };

// const getPlaceholder = () => {
//   const placeholder = [];
//   for (let x = 0; x < MAX_SLOTHS; x++) {
//     placeholder.push({ _id: objectId(), name: "", pages: [], x });
//   }
//   return placeholder;
// };
//
// const placeholder = getPlaceholder();

export default NavSloths;
