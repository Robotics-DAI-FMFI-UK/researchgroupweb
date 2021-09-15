/** Setup config/headers and token */
export const tokenConfig = () => {
  const token = getAuth()?.token;
  const config = {
    headers: { "Content-type": "application/json" },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};

/** two types of error message:
 * 1) from mongo schema e.g: "page validation failed: path: Not valid url path"
 * 2) from mongo routes e.g: "New password is the same as the current" */
export const getErrorMsg = (err) => {
  try {
    const msg = err.response.data.message;
    const index = msg.lastIndexOf(":");
    const isRouteError = index === -1;
    return isRouteError ? msg : msg.substr(index + 1).trim();
  } catch (err) {
    return "Error occurred";
  }
};

const setLocaleStorage = (key, value) => localStorage.setItem(key, value);
const getLocaleStorage = (key) => JSON.parse(localStorage.getItem(key));
const delLocaleStorage = (key) => localStorage.removeItem(key);

export const setAuth = (a) => setLocaleStorage("auth", JSON.stringify(a));
export const getAuth = () => getLocaleStorage("auth");
export const delAuth = () => delLocaleStorage("auth");

export const setEdit = () => setLocaleStorage("edit", "true");
export const getEdit = () => getLocaleStorage("edit");
export const delEdit = () => delLocaleStorage("edit");

export const getUserPermission = (initPage, auth) => {
  return auth?.user.isAdmin || initPage.created_by._id === auth?.user.id;
};

export const upperFirst = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));

export const formatDate = (date) => {
  return date.substr(0, 10).split("-").reverse().join(".");
};

export const isEmptyObject = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const reloadPage = () => window.location.reload(false);

export const splitModules = (modules, activeModule) => {
  const updatedModules = [];
  const removeIds = [];

  modules.forEach((module) => {
    if (module.isRemoved) {
      removeIds.push(module._id);
    } else {
      const isActive = activeModule?._id === module._id;
      updatedModules.push(isActive ? activeModule : module);
    }
  });

  return { updatedModules, removeIds };
};

// https://stackoverflow.com/questions/10593337/is-there-any-way-to-create-mongodb-like-id-strings-without-mongodb
export const objectId = () => {
  function hex(value) {
    return Math.floor(value).toString(16);
  }

  return (
    hex(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
  );
};

// https://stackoverflow.com/a/18358056/15440273
export const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};

// https://stackoverflow.com/a/38181008/15440273
export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];
