import "aframe";
import "aframe-environment-component";
import { useState, useEffect, useCallback } from "react";
import { Scene } from "aframe-react";
import { notify } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { API } from "helpers";

export const EnvironmentPreview = () => {
  const isMounted = useIsMountedRef();
  const [environment, setEnvironment] = useState([]);
  const [objects, setObject] = useState([]);

  const getEnvironmentById = useCallback(
    async (_id) => {
      try {
        const response = await API.getEnvironmentById(_id);
        console.log("in this ID", _id);
        if (response.success) {
          setEnvironment(response.data.data);
          setObject(response.data.localObjects);
          console.log("in thisEnvDetail :", objects);
          console.log("this is Environment", environment);
        } else {
          // setEnvironments([]);
          notify("Failed to Fetch Env List");
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMounted]
  );

  useEffect(() => {
    getEnvironmentById("6204451d9bfe7f1ea9cd50e4");
  }, [getEnvironmentById]);

  console.log(objects);
  console.log(environment);
  if (environment.map((data) => data.preset)) {
    console.log("HEllo");
  }

  let env = (
    <>
      {environment.map((data) =>
        data.preset
          ? environment.map((data) => (
            <Scene
              key={data._id}
              id="mainScene"
              background="color:black"
              environment={"preset:" + data.preset}
              className="menu"
            >
              <a-assets>
                {objects ? (
                  objects.map((data) => (
                    <a-asset-item
                      key={data._id}
                      id={data.objectName}
                      src={data.url}
                    ></a-asset-item>
                  ))
                ) : (
                  <a-asset-item></a-asset-item>
                )}
              </a-assets>
              {objects ? (
                objects.map((data) => (
                  <a-gltf-model
                    key={data._id}
                    src={"#" + data.objectName}
                    position={data.position}
                    scale={data.scale}
                    rotation={data.rotation}
                  ></a-gltf-model>
                ))
              ) : (
                <a-gltf-model></a-gltf-model>
              )}
            </Scene>
          ))
          : environment.map((data) => (
            <Scene
              key={data._id}
              id="mainScene"
              background="color:black"
              className="menu"
            >
              {environment ? (
                environment.map((data) => (
                  <a-sky key={data._id} color={data.skyColor}></a-sky>
                ))
              ) : (
                <a-sky></a-sky>
              )}

              {environment ? (
                environment.map((data) => (
                  <a-plane
                    key={data._id}
                    id="plane"
                    position="0 0 -4"
                    rotation="-90 0 0"
                    scale="100 100 100"
                    width="100"
                    height="100"
                    color={data.floorColor}
                  ></a-plane>
                ))
              ) : (
                <a-plane></a-plane>
              )}
              <a-assets>
                {objects ? (
                  objects.map((data) => (
                    <a-asset-item
                      key={data._id}
                      id={data.objectName}
                      src={data.url}
                    ></a-asset-item>
                  ))
                ) : (
                  <a-asset-item></a-asset-item>
                )}
              </a-assets>
              {objects ? (
                objects.map((data) => (
                  <a-gltf-model
                    key={data._id}
                    src={"#" + data.objectName}
                    position={data.position}
                    scale={data.scale}
                    rotation={data.rotation}
                  ></a-gltf-model>
                ))
              ) : (
                <a-gltf-model></a-gltf-model>
              )}
            </Scene>
          ))
      )}
    </>
  );
  return <>{env}</>;
};
