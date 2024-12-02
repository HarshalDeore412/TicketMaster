import React from "react";
import Header from "../Header";
import { useState, useEffect } from "react";
import Loader from "../Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Network = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLocalIPs = async () => {
      try {
        setLoading(true);
        const RTCPeerConnection =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection;
        if (!RTCPeerConnection) {
          toast.error("WebRTC is not supported by your browser.");
          setLoading(false);
          return;
        }

        const peerConnection = new RTCPeerConnection({ iceServers: [] });
        const localIPs = new Set();

        peerConnection.createDataChannel("");
        peerConnection.createOffer().then(
          (sdp) => peerConnection.setLocalDescription(sdp),
          (error) => {
            toast.error("Failed to create offer: " + error.message);
            setLoading(false);
          }
        );

        peerConnection.onicecandidate = (event) => {
          if (!event || !event.candidate || !event.candidate.candidate) return;
          const candidate = event.candidate.candidate;
          const ipMatches = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatches) {
            const ipAddress = ipMatches[1];
            if (!localIPs.has(ipAddress)) {
              localIPs.add(ipAddress);
              setDevices((prevDevices) => [
                ...prevDevices,
                { ip: ipAddress, mac: "N/A" },
              ]);
            }
          }
        };

        peerConnection.onicegatheringstatechange = () => {
          if (peerConnection.iceGatheringState === "complete") {
            setLoading(false);
            peerConnection.close();
          }
        };
      } catch (error) {
        toast.error("Error occurred: " + error.message);
        setLoading(false);
      }
    };

    getLocalIPs();
  }, []);

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="App">
            <h1>Connected Devices</h1>
            <table>
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>MAC Address</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={index}>
                    <td>{device.ip}</td>
                    <td>{device.mac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Network;
