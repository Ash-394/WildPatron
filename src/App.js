import "./App.css";
import Home from "./components/home";
import { Campaigns } from "./components/Campaigns";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import celogram from "./contracts/wildpatron.abi.json";
import IERC from "./contracts/IERC.abi.json";
import { Auth } from "@arcana/auth-react";

const ERC20_DECIMALS = 18;
const contractAddress = "0xE66Fbe6b364b758c7560969d13993aC9568c5Bb5";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [animals, setCampaigns] = useState([]);
  //const provider = new AuthProvider(process.env.REACT_APP_ARCANA_APP_ID,chainConfig:{chainId: 42220});

  const connectToWallet = async () => {
    if (window.celo || window.ethereum) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Install a wallet");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(celogram, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  const getAnimals = useCallback(async () => {
    const animalsLength = await contract.methods.getAnimalLength().call();
    const animals = [];
    for (let index = 0; index < animalsLength; index++) {
      let _animals = new Promise(async (resolve, reject) => {
        let animal = await contract.methods.getAnimal(index).call();

        resolve({
          index: index,
          image: animal[0],
          description: animal[1],
          beneficiary: animal[2],
          totalRaised: animal[3],
          goal: animal[4],
        });
      });
      animals.push(_animals);
    }

    const _animals = await Promise.all(animals);
    setCampaigns(_animals);
  }, [contract]);

  const addAnimal = async (_image, _description, _beneficiary, _goal) => {
    try {
      await contract.methods
        .createAnimal(_image, _description, _beneficiary, _goal)
        .send({ from: address });
      getAnimals();
    } catch (error) {
      alert(error);
    }
  };

  const fundAnimal = async (_index, _amount) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);

      await cUSDContract.methods
        .approve(contractAddress, _amount)
        .send({ from: address });
      await contract.methods
        .fundCampaign(_index, _amount)
        .send({ from: address });
      getAnimals();
      getBalance();
      alert("you have successfully sent cusd to this user");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getCampaigns();
    }
  }, [contract, getAnimal]);

  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addAnimal={addAnimal} />
      <Campaigns
        animals = {animals}
        fundAnimal={fundAnimal}
        walletAddress={address}
      />
    </div>
  );
}

export default App;
