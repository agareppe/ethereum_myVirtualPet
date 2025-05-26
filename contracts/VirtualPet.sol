pragma solidity ^0.4.21;


contract VirtualPet {

    address gameOwner;

    struct Player {
        string name;
        Pet vPet;
        address[] requests;
        uint requestsLength;
    }

    struct Pet {
        uint energyLevel;
        string image;
        string name;
    }

    mapping(address => Player)  players;
    address[] public playerList;

    //Events
    event PlayRequest(address requester,address invited);
    event NewPlayer();

    modifier onlyOwner {
        if(msg.sender != gameOwner) revert();
        _;
    }

    function VirtualPet() public {
        gameOwner = msg.sender;
    }

    function addPlayer(string name, string petName, string petImage) public returns(address){
        require(!isEmpty(name)); 
        Player storage player = players[msg.sender];
        
        player.name=name;
        player.vPet.energyLevel=100;
        player.vPet.image=petImage;
        player.vPet.name=petName;
        player.requestsLength=0;

        playerList.push(msg.sender);
        emit NewPlayer();

        return msg.sender;
    }

    function updatePlayer(string name, string petName, string petImage) public {
        require(!isEmpty(name)); 
        Player storage player = players[msg.sender];
        
        player.name=name;
        player.vPet.image=petImage;
        player.vPet.name=petName;
        player.requestsLength=0;

        playerList.push(msg.sender);
        emit NewPlayer();
    }

    function isEmpty (string a) pure private returns (bool)  {
        bytes memory testEmptyString = bytes(a);
        return testEmptyString.length == 0;
    }

    function sendPlayRequest(address friend) public {
        Player storage player = players[friend];
        require(!isEmpty(player.name)); //exists
        address[] storage rqs = player.requests;
        rqs.push(msg.sender);
        player.requestsLength++;
        //emit PlayRequest(msg.sender,friend);
    }

    function getPlayerData() view public returns (string ,string,string,uint) {
        return getPetDataByPlayer(msg.sender);
    }

    function getPetDataByPlayer(address playerAddr) view public returns (string ,string,string,uint){
        Player storage player = players[playerAddr];
        require(!isEmpty(player.name)); //exists
        return (player.name,player.vPet.name,player.vPet.image,player.vPet.energyLevel);
        
    }

    function iamTheOwner() view public returns (bool){
         return (msg.sender == gameOwner);
    }

    function getPlayersLength() view public returns (uint){   
        return playerList.length;
    }

    function getPlayerAddress(uint idx) view public returns (address){
        //require(idx < playerList.length);
        return playerList[idx];
    }

    function letsPlay(address requestAddress) public {
        Player storage player = players[msg.sender];
        if(player.requestsLength > 0 ){
            uint index=0;
            while(index<player.requestsLength && requestAddress!=player.requests[index]){
                index++;
            }
            if(index<=player.requestsLength-1){
                for (uint i = index; i<player.requestsLength-1; i++){
                    player.requests[i] = player.requests[i+1];
                }
            }
            delete player.requests[player.requestsLength-1];
            player.requestsLength--;
        }

        
        if(player.vPet.energyLevel<100){
            player.vPet.energyLevel++;
        }
        if(players[requestAddress].vPet.energyLevel<100){
            players[requestAddress].vPet.energyLevel++;
        }
        
    }

    function getPlayRequestLength() view public returns(uint){
        Player memory player = players[msg.sender];
        return player.requestsLength;
    }

    function getPlayRequest(uint idx) view public returns(address) {
        Player memory player = players[msg.sender];
        address adds =  player.requests[idx];
        return adds;
    }

    function decrementEnergyLevel(address adr, uint level) public onlyOwner {
        Player storage player = players[adr];
        if(player.vPet.energyLevel>level){
            player.vPet.energyLevel = player.vPet.energyLevel-level;
        }else{
            player.vPet.energyLevel = 0;
        }
    }


}