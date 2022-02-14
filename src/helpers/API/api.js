import { AccessToken, logout } from "contexts/helpers";
import { axiosInstance, errorHelper, generateSuccess } from "./axiosInstance";

class API {
  displayAccessToken() {
    console.log(AccessToken);
  }

  /**
   * @author Sanchit Dang
   * @description Login API endpoint
   * @param {Object} loginDetails Login details for the user
   * @returns {Object} responseObject
   */
  login(loginDetails) {
    return axiosInstance
      .post("user/login", loginDetails)
      .then((response) => {
        return generateSuccess(response.data.data.accessToken);
      })
      .catch((error) => errorHelper(error, "login"));
  }

  getUserRole() {
    return axiosInstance
      .post(
        "accessTokenLogin",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @description AccessToken Login API endpoint
   * @returns {Object} responseObject
   */
  accessTokenLogin() {
    return axiosInstance
      .post(
        "accessTokenLogin",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @description logoutUser Login API endpoint
   * @returns {Promise<Object>} responseObject
   */
  async logoutUser() {
    return axiosInstance
      .put(
        "user/logout",
        {},
        {
          headers: {
            authorization: "Bearer " + AccessToken,
          },
        }
      )
      .then(() => {
        logout();
        return generateSuccess(true);
      })
      .catch((error) => errorHelper(error));
  }

  /**
   * @author Sanchit Dang
   * @param {Object} data
   * @param {String} data.ssoToken
   * @param {Object} data.deviceData
   * @param {String} data.deviceData.deviceName
   * @param {String} data.deviceData.deviceType
   * @param {String} data.deviceData.deviceUUID
   * @returns {Promise<Object>}
   */
  async authenticateSSO(data) {
    return axiosInstance
      .post(`sso/auth/validate`, data)
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  /**
   *
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async register(data) {
    return axiosInstance
      .post(`user/register`, data)
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }

  // getUsers() {
  //   return axiosInstance
  //     .get("admin/getUser", {
  //       headers: {
  //         authorization: "Bearer " + AccessToken,
  //       },
  //     })
  //     .then((response) => {
  //       return generateSuccess(response.data.data);
  //     })
  //     .catch((error) => errorHelper(error));
  // }
  getEnvironments() {
    return axiosInstance
      .get("environment/getEnvironments", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  deleteEnvironment(_id) {
    return axiosInstance
      .delete(`environment/deleteEnvironment/${_id}`, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  deletePublicObject(_id) {
    return axiosInstance
      .delete(`object/deletePublicObject/${_id}`, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  getEnvironmentById(_id) {
    return axiosInstance
      .get(`environment/getEnvironmentById/${_id}`, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  createEnvironment(data) {
    return axiosInstance
      .post("environment/createEnvironment", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  getLocalObjects() {
    return axiosInstance
      .get("object/getLocalObjects", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  getPublicObjects() {
    return axiosInstance
      .get("object/getPublicObjects", {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then((response) => {
        return generateSuccess(response.data.data);
      })
      .catch((error) => errorHelper(error));
  }
  createLocalObject(data) {
    return axiosInstance
      .post("object/createLocalObjectItem", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  createPublicObject(data) {
    return axiosInstance
      .post("object/createPublicObject", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  uploadDocument(data) {
    return axiosInstance
      .post("upload/uploadDocument", data, {
        headers: {
          "Content-Type": "multipart/form-data; boundary='boundary'",
        },
      })
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }
  uploadPublicObject(data) {
    return axiosInstance
      .post("object/uploadPublicObject", data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  deleteLocalObject(_id) {
    return axiosInstance
      .delete(`object/deleteLocalObjectItem/${_id}`, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
  updateLocalObject(_id, data) {
    return axiosInstance
      .put(`object/updateLocalObjectItem/${_id}`, data, {
        headers: {
          authorization: "Bearer " + AccessToken,
        },
      })
      .then(() => generateSuccess(AccessToken))
      .catch((error) => errorHelper(error));
  }
}
const instance = new API();
export default instance;
