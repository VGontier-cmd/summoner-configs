import React, { useEffect, useState } from 'react';
import Starter from '@/pages/Starter'
import Home from '@/pages/Home'

const { exec } = require('child_process');

function App() {
  const [isLeagueOfLegendsOpen, setIsLeagueOfLegendsOpen] = useState(false);
  const time = 5000;
  const execApp = 'LeagueClientUx.exe';

  useEffect(() => {
    // On met à jour l'état d'ouverture de l'application 'League of Legends'
    const checkLeagueOfLegendsStatus = () => {
      return new Promise<void>((resolve, reject) => {
        exec(`tasklist /fi "imagename eq ${execApp}"`, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            reject(error);
            return;
          }

          const isOpen = stdout.includes(execApp);
          setIsLeagueOfLegendsOpen(isOpen);
          resolve();
        });
      });
    };

    // On vérifie l'état d'ouverture de l'application 'League of Legends' toutes les 5 secondes
    const startChecking = async () => {
      while (true) {
        try {
          await checkLeagueOfLegendsStatus();
        } catch (error) {
          console.error(error);
        }

        await new Promise<void>((resolve) => setTimeout(resolve, time));
      }
    };

    startChecking();
  }, []);

  return (
    <>
      {isLeagueOfLegendsOpen ? (
        <Home />
      ) : (
        <Starter />
      )}
    </>
  )
}

export default App
