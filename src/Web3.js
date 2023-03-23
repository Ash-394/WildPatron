const Web3 = require('web3');
const quicknodeUrl = '<https://api.quicknode.com/graphql>';
const web3 = new Web3(quicknodeUrl);

// Test the connection by getting the network ID
web3.eth.net.getId()
  .then((networkId) => console.log('Connected to network with ID:', networkId))
  .catch((error) => console.error('Failed to connect:', error));
