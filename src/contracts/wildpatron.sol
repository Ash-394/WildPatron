// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract WildPatron {

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    uint internal totalAnimals = 0;

 
    struct Animal {
        string image;
        string description;
        address beneficiary;
        uint totalRaised;
        uint goal;
    }
    
    // Mapping to store animals
    mapping(uint => Animal) public animals;
    

    event AnimalAdded(
        address indexed beneficiary,
        uint goal
    );
    
    
    event AnimalFunded(
        address indexed beneficiary,
        uint amount
    );
    

    event AnimalGoalReached(
        address indexed beneficiary
    );
    
    
    function AddAnimal(string memory _image, string memory _description, address _beneficiary, uint _goal) public {
        // Only the beneficiary can add an amimal that needs funding
        require(msg.sender == _beneficiary);
       

        Animal storage animal = animals[totalAnimals];
        animal.image = _image;
        animal.description = _description;
        animal.beneficiary = _beneficiary;
        animal.totalRaised = 0;
        animal.goal = _goal;
        totalAnimals ++;
        
        
        emit AnimalAdded(_beneficiary, _goal);
    }
    
    
    function fundAnimal(uint _animalId, uint _amount) public payable {
    
        Animal storage animal = animals[_animalId];
        
        require(msg.sender != animal.beneficiary);
        require(animal.totalRaised < animal.goal, "Campaign goal reached");
        
        // Add the amount to the total raised
        animal.totalRaised += _amount;
        
        // Transfer the amount to the beneficiary
         require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                animal.beneficiary,
                _amount
            ),
            "Transfer failed."
        );
 
        
    
        emit AnimalFunded(animal.beneficiary, _amount);
        
        
        if (animal.totalRaised >= animal.goal) {
            // Emit the CampaignGoalReached event
            emit AnimalGoalReached(animal.beneficiary);
        }
    }
    
    function getAnimal(uint256 _animalId)
        public
        view
        returns (
            string memory,
            string memory,
            address,
            uint,
            uint
        )
    {
         Animal storage animal = animals[_animalId];
        return (
            animal.image,
            animal.description,
            animal.beneficiary,
            animal.totalRaised,
            animal.goal
        );
    }

     function getAnimalLength() public view returns (uint256){
         return (totalAnimals);
     }
}