import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Navbar as BsNavbar } from "react-bootstrap";
import { UserIcon } from "./user-icon/UserIcon";
import { SearchBar } from "./SearchBar";
import { useLocation } from "react-router";
import uuid from "react-uuid";
import NavBrand from "./NavBrand";
import axios from "axios";
import { NavDropdown } from "react-bootstrap";
import { getAuth } from "../utils/functions";
import { BsPencil } from "react-icons/bs";
import SmallButton from "../components/buttons/SmallButton";

const Navbar = ({ pages }) => {
  const location = useLocation();

  const [navItems, setNavItems] = useState([]);
  const hasEditPermission = getAuth()?.user.isAdmin;

  useEffect(() => {
    axios
      .get("/navbars/published")
      .then((res) => {
        const items = [];
        console.log(res.data);
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
    return (
      navItems
        // .filter((navItem) => navItem.pages.length)
        .map((navItem) => (
          <div key={uuid()}>
            {navItem.pages.length === 1 ? (
              <Nav.Link className="text-center" href={navItem.pages[0].path}>
                {navItem.pages[0].title}
              </Nav.Link>
            ) : (
              <DropDown navItem={navItem} />
            )}
          </div>
        ))
    );
  };

  const DropDown = ({ navItem }) => {
    return (
      <NavDropdown
        title={navItem.name || "Dropdown"}
        className="text-center"
        key={navItem._id}
        id={navItem._id}
      >
        {navItem.pages.map((page) => {
          return (
            <NavDropdown.Item
              // className="text-center"
              href={page.path}
              key={page.path}
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
        expand="sm"
        bg="dark"
        variant="dark"
        style={{ zIndex: 1001 }}
      >
        {/*<NavBrand />*/}
        <SearchBar />
        {/*<h2*/}
        {/*  style={{*/}
        {/*    paddingLeft: "50px",*/}
        {/*    color: "white",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  ROBOT GROUP, DAI FMFI UK*/}
        {/*</h2>*/}
        <BsNavbar.Toggle />
        <BsNavbar.Collapse>
          <Nav className="ml-auto" navbar activeKey={location.pathname}>
            {hasEditPermission && (
              <SmallButton href="/nav" title="edit navbar">
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
