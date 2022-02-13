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
  Link,
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
  const [thisEnvDetail, setThisEnvDetail] = useState([]);
  const [currentEnv, setCurrentEnv] = useState("");
  //addObjectToEnvModal
  const [addObjectToEnvModal, setaddObjectToEnvModal] = useState(false);
  const [PublicObjects, setPublicObjects] = useState([]);
  const [selectedPublicObject, setselectedPublicObject] = useState("");
  //show objects
  // const [objects, setObjects] = useState([]);
  // updateObjectModal
  const [updateObjectModal, setUpdateObjectModal] = useState(false);
  const [currentObject, setCurrentObject] = useState("");
  // choose Environment Type when create a new environment
  const EnvironmentType = [
    "Panorama(360 video)",
    "360 Image",
    "Preset Environment",
    "Default",
  ];
  const presetOptions = [
    "Env1-ocean",
    "Env2-forest",
    "Env3-room",
    "Env4-road",
    "Env5-Egypt",
  ];
  const [envType, setEnvType] = useState("");
  const [choosenPreset, setChoosenPreset] = useState("");

  // createLocalObject
  const createLocalObject = async (data) => {
    // console.log(data, "dt");
    try {
      const response = await API.createLocalObject(data);
      console.log("createLocalObject data", data);
      if (response.success) {
        getEnvironmentById(data.environmentId);
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
  const deleteLocalObject = async (data) => {
    try {
      const response = await API.deleteLocalObject(data._id);
      if (response.success) {
        console.log("env id:  ---", data);
        getEnvironmentById(data.environmentId);
        notify("deleteLocalObject  successed");
      } else {
        notify("deleteLocalObject  Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };
  const deleteEnvironment = async (data) => {
    try {
      const response = await API.deleteEnvironment(data._id);
      if (response.success) {
        getEnvironments();
        // notify("deletedeleteEnvironment  successed");
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
      const response = await API.updateLocalObject(_id, data);
      if (response.success) {
        getEnvironmentById(data.environmentId);
        formikUpt.values.environmentId = "";
        formikUpt.values.objectName = "";
        formikUpt.values.position = "";
        formikUpt.values.scale = "";
        formikUpt.values.rotation = "";
        formikUpt.values.url = "";
        // setModalIsOpen(false);
        // getLocalObjects();

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
      position: currentObject.position,
      scale: currentObject.scale,
      rotation: currentObject.rotation,
      url: currentObject.url,
    },
    validationSchema: () => {
      return Yup.object().shape({
        position: Yup.string().max(255).required("position Is Required"),
        scale: Yup.string().max(255).required("scale Is Required"),
        rotation: Yup.string().max(255).required("scale Is Required"),
        url: Yup.string().max(255).required("scale Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentId: currentEnv._id,
        objectName: selectedPublicObject.objectName,
        position: values.position,
        scale: values.scale,
        rotation: values.rotation,
        url: values.url,
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
            label="position" //formikUpt.values.scale
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
          <TextField
            fullWidth
            label="url "
            margin="normal"
            name="url"
            type="text"
            value={formikUpt.values.url}
            variant="outlined"
            error={formikUpt.touched.url && Boolean(formikUpt.errors.url)}
            helperText={formikUpt.touched.url && formikUpt.errors.url}
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
            url: formikUpt.values.url,
          };
          console.log("data", data);
          updateLocalObject(currentObject._id, data);
          console.log("currentObject._id", currentObject._id);
          // getLocalObjects();
          setUpdateObjectModal(false);
        }}
      >
        update Object
      </Button>
    </Container>
  );
  //create environment
  const createEnvironment = async (data) => {
    // console.log(data, "dt");
    try {
      const response = await API.createEnvironment(data);
      if (response.success) {
        getEnvironments();
        formik.values.environmentName = "";
        formik.values.environmentCreator = "";
        formik.values.panorama = "";
        formik.values.preset = "";
        formik.values.video = "";
        formik.values.floorColor = "";
        formik.values.skyColor = "";
        formik.values.skyUrl = "";
        setModalIsOpen(false);
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
      panorama: "false",
      preset: "",
      video: "",
      floorColor: "",
      skyColor: "",
      skyUrl: "",
      // localObjectsId: "",
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
        // localObjectsId: Yup.string().max(255),
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
        // localObjectsId: values.localObjectsId,
      };
      console.log(data);
      createEnvironment(data);
    },
  });
  const handleTypeChange = (event) => {
    setEnvType(event.target.value);
    if (event.target.value === EnvironmentType[1]) {
      formik.values.panorama = "true";
    } else {
      formik.values.panorama = "false";
    }
    console.log(formik.values.panorama, "pr");
  };

  const handlePresetChange = (event) => {
    setChoosenPreset(event.target.value);
    formik.values.preset = event.target.value;
    console.log("event.target.value:", event.target.value);
  };

  let createEnvorionmentModal = (
    <Box>
      <FormControl fullWidth>
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
        {/* <InputLabel>Choose Environment Type</InputLabel> */}

        <Select value={envType} label="Env" onChange={handleTypeChange}>
          {EnvironmentType.map((data, i) => {
            return (
              <MenuItem value={data} key={i}>
                {data}
              </MenuItem>
            );
          })}
        </Select>
        {envType === EnvironmentType[0] ? (
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
        ) : envType === EnvironmentType[1] ? (
          <Box>
            {" "}
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
          </Box>
        ) : envType === EnvironmentType[2] ? (
          <Select
            label="preset"
            onChange={handlePresetChange}
            value={choosenPreset}
          >
            {presetOptions.map((data, i) => {
              return (
                <MenuItem value={data} key={i}>
                  {data}
                </MenuItem>
              );
            })}
          </Select>
        ) : envType === EnvironmentType[3] ? (
          <Box>
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
            />{" "}
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
          </Box>
        ) : null}
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          disabled={formik.isSubmitting}
          size="large"
          variant="contained"
          type="submit"
          onClick={() => createEnvironment(formik.values)}
        >
          Create Environment
        </Button>
      </Box>
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
        notify("Failed to Fetch Env List");
      }
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getEnvironments();
  }, [getEnvironments]);

  const getEnvironmentById = useCallback(
    async (_id) => {
      try {
        const response = await API.getEnvironmentById(_id);
        // console.log("in this ID", _id);
        if (response.success) {
          setThisEnvDetail(response.data.localObjects);
          // console.log("in thisEnvDetail :", thisEnvDetail);
        } else {
          setEnvironments([]);
          notify("Failed to Fetch Env List");
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMounted]
  );

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
      </FormControl>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Local object Name"
            margin="normal"
            name="objectName"
            type="text"
            value={formik.values.objectName}
            variant="outlined"
            error={
              formik.touched.objectName && Boolean(formik.errors.objectName)
            }
            helperText={formik.touched.objectName && formik.errors.objectName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
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
            objectName: formik.values.objectName,
            position: formik.values.position,
            scale: formik.values.scale,
            rotation: formik.values.rotation,
            url: selectedPublicObject.url,
          };
          console.log(data);
          createLocalObject(data);
          // getLocalObjects();
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
        {thisEnvDetail.length > 0 ? (
          thisEnvDetail.map((data) => {
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
                        Rotation:{data.rotation}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        gutterBottom
                      >
                        <Link href={data.url}>Download this model </Link>
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        formikUpt.values.position = data.position;
                        formikUpt.values.scale = data.scale;
                        formikUpt.values.rotation = data.rotation;
                        formikUpt.values.url = data.url;
                        setCurrentObject(data);
                        setUpdateObjectModal(true);
                        // setCurrentObject(data);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        deleteLocalObject(data);
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
                      Panorama:{data.panorama.toString()}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Preset:{data.preset}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Video:{data.video}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setEnvModal(true);
                      setCurrentEnv(data);
                      console.log("env id: ---", data._id);
                      getEnvironmentById(data._id);
                    }}
                  >
                    Manage Objects
                  </Button>
                  <Button
                  >
                    <Link href={`/preview/`+data._id}>Preview</Link>
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      deleteEnvironment(data);
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
{
  /* <Formik initialValues={formik.initialValues}>
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
      </Formik> */
}
