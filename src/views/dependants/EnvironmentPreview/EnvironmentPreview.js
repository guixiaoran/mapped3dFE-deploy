import "aframe";
import "aframe-environment-component";
import "AframeComponent";
import { useState, useEffect, useCallback } from "react";
import { Scene } from "aframe-react";
import { notify } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { API } from "helpers";
import { useParams } from "react-router-dom";

export const EnvironmentPreview = () => {
  const params = useParams();
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
          // console.log("in thisEnvDetail :", objects);
          // console.log("this is Environment", environment);
        } else {
          notify("Failed to Fetch Env List");
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMounted]
  );
  /**
   * Four Environment Ids for demo
   *
   * 360 video : 6204451d9bfe7f1ea9cd50e4
   * 360 image : 6204f53c06e56139b4cde0f9
   * Preset Environment : 6204f75706e56139b4cde116
   * Default Environment : 6204f8de06e56139b4cde13e
   *
   */
  useEffect(() => {
    getEnvironmentById(params.id);
  }, [getEnvironmentById]);

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
          : environment.map((data) =>
            data.video
              ? environment.map((data) => (
                <Scene
                  key={data._id}
                  id="mainScene"
                  background="color:black"
                  className="menu"
                >
                  <a-videosphere
                    rotation="0 -90 0"
                    src="#video"
                    play-on-click
                  ></a-videosphere>
                  <a-assets>
                    {environment ? (
                      environment.map((data, i) => (
                        <video
                          key={i}
                          id="video"
                          autoPlay
                          loop
                          crossOrigin="anonymous"
                          playsInline
                          webkit-playsinline="true"
                          src={data.video}
                        ></video>
                      ))
                    ) : (
                      <a-asset-item></a-asset-item>
                    )}
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
              : environment.map((data) =>
                data.panorama
                  ? environment.map((data) => (
                    <Scene
                      key={data._id}
                      id="mainScene"
                      background="color:black"
                      className="menu"
                    >
                      {environment ? (
                        environment.map((data, i) => (
                          <a-sky
                            key={i}
                            id="sky"
                            src={data.skyUrl}
                            rotation="0 -130 0"
                          ></a-sky>
                        ))
                      ) : (
                        <a-sky></a-sky>
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
                  : environment.map((data) => (
                    <Scene
                      key={data._id}
                      id="mainScene"
                      background="color:black"
                      className="menu"
                    >
                      {environment ? (
                        environment.map((data) => (
                          <a-sky
                            key={data._id}
                            color={data.skyColor}
                          ></a-sky>
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
              )
          )
      )}
    </>
  );
  return <>{env}</>;
};
