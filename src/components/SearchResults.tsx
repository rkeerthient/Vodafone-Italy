import { useChatState } from "@yext/chat-headless-react";
import { motion } from "framer-motion";
import * as React from "react";
import { useState } from "react";
import { MdDirections } from "react-icons/md";
import FAQCard from "./FAQCard";
import Map, { Marker } from "react-map-gl";

export default function SearchResults() {
  const queryResult = useChatState((s) => s.conversation.notes?.queryResult);
  const isLoading = useChatState((s) => s.conversation.isLoading);
  return (
    <div className="w-full flex flex-col gap-y-6">
      {!queryResult && isLoading && <>Loading</>}
      {queryResult && (
        <div>
          {queryResult.modules.map((module, index) => {
            switch (module.verticalConfigId) {
              case "help_articles": {
                return (
                  <div className="px-4  gap-x-4 gap-y-6">
                    {module.results.map((result, rindex) => {
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          // Delay increases slightly for each result
                          transition={{ duration: 0.5, delay: rindex * 0.1 }}
                          key={`result-${index}-${rindex}`}
                          className="rounded-lg overflow-hidden"
                        >
                          <FAQCard {...result}></FAQCard>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              }
              case "locations": {
                return (
                  <div className="flex flex-row gap-x-10">
                    <div className="flex flex-col divide-y divide-gray-200 w-full">
                      {module.results.map((result, rindex) => {
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            // Delay increases slightly for each result
                            transition={{ duration: 0.5, delay: rindex * 0.1 }}
                            className="flex flex-row"
                          >
                            <div
                              key={`map-res-${rindex}`}
                              className="py-6 flex flex-col gap-y-2 w-full"
                            >
                              <a
                                target="_blank"
                                className="text-slate-800 font-medium hover:underline"
                                href={result.data.c_deployedURL ?? "/"}
                              >
                                {result.data.name}
                              </a>
                              <div className="text-sm text-slate-800">
                                {result.data.address.line1}
                              </div>
                              <div className="text-sm text-slate-800">
                                {result.data.address.city},{" "}
                                {result.data.address.region}{" "}
                                {result.data.address.postalCode}
                              </div>
                            </div>
                            <a
                              target="_blank"
                              href={`https://www.google.com/maps/dir/?api=1&destination=${result.data.yextDisplayCoordinate.latitude},${result.data.yextDisplayCoordinate.longitude}`}
                              className="my-auto mx-auto flex flex-col gap-y-2"
                            >
                              <div className="mx-auto rounded-full p-1 border border-blue-800/50">
                                <MdDirections className="h-7 w-7 text-blue-900" />
                              </div>
                              <div className="text-sm text-blue-900">
                                Directions
                              </div>
                            </a>
                          </motion.div>
                        );
                      })}
                    </div>
                    <Map
                      mapLib={import("mapbox-gl")}
                      mapboxAccessToken="pk.eyJ1IjoibWRhdmlzaCIsImEiOiJja3pkNzZ4cDYydmF6MnZtemZrNXJxYmtvIn0.9CYfaiw9PB90VlQEqt3dRQ"
                      initialViewState={{
                        longitude: -100,
                        latitude: 40,
                        zoom: 3.5,
                      }}
                      style={{
                        color: "blue",
                        width: "45vw",
                        height: "66vh",
                        flexShrink: 0,
                      }}
                      mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                      {module.results.map((result) => {
                        return (
                          <Marker
                            latitude={
                              result.data.yextDisplayCoordinate.latitude
                            }
                            longitude={
                              result.data.yextDisplayCoordinate.longitude
                            }
                          />
                        );
                      })}
                    </Map>
                  </div>
                );
              }
            }
          })}
        </div>
      )}
    </div>
  );
}
