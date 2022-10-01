import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/images/logo.png";

const Home = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const installApp = async () => {
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const openApp = () => {
    const appUrl = window.location.href.replace("/home", "/");
    if (installPrompt == null) window.open(appUrl, "_blank");
    else installApp();
  };

  const beforeInstallPrompt = (e: any) => {
    e.preventDefault();
    setInstallPrompt(e);
  };

  const appInstalled = () => {
    setInstallPrompt(null);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    window.addEventListener("appinstalled", appInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
      window.removeEventListener("appinstalled", appInstalled);
    }
  }, []);

  return (
    <div className="h-screen">
      <div className="h-screen flex flex-col justify-center items-center">
        <img
          src={Logo}
          alt="test logo"
          className="w-20 h-20 text-gray-600 block"
        />
        <p className="mb-6 text-sm"> Messenger </p>
        <AnimatePresence>
          {installPrompt !== null ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={installApp}
              className="bg-blue-500 text-white rounded shadow-md px-4 py-2 block"
            >
              Install App
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={openApp}
              className="bg-blue-500 text-white rounded shadow-md px-4 py-2 block"
            >
              Open App
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
