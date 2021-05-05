import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Modal, Navbar as BsNavbar } from "react-bootstrap";
import { UserIcon } from "./user-icon/UserIcon";
import { useLocation } from "react-router";
import uuid from "react-uuid";
import NavBrand from "./NavBrand";
import axios from "axios";
import { NavDropdown } from "react-bootstrap";
import { getAuth } from "../utils/functions";
import { BsPencil } from "react-icons/bs";
import SmallButton from "../components/buttons/SmallButton";
import { Link } from "react-router-dom";
import { URL_PREFIX } from "../config";

const Navbar = ({ pages }) => {
  const location = useLocation();

  const [navItems, setNavItems] = useState([]);
  const hasEditPermission = getAuth()?.user.isAdmin;

  useEffect(() => {
    axios
      .get(`${URL_PREFIX}/navbars/published`)
      .then((res) => {
        const items = [];

        res.data.items.forEach((item) => {
          const itemPages = [];

          item.pages.forEach((pageId) => {
            const page = pages.find(
              (p) => p._id === pageId && (p.published || hasEditPermission)
            );
            if (page) {
              itemPages.push({
                path: page.path,
                title: page.title,
              });
            }
          });

          if (itemPages.length) {
            item.pages = itemPages;
            items.push(item);
          }
        });

        items.sort((a, b) => a.x - b.x);

        setNavItems(items);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  const CustomNavs = () => {
    return navItems.map((navItem) => (
      <div key={uuid()}>
        {navItem.pages.length === 1 ? (
          <Nav.Link
            as={Link}
            className="text-center"
            to={navItem.pages[0].path}
          >
            {navItem.pages[0].title}
          </Nav.Link>
        ) : (
          <DropDown navItem={navItem} />
        )}
      </div>
    ));
  };

  const DropDown = ({ navItem }) => {
    return (
      <NavDropdown
        title={navItem.name || "Dropdown"}
        key={navItem._id}
        id={navItem._id}
        className="text-center"
      >
        {navItem.pages.map((page) => {
          return (
            <NavDropdown.Item
              as={Link}
              to={page.path}
              key={page.path}
              className="text-center"
            >
              {page.title}
            </NavDropdown.Item>
          );
        })}
      </NavDropdown>
    );
  };

  return (
    <>
      <BsNavbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        style={{ zIndex: 1001, justifyContent: "flex-end" }}
      >
        <NavBrand />
        {/*<SearchBar />*/}
        <h6
          className="d-none d-xl-block"
          style={{
            marginBottom: "0",
            marginLeft: "100px",
            color: "white",
          }}
        >
          ROBOT GROUP, DAI FMFI UK
        </h6>
        <BsNavbar.Toggle />
        <BsNavbar.Collapse>
          <Nav className="ml-auto" navbar activeKey={location.pathname}>
            {hasEditPermission && (
              <SmallButton
                as={Link}
                to="/nav"
                title="edit navbar"
                className="pt-2"
              >
                <BsPencil size="15" color="white" />
              </SmallButton>
            )}
            <CustomNavs />
            <UserIcon />
          </Nav>
        </BsNavbar.Collapse>
      </BsNavbar>
    </>
  );
};

export default Navbar;
