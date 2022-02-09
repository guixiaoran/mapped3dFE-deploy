import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  CardContent,
  Card,
  Typography,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { API } from "helpers";
import { LayoutConfig } from "constants/index";
import { useState, useCallback, useEffect } from "react";
import { notify, EnhancedTable, EnhancedModal } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const EnvironmentManager = () => {
  const [environments, setEnvironments] = useState([]);
  const isMounted = useIsMountedRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // env detail
  const [envModal, setEnvModal] = useState(false);
  const [currentEnv, setCurrentEnv] = useState("");
  //addObjectToEnvModal
  const [addObjectToEnvModal, setaddObjectToEnvModal] = useState(false);
  const [PublicObjects, setPublicObjects] = useState([]);
  const [selectedPublicObject, setselectedPublicObject] = useState("");
  //show objects
  const [objects, setObjects] = useState([]);
  // updateObjectModal
  const [updateObjectModal, setUpdateObjectModal] = useState(false);
  const [currentObject, setCurrentObject] = useState("");

  // createLocalObject
  const createLocalObject = async (data) => {
    // console.log(data, "dt");
    try {
      const response = await API.createLocalObject(data);
      if (response.success) {
        formikObj.values.environmentId = "";
        formikObj.values.objectName = "";
        formikObj.values.position = "";
        formikObj.values.scale = "";
        formikObj.values.rotation = "";
        formikObj.values.url = "";
        setModalIsOpen(false);
        getEnvironments();
        notify("environment Creation successed");
      } else {
        notify("environment Creation Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };
  let formikObj = useFormik({
    initialValues: {
      environmentId: currentEnv._id,
      objectName: selectedPublicObject.objectName,
      position: "",
      scale: "",
      rotation: "",
      url: selectedPublicObject.url,
    },
    validationSchema: () => {
      return Yup.object().shape({
        position: Yup.string().max(255).required("position Is Required"),
        scale: Yup.string().max(255).required("scale Is Required"),
        rotation: Yup.string().max(255).required("rotation Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentId: currentEnv._id,
        objectName: selectedPublicObject.objectName,
        position: values.position,
        scale: values.scale,
        rotation: values.rotation,
        url: selectedPublicObject.url,
      };
      console.log(data);
      createLocalObject(data);
    },
  });
  // delete local object
  const deleteLocalObject = async (_id) => {
    try {
      const response = await API.deleteLocalObject(_id);
      if (response.success) {
        getLocalObjects();
        notify("deleteLocalObject  successed");
      } else {
        notify("deleteLocalObject  Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };

  // update local object
  const updateLocalObject = async (_id, data) => {
    // console.log(data, "dt");
    try {
      const response = await API.updateLocalObject(data);
      if (response.success) {
        formikUpt.values.environmentId = "";
        formikUpt.values.objectName = "";
        formikUpt.values.position = "";
        formikUpt.values.scale = "";
        formikUpt.values.rotation = "";
        formikUpt.values.url = "";
        // setModalIsOpen(false);
        getLocalObjects();
        notify("updateLocalObject successed");
      } else {
        notify("updateLocalObject  Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };
  let formikUpt = useFormik({
    initialValues: {
      environmentId: "",
      objectName: "",
      position: "",
      scale: "",
      rotation: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        position: Yup.string().max(255).required("environmentName Is Required"),
        scale: Yup.string().max(255).required("environmentCreator Is Required"),
        rotation: Yup.string().max(255),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentId: currentEnv._id,
        objectName: selectedPublicObject.objectName,
        position: values.position,
        scale: values.scale,
        rotation: values.rotation,
        url: selectedPublicObject.url,
      };
      console.log(data);
      updateLocalObject(currentObject._id, data);
    },
  });

  let updateObject = (
    <Container>
      <Formik initialValues={formikUpt.initialValues}>
        <form noValidate onSubmit={formikUpt.handleSubmit}>
          <TextField
            fullWidth
            label="position"
            margin="normal"
            name="position"
            type="text"
            value={formikUpt.values.position}
            variant="outlined"
            error={
              formikUpt.touched.position && Boolean(formikUpt.errors.position)
            }
            helperText={formikUpt.touched.position && formikUpt.errors.position}
            onBlur={formikUpt.handleBlur}
            onChange={formikUpt.handleChange}
          />
          <TextField
            fullWidth
            label="scale"
            margin="normal"
            name="scale"
            type="text"
            value={formikUpt.values.scale}
            variant="outlined"
            error={formikUpt.touched.scale && Boolean(formikUpt.errors.scale)}
            helperText={formikUpt.touched.scale && formikUpt.errors.scale}
            onBlur={formikUpt.handleBlur}
            onChange={formikUpt.handleChange}
          />
          <TextField
            fullWidth
            label="rotation "
            margin="normal"
            name="rotation"
            type="text"
            value={formikUpt.values.rotation}
            variant="outlined"
            error={
              formikUpt.touched.rotation && Boolean(formikUpt.errors.rotation)
            }
            helperText={formikUpt.touched.rotation && formikUpt.errors.rotation}
            onBlur={formikUpt.handleBlur}
            onChange={formikUpt.handleChange}
          />
        </form>
      </Formik>
      <Button
        size="median"
        variant="contained"
        onClick={() => {
          const data = {
            environmentId: currentEnv._id,
            objectName: currentObject.objectName,
            position: formikUpt.values.position,
            scale: formikUpt.values.scale,
            rotation: formikUpt.values.rotation,
            url: currentObject.url,
          };
          console.log(data);
          updateLocalObject(currentObject._id, data);
          getLocalObjects();
          setUpdateObjectModal(false);
        }}
      >
        update Object
      </Button>
    </Container>
  );
  //create environment
  const createEnvironment = async (data) => {
    // let localObjectsId = data.localObjectsId.split(",");
    // data.localObjectsId = localObjectsId;
    // console.log(data, "dt");

    try {
      const response = await API.createEnvironment(data);
      if (response.success) {
        formik.values.environmentName = "";
        formik.values.environmentCreator = "";
        formik.values.panorama = "";
        formik.values.preset = "";
        formik.values.video = "";
        formik.values.floorColor = "";
        formik.values.skyColor = "";
        formik.values.skyUrl = "";
        formik.values.localObjectsId = "";
        setModalIsOpen(false);
        getLocalObjects();
        notify("environment Creation successed");
      } else {
        notify("environment Creation Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };
  let formik = useFormik({
    initialValues: {
      environmentName: "",
      environmentCreator: "",
      panorama: "",
      preset: "",
      video: "",
      floorColor: "",
      skyColor: "",
      skyUrl: "",
      localObjectsId: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        environmentName: Yup.string()
          .max(255)
          .required("environmentName Is Required"),
        environmentCreator: Yup.string()
          .max(255)
          .required("environmentCreator Is Required"),
        panorama: Yup.string().max(255),
        preset: Yup.string().max(255),
        video: Yup.string().max(255),
        floorColor: Yup.string().max(255),
        skyColor: Yup.string().max(255),
        skyUrl: Yup.string().max(255),
        localObjectsId: Yup.string().max(255),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentName: values.environmentName,
        environmentCreator: values.environmentCreator,
        panorama: values.panorama,
        preset: values.preset,
        video: values.video,
        floorColor: values.floorColor,
        skyColor: values.skyColor,
        skyUrl: values.skyUrl,
        localObjectsId: values.localObjectsId,
      };
      console.log(data);
      createEnvironment(data);
    },
  });

  let createEnvorionmentModal = (
    <Box>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Environment Name"
            margin="normal"
            name="environmentName"
            type="text"
            value={formik.values.environmentName}
            variant="outlined"
            error={
              formik.touched.environmentName &&
              Boolean(formik.errors.environmentName)
            }
            helperText={
              formik.touched.environmentName && formik.errors.environmentName
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="environmentCreator Name"
            margin="normal"
            name="environmentCreator"
            type="text"
            value={formik.values.environmentCreator}
            variant="outlined"
            error={
              formik.touched.environmentCreator &&
              Boolean(formik.errors.environmentCreator)
            }
            helperText={
              formik.touched.environmentCreator &&
              formik.errors.environmentCreator
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="panorama "
            margin="normal"
            name="panorama"
            type="text"
            value={formik.values.panorama}
            variant="outlined"
            error={formik.touched.panorama && Boolean(formik.errors.panorama)}
            helperText={formik.touched.panorama && formik.errors.panorama}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="preset "
            margin="normal"
            name="preset"
            type="text"
            value={formik.values.preset}
            variant="outlined"
            error={formik.touched.preset && Boolean(formik.errors.preset)}
            helperText={formik.touched.preset && formik.errors.preset}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="video "
            margin="normal"
            name="video"
            type="text"
            value={formik.values.video}
            variant="outlined"
            error={formik.touched.video && Boolean(formik.errors.video)}
            helperText={formik.touched.video && formik.errors.video}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="floorColor"
            margin="normal"
            name="floorColor"
            type="text"
            value={formik.values.floorColor}
            variant="outlined"
            error={
              formik.touched.floorColor && Boolean(formik.errors.floorColor)
            }
            helperText={formik.touched.floorColor && formik.errors.floorColor}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="skyColor"
            margin="normal"
            name="skyColor"
            type="text"
            value={formik.values.skyColor}
            variant="outlined"
            error={formik.touched.skyColor && Boolean(formik.errors.skyColor)}
            helperText={formik.touched.skyColor && formik.errors.skyColor}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="skyUrl"
            margin="normal"
            name="skyUrl"
            type="text"
            value={formik.values.skyUrl}
            variant="outlined"
            error={formik.touched.skyUrl && Boolean(formik.errors.skyUrl)}
            helperText={formik.touched.skyUrl && formik.errors.skyUrl}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="localObjectsId"
            margin="normal"
            name="localObjectsId"
            type="text"
            value={formik.values.localObjectsId}
            variant="outlined"
            error={
              formik.touched.localObjectsId &&
              Boolean(formik.errors.localObjectsId)
            }
            helperText={
              formik.touched.localObjectsId && formik.errors.localObjectsId
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              size="large"
              variant="contained"
              type="submit"
              onClick={() => setModalIsOpen(false)}
            >
              Create Environment
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

  // get environment
  const getEnvironments = useCallback(async () => {
    try {
      const response = await API.getEnvironments();
      if (response.success) {
        setEnvironments(response.data.data);
        console.log(environments);
      } else {
        setEnvironments([]);
        notify("Failed to Fetch Job List");
      }
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getEnvironments();
  }, [getEnvironments]);
  //get local objects
  const getLocalObjects = useCallback(async () => {
    try {
      const response = await API.getLocalObjects();
      console.log("res----->", response.data.data);
      if (response.success) setObjects(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getLocalObjects();
  }, [getLocalObjects]);

  // get public object
  const getPublicObjects = useCallback(async () => {
    try {
      const response = await API.getPublicObjects();
      console.log("res----->", response.data.data);
      if (response.success) setPublicObjects(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getPublicObjects();
  }, [getPublicObjects]);
  // create
  const handleObjectChange = (event) => {
    setselectedPublicObject(event.target.value);
  };
  let addObjectToEnv = (
    <Container>
      <FormControl fullWidth>
        <InputLabel>Public Object</InputLabel>
        <Select
          value={selectedPublicObject}
          label="Object"
          onChange={handleObjectChange}
        >
          {PublicObjects.map((data, i) => {
            return (
              <MenuItem value={data} key={i}>
                {data.objectName}
              </MenuItem>
            );
          })}
        </Select>
        {/* {console.log("selectedPublicObject1", selectedPublicObject.url)}
        {console.log("currentEnv", currentEnv)} */}
      </FormControl>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="position"
            margin="normal"
            name="position"
            type="text"
            value={formik.values.position}
            variant="outlined"
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="scale"
            margin="normal"
            name="scale"
            type="text"
            value={formik.values.scale}
            variant="outlined"
            error={formik.touched.scale && Boolean(formik.errors.scale)}
            helperText={formik.touched.scale && formik.errors.scale}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label="rotation "
            margin="normal"
            name="rotation"
            type="text"
            value={formik.values.rotation}
            variant="outlined"
            error={formik.touched.rotation && Boolean(formik.errors.rotation)}
            helperText={formik.touched.rotation && formik.errors.rotation}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </form>
      </Formik>
      <Button
        size="median"
        variant="contained"
        onClick={() => {
          const data = {
            environmentId: currentEnv._id,
            objectName: selectedPublicObject.objectName,
            position: formik.values.position,
            scale: formik.values.scale,
            rotation: formik.values.rotation,
            url: selectedPublicObject.url,
          };
          console.log(data);
          createLocalObject(data);
          getLocalObjects();
          setaddObjectToEnvModal(false);
        }}
      >
        Add Object to environment
      </Button>
    </Container>
  );

  let envDetail = (
    <Container>
      <EnhancedModal
        isOpen={addObjectToEnvModal}
        dialogTitle={`Add object to ` + currentEnv.environmentName}
        dialogContent={addObjectToEnv}
        options={{
          onClose: () => setaddObjectToEnvModal(false),
          disableSubmit: true,
        }}
      />
      <Button
        size="median"
        variant="contained"
        onClick={() => {
          setaddObjectToEnvModal(true);
          // setCurrentEnv(data);
        }}
      >
        Add Object
      </Button>
      <Container>
        {/* {setObjectsInEnv(
          objects.filter((obj) => {
            console.log("id---", obj.environmentId, currentEnv._id);
            return obj.environmentId === currentEnv._id;
          })
        )} */}
        {objects.length > 0 ? (
          objects.map((data) => {
            if (data.environmentId === currentEnv._id)
              return (
                <Box key={data._id} mb={4}>
                  <Card width={50}>
                    <CardContent>
                      <div style={{ width: 300, whiteSpace: "nowrap" }}>
                        <Typography
                          component="div"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                          gutterBottom
                        >
                          Object Name: {data.objectName}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                          gutterBottom
                        >
                          Position: {data.position}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                          gutterBottom
                        >
                          Scale:{data.scale}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                          gutterBottom
                        >
                          Rotation:{data.Rotation}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                          gutterBottom
                        >
                          S3 Link: {data.url}
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          setUpdateObjectModal(true);
                          setCurrentObject(data._id);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          deleteLocalObject(data._id);
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>{" "}
                </Box>
              );
          })
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </Container>
    </Container>
  );

  let environmentsCard = (
    <Grid Container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {environments.length > 0 ? (
        environments.map((data) => {
          return (
            <Box key={data._id} mb={4}>
              <Card width={50}>
                <CardContent>
                  <div style={{ width: 300, whiteSpace: "nowrap" }}>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Name: {data.environmentName}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Creator: {data.environmentCreator}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Panorama:{data.panorama}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Panorama:{data.panorama}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Preset:{data.Preset}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Video:{data.Video}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setEnvModal(true);
                      setCurrentEnv(data);
                    }}
                  >
                    Manage Objects
                  </Button>
                </CardActions>
              </Card>{" "}
            </Box>
          );
        })
      ) : (
        <Typography>No Data Available</Typography>
      )}
    </Grid>
  );
  return (
    <Box sx={LayoutConfig.defaultContainerSX}>
      <Container
        style={{
          margin: "auto auto",
        }}
        maxWidth="md"
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          px: {
            md: "130px !important",
          },
        }}
      >
        {/* create environment modal */}
        <EnhancedModal
          isOpen={modalIsOpen}
          dialogTitle={`create Envorionment`}
          dialogContent={createEnvorionmentModal}
          options={{
            onClose: () => setModalIsOpen(false),
            disableSubmit: true,
          }}
        />
        {/* env detail, after click object/detail in card */}
        <EnhancedModal
          isOpen={envModal}
          dialogTitle={currentEnv.environmentName}
          dialogContent={envDetail}
          options={{
            onClose: () => setEnvModal(false),
            disableSubmit: true,
          }}
        />
        {/* update local object modal */}
        <EnhancedModal
          isOpen={updateObjectModal}
          dialogTitle={selectedPublicObject.objectName}
          dialogContent={updateObject}
          options={{
            onClose: () => setUpdateObjectModal(false),
            disableSubmit: true,
          }}
        />
        <Button
          size="middle"
          variant="contained"
          onClick={() => setModalIsOpen(true)}
        >
          Create Environment
        </Button>
        {environmentsCard}
        <EnhancedTable
          data={environments}
          title="environments Manager"
          options={{
            ignoreKeys: [
              // "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
              "createdAt",
              "_id",
            ],
          }}
        />
      </Container>
    </Box>
  );
};