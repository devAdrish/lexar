import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logo.png";

const Home = () => {
  const [installPrompt, setInstallPrompt] = useState<allAnyTypes>(null);
  const [appIsInstalled, setAppIsInstalled] = useState<boolean>(false);

  const installApp = async () => {
    if (appIsInstalled) {
      const appUrl = window.location.href.replace("/home", "/");
      window.open(appUrl, "_blank");
      return;
    }

    if (installPrompt === null) {
      window.location.reload();
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setAppIsInstalled(true);
    }
  };

  const beforeInstallPrompt = (e: any) => {
    e.preventDefault();
    setInstallPrompt(e);
  };

  const appInstalled = () => {
    setAppIsInstalled(true);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    window.addEventListener("appinstalled", appInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
      window.removeEventListener("appinstalled", appInstalled);
    };
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

        <button
          onClick={installApp}
          className="bg-blue-500 text-white rounded shadow-md px-4 py-2 block"
        >
          Install App
        </button>
      </div>
    </div>
  );
};

export default Home;
