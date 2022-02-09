import "aframe";
import "aframe-environment-component";
import { useState, useEffect, useCallback } from "react";
import { Scene } from "aframe-react";
import { notify } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { API } from "helpers";

export const EnvironmentPreview = () => {
  const [environments, setEnvironments] = useState([]);
  const isMounted = useIsMountedRef();
  const [objects, setObjects] = useState([]);

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

  let env = (
    <>
      {environments ? (
        environments.map((data) => (
          
          <Scene
            key=""
            id="mainScene"
            background="color:black"
            environment={"preset:" + data.preset}
            className="menu"
          >
            {environments ? (
              environments.map((data) => <a-sky key={data._id} color={data.skyColor}></a-sky>)
            ) : (
              <a-sky></a-sky>
            )}

            {environments ? (
              environments.map((data) => (
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
      ) : (
        <Scene
          id="mainScene"
          background="color:black"
          environment="preset:egypt"
          className="menu"
        ></Scene>
      )}
    </>
  );
  return <>{env}</>;
};

