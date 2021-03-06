import React from "react";
import { Switch, Route } from "react-router-dom";
import uuid from "react-uuid";

import CustomPage from "./custom-page/CustomPage.jsx";
import Page404 from "./Page404";
import ProfilePage from "./profile-settings/ProfilePage";
import PageTable from "./administration/pages/PagesTable";
import UsersTable from "./administration/users/UsersTable";
import AuthModal from "./authorization/AuthModal";
import NavSloths from "./navigation/NavSloths";
import { useAuthContext } from "./providers/AuthProvider";

function Routes({ pages }) {
  const { auth } = useAuthContext();

  const PrivateRoute = ({ component: Component, onlyAdmin, path, ...rest }) => {
    let hasAccess = auth;
    if (onlyAdmin) hasAccess = auth?.user.isAdmin;

    return (
      <Route
        render={(props) =>
          hasAccess ? (
            <Component {...props} />
          ) : (
            <AuthModal action="login" path={path} />
          )
        }
        {...rest}
      />
    );
  };

  const createRoute = (page) => {
    const props = {
      exact: true,
      path: page.path,
      key: uuid(),
      component: () => <CustomPage initPage={page} />,
    };
    return page.published ? <Route {...props} /> : <PrivateRoute {...props} />;
  };

  return (
    <Switch>
      <PrivateRoute exact path="/profile" component={ProfilePage} />
      <PrivateRoute exact path="/pages" component={PageTable} />
      <PrivateRoute exact path="/users" component={UsersTable} />
      <PrivateRoute exact path="/nav" component={NavSloths} onlyAdmin={true} />
      {pages.map(createRoute)}
      <Route path="*" component={Page404} />
    </Switch>
  );
}

export default Routes;
