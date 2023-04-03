import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomInput, PageHOC, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      console.log(contract);
      console.log(walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);

      const players = await contract.getAllPlayers();
      console.log(players);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      if (!contract) return;
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);
      // console.log(playerExists, playerTokenExists);
      if (playerExists && playerTokenExists) {
        navigate("/create-battle");
      }
    };
    checkForPlayerToken();
  }, [contract, walletAddress]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />

      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);
