import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  // CardContent,
  // Card,
  // Grid,
} from "@mui/material";
import { LayoutConfig } from "constants/index";
import { useState, useCallback, useEffect } from "react";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { notify, EnhancedTable, EnhancedModal } from "components/index";
import { API } from "helpers";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
export const ObjectManager = () => {
  //upload objects variable
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [s3url, setS3url] = useState("");
  // get objects
  const [objects, setObjects] = useState();
  const [PublicObjects, setPublicObjects] = useState([]);
  const isMounted = useIsMountedRef();
  // create public object
  const [creatObjectModal, setCreatObjectModal] = useState(false);
  //getLocalObjects
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
  //getPublicObjects
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
  const createPublicObject = async (data) => {
    try {
      const response = await API.createPublicObject(data);
      if (response.success) {
        // formik.values.dataURL = s3url;
        formik.values.url = s3url;
        formik.values.objectName = "";
        setCreatObjectModal(false);
        // getDatasets();
        getPublicObjects();
      } else {
        notify("data entry Creation Failed!!");
      }
    } catch (err) {
      setCreatObjectModal(false);
    }
  };

  let formik = useFormik({
    initialValues: {
      objectName: "",
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
      };
      console.log("data---->", data);
      createPublicObject(data);
    },
  });

  const uploadDataset = async (data) => {
    // console.log(data, "dt");
    try {
      const response = await API.uploadDocument(data);
      if (response.success) {
        (response) => response.json();
      } else {
        notify("Data Uploading Failed!!");
      }
    } catch (err) {
      // setDataModalOpen(false);
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
    console.log(selectedFile, "file");
    formData.append("documentFile", selectedFile);
    console.log("11from11", formData);
    await fetch("http://localhost:8000/api/upload/uploadDocument", {
      method: "POST",
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setS3url(data.data.documentFileUrl.original);
        // console.log("s3------>", s3url);
      });

    uploadDataset(formData);
  }, [isFilePicked, selectedFile]);

  useEffect(() => {
    handleSubmission();
  }, [selectedFile]);

  let uploadObjectModal = (
    <Container>
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
            </form>
          </Formik>
        </Box>
      </div>
    </Container>
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
        <EnhancedModal
          isOpen={creatObjectModal}
          dialogTitle={`create new Objecct`}
          dialogContent={uploadObjectModal}
          options={{
            onClose: () => setCreatObjectModal(false),
            disableSubmit: true,
            // disableClose: true,
          }}
        />
        <Button
          // size="middle"
          variant="contained"
          onClick={() => setCreatObjectModal(true)}
        >
          Upload Data
        </Button>
        <EnhancedTable
          data={PublicObjects}
          title="Public Objects Manager"
          options={{
            ignoreKeys: [
              "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
              "createdAt",
            ],
          }}
        />
        <EnhancedTable
          data={objects}
          title="Local Objects Manager"
          options={{
            ignoreKeys: [
              "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
              "createdAt",
            ],
          }}
        />
      </Container>
    </Box>
  );
};

// let displayObjects = (
//   <Grid Container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//     {objects.length > 0 ? (
//       objects.map((data) => {
//         return (
//           <Box key={data._id} mb={4}>
//             <Card width={50}>
//               <CardContent>
//                 <div style={{ width: 300, whiteSpace: "nowrap" }}>
//                   <Typography
//                     component="div"
//                     sx={{
//                       textOverflow: "ellipsis",
//                       overflow: "hidden",
//                     }}
//                     gutterBottom
//                   >
//                     {data.name}
//                     {/* {data._id} */}
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       textOverflow: "ellipsis",
//                       overflow: "hidden",
//                     }}
//                     gutterBottom
//                   >
//                     {/* {data.dataURL} */}
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       textOverflow: "ellipsis",
//                       overflow: "hidden",
//                     }}
//                     gutterBottom
//                   >
//                     {/* {data.description} */}
//                   </Typography>
//                 </div>
//               </CardContent>
//             </Card>{" "}
//           </Box>
//         );
//       })
//     ) : (
//       <Typography>No Data Available</Typography>
//     )}
//   </Grid>
// );
