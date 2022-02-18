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

import { useState, useCallback, useEffect } from "react";
import { notify, EnhancedModal } from "components/index";
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
  const [imageObjects, setImageObjects] = useState([]);
  const [videoObjects, setvideoObjects] = useState([]);
  const [normalObjects, setNormalObjects] = useState([]);
  // update color modal
  const [updateColorModal, setUpdateColorModal] = useState(false);
  // choose Environment Type when create a new environment
  const EnvironmentType = [
    "Panorama(360 video)",
    "360 Image",
    "Preset Environment",
    "Default",
  ];
  const presetOptions = [
    "none",
    "default",
    "contact",
    "egypt",
    "checkerboard",
    "forest",
    "goaland",
    "yavapai",
    "goldmine",
    "threetowers",
    "poison",
    "arches",
    "tron",
    "japan",
    "dream",
    "volcano",
    "starry",
    "osiris",
    "moon",
  ];

  const [envType, setEnvType] = useState("");
  const [choosenPreset, setChoosenPreset] = useState("");
  const [choosenSkyUrl, setChoosenSkyUrl] = useState("");
  const [choosen360Video, setChoosen360Video] = useState("");
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
        formikObj.values.positionx = "";
        formikObj.values.positiony = "";
        formikObj.values.positionz = "";
        formikObj.values.scale = "";
        formikObj.values.scalex = "";
        formikObj.values.scaley = "";
        formikObj.values.scalez = "";
        formikObj.values.rotation = "";
        formikObj.values.rotationx = "";
        formikObj.values.rotationy = "";
        formikObj.values.rotationz = "";
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
      positionx: "",
      positiony: "",
      positionz: "",
      scale: "",
      scalex: "",
      scaley: "",
      scalez: "",
      rotation: "",
      rotationx: "",
      rotationy: "",
      rotationz: "",
      url: selectedPublicObject.url,
    },
    validationSchema: () => {
      return Yup.object().shape({
        positionx: Yup.string().max(255).required("position Is Required"),
        positiony: Yup.string().max(255).required("position Is Required"),
        positionz: Yup.string().max(255).required("position Is Required"),
        scalex: Yup.string().max(255).required("scale Is Required"),
        scaley: Yup.string().max(255).required("scale Is Required"),
        scalez: Yup.string().max(255).required("scale Is Required"),
        rotationx: Yup.string().max(255).required("rotation Is Required"),
        rotationy: Yup.string().max(255).required("rotation Is Required"),
        rotationz: Yup.string().max(255).required("rotation Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentId: currentEnv._id,
        objectName: selectedPublicObject.objectName,
        position: [values.positionx,values.positiony,values.positionz].join(' '),
        scale: [values.scalex,values.scaley,values.scalez].join(' '),
        rotation: [values.rotationx,values.rotationy,values.rotationz].join(' '),
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
        formikUpt.values.positionx = "";
        formikUpt.values.positiony = "";
        formikUpt.values.positionz = "";
        formikUpt.values.scale = "";
        formikUpt.values.scalex = "";
        formikUpt.values.scaley = "";
        formikUpt.values.scalez = "";
        formikUpt.values.rotation = "";
        formikUpt.values.rotationx = "";
        formikUpt.values.rotationy = "";
        formikUpt.values.rotationz = "";
        formikUpt.values.url = "";
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
      position:"",
      positionx: '',
      positiony: '',
      positionz: '',
      scale: "",
      scalex: "",
      scaley: "",
      scalez: "",
      rotation: "",
      rotationx: "",
      rotationy: "",
      rotationz: "",
      url: '',
    },
    validationSchema: () => {
      return Yup.object().shape({
        positionx: Yup.string().max(255).required("position Is Required"),
        positiony: Yup.string().max(255).required("position Is Required"),
        positionz: Yup.string().max(255).required("position Is Required"),
        scalex: Yup.string().max(255).required("scale Is Required"),
        scaley: Yup.string().max(255).required("scale Is Required"),
        scalez: Yup.string().max(255).required("scale Is Required"),
        rotationx: Yup.string().max(255).required("rotation Is Required"),
        rotationy: Yup.string().max(255).required("rotation Is Required"),
        rotationz: Yup.string().max(255).required("rotation Is Required"),
        url: Yup.string().max(255).required("scale Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentId: currentEnv._id,
        objectName: selectedPublicObject.objectName,
        position: [values.positionx,values.positiony,values.positionz].join(' '),
        scale: [values.scalex,values.scaley,values.scalez].join(' '),
        rotation: [values.rotationx,values.rotationy,values.rotationz].join(' '),
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
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position X"
                margin="normal"
                name="positionx"
                type="text"
                value={formikUpt.values.positionx}
                variant="outlined"
                error={
                  formikUpt.touched.positionx &&
                  Boolean(formikUpt.errors.positionx)
                }
                helperText={
                  formikUpt.touched.positionx && formikUpt.errors.positionx
                }
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position Y"
                margin="normal"
                name="positiony"
                type="text"
                value={formikUpt.values.positiony}
                variant="outlined"
                error={
                  formikUpt.touched.positiony &&
                  Boolean(formikUpt.errors.positiony)
                }
                helperText={
                  formikUpt.touched.positiony && formikUpt.errors.positiony
                }
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position Z"
                margin="normal"
                name="positionz"
                type="text"
                value={formikUpt.values.positionz}
                variant="outlined"
                error={
                  formikUpt.touched.positionz &&
                  Boolean(formikUpt.errors.positionz)
                }
                helperText={
                  formikUpt.touched.positionz && formikUpt.errors.positionz
                }
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scale X"
                margin="normal"
                name="scalex"
                type="text"
                value={formikUpt.values.scalex}
                variant="outlined"
                error={formikUpt.touched.scalex && Boolean(formikUpt.errors.scalex)}
                helperText={formikUpt.touched.scalex && formikUpt.errors.scalex}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scale Y"
                margin="normal"
                name="scaley"
                type="text"
                value={formikUpt.values.scaley}
                variant="outlined"
                error={formikUpt.touched.scaley && Boolean(formikUpt.errors.scaley)}
                helperText={formikUpt.touched.scaley && formikUpt.errors.scaley}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scaleZ"
                margin="normal"
                name="scalez"
                type="text"
                value={formikUpt.values.scalez}
                variant="outlined"
                error={formikUpt.touched.scalez && Boolean(formikUpt.errors.scalez)}
                helperText={formikUpt.touched.scalez && formikUpt.errors.scalez}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation X"
                margin="normal"
                name="rotationx"
                type="text"
                value={formikUpt.values.rotationx}
                variant="outlined"
                error={
                  formikUpt.touched.rotationx && Boolean(formikUpt.errors.rotationx)
                }
                helperText={formikUpt.touched.rotationx && formikUpt.errors.rotationx}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation Y"
                margin="normal"
                name="rotationy"
                type="text"
                value={formikUpt.values.rotationy}
                variant="outlined"
                error={
                  formikUpt.touched.rotationy && Boolean(formikUpt.errors.rotationy)
                }
                helperText={formikUpt.touched.rotationy && formikUpt.errors.rotationy}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation Z"
                margin="normal"
                name="rotationz"
                type="text"
                value={formikUpt.values.rotationz}
                variant="outlined"
                error={
                  formikUpt.touched.rotationz && Boolean(formikUpt.errors.rotationz)
                }
                helperText={formikUpt.touched.rotationz && formikUpt.errors.rotationz}
                onBlur={formikUpt.handleBlur}
                onChange={formikUpt.handleChange}
              />
            </Grid>
          </Grid>

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
            position: [formikUpt.values.positionx,formikUpt.values.positiony,formikUpt.values.positionz].join(' '),
            scale: [formikUpt.values.scalex,formikUpt.values.scaley,formikUpt.values.scalez].join(' '),
            rotation: [formikUpt.values.rotationx,formikUpt.values.rotationy,formikUpt.values.rotationz].join(' '),
            url: formikUpt.values.url,
          };
          console.log("data", data);
          updateLocalObject(currentObject._id, data);
          // console.log("currentObject._id", currentObject._id);
          setUpdateObjectModal(false);
        }}
      >
        update Object
      </Button>
    </Container>
  );
  // update environment
  const updateEnvironment = async (_id, data) => {
    // console.log(data, "dt");
    try {
      const response = await API.updateEnvironment(_id, data);
      if (response.success) {
        getEnvironments();
        formikUptEnv.values.environmentName = "";
        formikUptEnv.values.panorama = "";
        formikUptEnv.values.preset = "";
        formikUptEnv.values.video = "";
        formikUptEnv.values.floorColor = currentEnv.floorColor;
        formikUptEnv.values.skyColor = currentEnv.skyColor;
        formikUptEnv.values.skyUrl = "";
        notify("updateEnvironment successed");
      } else {
        notify("updateEnvironment  Failed");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };
  let formikUptEnv = useFormik({
    initialValues: {
      environmentName: "",
      panorama: "false",
      preset: "",
      video: "",
      floorColor: currentEnv.floorColor,
      skyColor: currentEnv.skyColor,
      skyUrl: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        environmentName: Yup.string()
          .max(255)
          .required("environmentName Is Required"),

        panorama: Yup.string().max(255),
        preset: Yup.string().max(255),
        video: Yup.string().max(255),
        floorColor: Yup.string().max(255),
        skyColor: Yup.string().max(255),
        skyUrl: Yup.string().max(255),
      });
    },
    onSubmit: async (values) => {
      // const data = {
      //   environmentName: values.environmentName,
      //   panorama: values.panorama.toString(),
      //   preset: values.preset,
      //   video: values.video,
      //   floorColor: values.floorColor,
      //   skyColor: values.skyColor,
      //   skyUrl: values.skyUrl,
      // };
      console.log(values);
      // updateEnvironment(currentEnv._id, data);
    },
  });

  let updateEnvironmentForm = (
    <Container>
      <Formik initialValues={formikUptEnv.initialValues}>
        <form noValidate onSubmit={formikUptEnv.handleSubmit}>
          <TextField
            fullWidth
            label="skyColor"
            margin="normal"
            name="skyColor"
            type="text"
            value={formikUptEnv.values.skyColor}
            variant="outlined"
            error={
              formikUptEnv.touched.skyColor &&
              Boolean(formikUptEnv.errors.skyColor)
            }
            helperText={
              formikUptEnv.touched.skyColor && formikUptEnv.errors.skyColor
            }
            onBlur={formikUptEnv.handleBlur}
            onChange={formikUptEnv.handleChange}
          />{" "}
          <TextField
            fullWidth
            label="floorColor"
            margin="normal"
            name="floorColor"
            type="text"
            value={formikUptEnv.values.floorColor}
            variant="outlined"
            error={
              formikUptEnv.touched.floorColor &&
              Boolean(formikUptEnv.errors.floorColor)
            }
            helperText={
              formikUptEnv.touched.floorColor && formikUptEnv.errors.floorColor
            }
            onBlur={formikUptEnv.handleBlur}
            onChange={formikUptEnv.handleChange}
          />
        </form>
      </Formik>
      <Button
        size="median"
        variant="contained"
        onClick={() => {
          const data = {
            // environmentId: currentEnv._id,
            environmentName: currentEnv.environmentName,
            panorama: currentEnv.panorama.toString(),
            preset: currentEnv.preset,
            video: currentEnv.video,
            skyUrl: currentEnv.skyUrl,
            floorColor: formikUptEnv.values.floorColor,
            skyColor: formikUptEnv.values.skyColor,
          };
          updateEnvironment(currentEnv._id, data);
          console.log("currentEnv data", data);
          setUpdateColorModal(false);
        }}
      >
        update environment color
      </Button>
    </Container>
  );

  //create environment
  const createEnvironment = async (data) => {
    try {
      const response = await API.createEnvironment(data);
      if (response.success) {
        getEnvironments();
        formik.values.environmentName = "";
        formik.values.panorama = "";
        formik.values.preset = "";
        formik.values.video = "";
        formik.values.floorColor = "green";
        formik.values.skyColor = "blue";
        formik.values.skyUrl = "";
        setModalIsOpen(false);
        setChoosenPreset("");
        setEnvType("");
        setChoosenSkyUrl("");
        choosen360Video("");
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
      panorama: "false",
      preset: "",
      video: "",
      floorColor: "green",
      skyColor: "blue",
      skyUrl: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        environmentName: Yup.string()
          .max(255)
          .required("environmentName Is Required"),

        panorama: Yup.string().max(255),
        preset: Yup.string().max(255),
        video: Yup.string().max(255),
        floorColor: Yup.string().max(255),
        skyColor: Yup.string().max(255),
        skyUrl: Yup.string().max(255),
      });
    },
    onSubmit: async (values) => {
      const data = {
        environmentName: values.environmentName,
        panorama: values.panorama,
        preset: values.preset,
        video: values.video,
        floorColor: values.floorColor,
        skyColor: values.skyColor,
        skyUrl: values.skyUrl,
      };
      console.log(data);
      createEnvironment(data);
    },
  });
  //handleTypeChange
  const handleTypeChange = (event) => {
    setEnvType(event.target.value);
    if (event.target.value === EnvironmentType[1]) {
      formik.values.panorama = "true";
      setImageObjects(
        PublicObjects.filter((x) => x.objectType === "360 Image")
      );
    } else if (event.target.value === EnvironmentType[0]) {
      setvideoObjects(PublicObjects.filter((x) => x.objectType === "3D Video"));
    } else {
      formik.values.panorama = "false";
    }
    // console.log(formik.values.panorama, "pr");
  };

  const handlePresetChange = (event) => {
    setChoosenPreset(event.target.value);
    formik.values.preset = event.target.value;
    console.log("event.target.value:", event.target.value);
  };
  const handleSkyUrlChange = (event) => {
    console.log("event.target.value", event.target.value);
    setChoosenSkyUrl(event.target.value);
    formik.values.skyUrl = event.target.value;
  };
  const handleVideoChange = (event) => {
    console.log("event.target.value", event.target.value);
    setChoosen360Video(event.target.value);
    formik.values.video = event.target.value;
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

        <Typography>Choose Environment Type</Typography>
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
          <Box>
            <Typography>Choose Video</Typography>
            <FormControl fullWidth>
              <Select
                value={choosen360Video}
                label="360 Video"
                onChange={handleVideoChange}
              >
                {videoObjects.map((data, i) => {
                  return (
                    <MenuItem value={data.url} key={i}>
                      {data.objectName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        ) : envType === EnvironmentType[1] ? (
          <Box>
            {" "}
            <Typography>Choose Image</Typography>
            <FormControl fullWidth>
              <Select
                value={choosenSkyUrl}
                label="Sky Url"
                onChange={handleSkyUrlChange}
              >
                {imageObjects.map((data, i) => {
                  return (
                    <MenuItem value={data.url} key={i}>
                      {data.objectName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        ) : envType === EnvironmentType[2] ? (
          <Box>
            <Typography>Choose Preset</Typography>
            <FormControl fullWidth>
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
            </FormControl>
          </Box>
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
        if (response.success) {
          setThisEnvDetail(response.data.localObjects);
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
          {normalObjects.map((data, i) => {
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
            value={formikObj.values.objectName}
            variant="outlined"
            error={
              formikObj.touched.objectName &&
              Boolean(formikObj.errors.objectName)
            }
            helperText={
              formikObj.touched.objectName && formikObj.errors.objectName
            }
            onBlur={formikObj.handleBlur}
            onChange={formikObj.handleChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position X"
                margin="normal"
                name="positionx"
                type="text"
                value={formikObj.values.positionx}
                variant="outlined"
                error={
                  formikObj.touched.positionx &&
                  Boolean(formikObj.errors.positionx)
                }
                helperText={
                  formikObj.touched.positionx && formikObj.errors.positionx
                }
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position Y"
                margin="normal"
                name="positiony"
                type="text"
                value={formikObj.values.positiony}
                variant="outlined"
                error={
                  formikObj.touched.positiony &&
                  Boolean(formikObj.errors.positiony)
                }
                helperText={
                  formikObj.touched.positiony && formikObj.errors.positiony
                }
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="position Z"
                margin="normal"
                name="positionz"
                type="text"
                value={formikObj.values.positionz}
                variant="outlined"
                error={
                  formikObj.touched.positionz &&
                  Boolean(formikObj.errors.positionz)
                }
                helperText={
                  formikObj.touched.positionz && formikObj.errors.positionz
                }
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scale X"
                margin="normal"
                name="scalex"
                type="text"
                value={formikObj.values.scalex}
                variant="outlined"
                error={formikObj.touched.scalex && Boolean(formikObj.errors.scalex)}
                helperText={formikObj.touched.scalex && formikObj.errors.scalex}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scale Y"
                margin="normal"
                name="scaley"
                type="text"
                value={formikObj.values.scaley}
                variant="outlined"
                error={formikObj.touched.scaley && Boolean(formikObj.errors.scaley)}
                helperText={formikObj.touched.scaley && formikObj.errors.scaley}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="scale Z"
                margin="normal"
                name="scalez"
                type="text"
                value={formikObj.values.scalez}
                variant="outlined"
                error={formikObj.touched.scalez && Boolean(formikObj.errors.scalez)}
                helperText={formikObj.touched.scalez && formikObj.errors.scalez}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation X"
                margin="normal"
                name="rotationx"
                type="text"
                value={formikObj.values.rotationx}
                variant="outlined"
                error={
                  formikObj.touched.rotationx && Boolean(formikObj.errors.rotationx)
                }
                helperText={formikObj.touched.rotationx && formikObj.errors.rotationx}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation Y"
                margin="normal"
                name="rotationy"
                type="text"
                value={formikObj.values.rotationy}
                variant="outlined"
                error={
                  formikObj.touched.rotationy && Boolean(formikObj.errors.rotationy)
                }
                helperText={formikObj.touched.rotationy && formikObj.errors.rotationy}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="rotation Z"
                margin="normal"
                name="rotationz"
                type="text"
                value={formikObj.values.rotationz}
                variant="outlined"
                error={
                  formikObj.touched.rotationz && Boolean(formikObj.errors.rotationz)
                }
                helperText={formikObj.touched.rotationz && formikObj.errors.rotationz}
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </Formik>
      <Button
        size="median"
        variant="contained"
        onClick={() => {
          const data = {
            environmentId: currentEnv._id,
            objectName: formikObj.values.objectName,
            position: [formikObj.values.positionx,formikObj.values.positiony,formikObj.values.positionz].join(' '),
            scale: [formikObj.values.scalex,formikObj.values.scaley,formikObj.values.scalez].join(' '),
            rotation: [formikObj.values.rotationx,formikObj.values.rotationy,formikObj.values.rotationz].join(' '),
            url: selectedPublicObject.url,
          };
          console.log(data);
          createLocalObject(data);
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
                        _________________
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
                        _________________
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
                        const positions = data.position.split(" ");
                        const scales = data.scale.split(" ");
                        const rotations = data.rotation.split(" ");
                        formikUpt.values.positionx = positions[0];
                        formikUpt.values.positiony = positions[1];
                        formikUpt.values.positionz = positions[2];
                        formikUpt.values.scalex = scales[0];
                        formikUpt.values.scaley = scales[1];
                        formikUpt.values.scalez = scales[2];
                        formikUpt.values.rotationx = rotations[0];
                        formikUpt.values.rotationy = rotations[1];
                        formikUpt.values.rotationz = rotations[2];
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
    <Grid container spacing={2}>
      {environments.length > 0 ? (
        environments.map((data) => {
          return (
            <Grid item xs={6} key={data._id}>
              <Box mb={4}>
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
                        {data.preset.length > 0 ? (
                          <Typography>Preset:{data.preset} </Typography>
                        ) : (
                          <Typography></Typography>
                        )}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        gutterBottom
                      >
                        {data.video.length > 4 ? (
                          <Link href={data.video}>Download Link </Link>
                        ) : (
                          <Typography></Typography>
                        )}
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        setEnvModal(true);
                        setCurrentEnv(data);
                        getEnvironmentById(data._id);
                        setNormalObjects(
                          PublicObjects.filter(
                            (x) => x.objectType === "3D Object"
                          )
                        );
                      }}
                    >
                      Manage Objects
                    </Button>
                    <Button size="small" href={`/preview/` + data._id}>
                      Preview
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        deleteEnvironment(data);
                      }}
                    >
                      Delete
                    </Button>
                    {data.panorama.toString() === "false" &&
                    data.preset.length === 0 &&
                    data.video.length === 0 ? (
                        <Button
                          size="small"
                          onClick={() => {
                            formikUptEnv.values.floorColor = data.floorColor;
                            formikUptEnv.values.skyColor = data.skyColor;
                            setCurrentEnv(data);
                            setUpdateColorModal(true);
                          }}
                        >
                        Update Color
                        </Button>
                      ) : null}
                  </CardActions>
                </Card>{" "}
              </Box>
            </Grid>
          );
        })
      ) : (
        <Typography>No Data Available</Typography>
      )}
    </Grid>
  );
  return (
    <Box sx={{ mx: 4 }}>
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
      <EnhancedModal
        isOpen={updateColorModal}
        dialogTitle={currentEnv.environmentName}
        dialogContent={updateEnvironmentForm}
        options={{
          onClose: () => setUpdateColorModal(false),
          disableSubmit: true,
        }}
      />
      <Button
        sx={{ my: 2 }}
        variant="contained"
        onClick={() => setModalIsOpen(true)}
      >
        Create Environment
      </Button>
      {environmentsCard}
    </Box>
  );
};
