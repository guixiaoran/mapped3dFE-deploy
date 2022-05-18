import {
  Box,
  Typography,
  TextField,
  Button,
  CardContent,
  Card,
  Grid,
  CardActions,
  Link,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

import { useState, useCallback, useEffect } from "react";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { notify, EnhancedModal } from "components/index";
import { API } from "helpers";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
export const ObjectManager = () => {
  //upload objects variable
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [s3url, setS3url] = useState("");
  // get objects
  // const [objects, setObjects] = useState();
  const [PublicObjects, setPublicObjects] = useState([]);
  const isMounted = useIsMountedRef();
  // create public object
  const [creatObjectModal, setCreatObjectModal] = useState(false);
  const [objectType, setObjectType] = useState("");
  const objectTypeOptions = ["3D Object", "360 Image", "3D Video"];
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
  //uploadDataset
  const deletePublicObject = async (data) => {
    try {
      const response = await API.deletePublicObject(data._id);
      if (response.success) {
        getPublicObjects();
      } else {
        notify("delete Object  Failed");
      }
    } catch (err) {
      creatObjectModal(false);
    }
  };
  const createPublicObject = async (data) => {
    try {
      const response = await API.createPublicObject(data);
      if (response.success) {
        formik.values.objectType = "";
        formik.values.url = s3url;
        formik.values.objectName = "";
        setCreatObjectModal(false);
        setS3url("");
        setObjectType("");
        setIsFilePicked(false);
        getPublicObjects();
      } else {
        notify("object Creation Failed!!");
      }
    } catch (err) {
      setCreatObjectModal(false);
    }
  };

  let formik = useFormik({
    initialValues: {
      objectName: "",
      objectType: "object",
    },
    validationSchema: () => {
      return Yup.object().shape({
        // url: Yup.string().max(255).required("url Is Required"),
        objectName: Yup.string()
          .min(5)
          .max(255)
          .required("objectName Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        url: s3url,
        objectName: values.objectName,
        objectType: values.objectType,
      };
      console.log("data---->", data);
      createPublicObject(data);
    },
  });

  const uploadDataset = async (data) => {
    try {
      const response = await API.uploadDocument(data);
      if (response.success) {
        (response) => response.json();
      } else {
        notify("Data Uploading Failed!!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const changeHandler = (event) => {
    console.log("event.target.files[0]:", event.target.files[0]);
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      handleSubmission();
    }
  };

  const handleSubmission = useCallback(async () => {
    // HANDLING FILE AS SENDING FILE INTO BACKEND
    if (!isFilePicked) return;
    const formData = new FormData();
    formData.append("documentFile", selectedFile);
    //await fetch("http://localhost:8000/api/upload/uploadDocument", {
    const response = await API.uploadDocument(formData);
    if (response.success) {
      console.log("response.data--->", response.data.documentFileUrl.original);
      setS3url(response.data.documentFileUrl.original); //documentFileUrl.original
    }
    uploadDataset(formData);
  }, [isFilePicked, selectedFile]);

  useEffect(() => {
    handleSubmission();
  }, [handleSubmission]);

  let displayObjects = (
    <Grid container spacing={2}>
      {PublicObjects.length > 0 ? (
        PublicObjects.map((data) => {
          return (
            <Grid item xs={4} key={data._id}>
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
                        object Name: {data.objectName}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        gutterBottom
                      >
                        Object Type: {data.objectType}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        gutterBottom
                      >
                        {/* {data.url} */}
                        {data.url.length > 4 ? (
                          <Link href={data.url}>Download model </Link>
                        ) : (
                          <Typography>No Link Available</Typography>
                        )}
                        {/* <Link href={data.url}>Download model </Link> */}
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        deletePublicObject(data);
                      }}
                    >
                      Delete
                    </Button>
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
  useEffect(() => {
    handleSubmission();
  }, [selectedFile]);

  const handleTypeChange = (event) => {
    setObjectType(event.target.value);
    formik.values.objectType = event.target.value;
    console.log("event.target.value:", event.target.value);
  };

  let uploadObjectModal = (
    <FormControl fullWidth>
      <Typography>Choose File Type</Typography>
      <Select value={objectType} label="Object" onChange={handleTypeChange}>
        {objectTypeOptions.map((data, i) => {
          return (
            <MenuItem value={data} key={i}>
              {data}
            </MenuItem>
          );
        })}
      </Select>
      <div className="App">
        <input type="file" name="documentFile" onChange={changeHandler} />
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
          </div>
        ) : (
          <div>
            <p></p>
          </div>
        )}
      </div>
      <div>
        <Box>
          <Typography>File to upload: {s3url}</Typography>
          <Formik initialValues={formik.initialValues}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                label="Object Name"
                margin="normal"
                name="objectName"
                type="text"
                value={formik.values.objectName}
                variant="outlined"
                error={
                  formik.touched.objectName && Boolean(formik.errors.objectName)
                }
                helperText={
                  formik.touched.objectName && formik.errors.objectName
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                size="large"
                variant="contained"
                type="submit"
                onClick={() => setCreatObjectModal(false)}
              >
                Create Public Object
              </Button>
              <Button
                color="secondary"
                disabled={formik.isSubmitting}
                size="large"
                variant="contained"
                type="close"
                onClick={() => setCreatObjectModal(false)}
              >
                Close
              </Button>
            </form>
          </Formik>
        </Box>
      </div>
    </FormControl>
  );

  return (
    <Box sx={{ mx: 4 }}>
      <EnhancedModal
        isOpen={creatObjectModal}
        dialogTitle={`Create New Objecct`}
        dialogContent={uploadObjectModal}
        options={{
          // onClose: () => setCreatObjectModal(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <Button
        sx={{ my: 2 }}
        variant="contained"
        onClick={() => setCreatObjectModal(true)}
      >
        Upload Data
      </Button>
      {displayObjects}
    </Box>
  );
};
