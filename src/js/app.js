App = {
  web3Provider: null,
  contracts: {},
  account: 0x0 ,
  init: async function() {
    // Load pets.
   /* $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
   */

    return await App.initWeb3();
  },
// web3 helps interact with local ethereum nodes using http connection
  initWeb3: async function() {
   if (typeof web3 !== 'undefined'){
    //if web3 instance already provided by  metamask
    App.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
   }
   else{
    // specify default instance if no web3 instance provided
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
   }

    return App.initContract(); //works as a chain to call every function
  },

  initContract: function() {
    $.getJSON("contest.json", function(contest){
      //initialises truffle contract
      App.contracts.Contest = TruffleContract(contest);
      //connecting provider with contract
      App.contracts.Contest.setProvider(App.web3Provider);
    
      App.listenForEvents();
    return App.render();
    });
  },

 /* bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },*/

  //to just catch event and reload the page 
  listenForEvents: function(){
    App.contracts.Contest.deployed().then(function(instance){
      instance.votedEvent({},{
        fromBlock :0,
        toBlock: 'latest' 
      }).watch(function(error,event){
        console.log("event truggered", event)
        //reload when new vote recirded
        App.render();
      });
    });
  },
  render: function(){
      var contestantInstance;
      var loader = $("#loader");
      var content = $("#content");
      loader.show();
      content.hide();

      //loading account data
      web3.eth.getCoinbase(function(err, account){
        if (err==null){
          App.account = account;
          $("#accountAddress").html("your account: "+ account );
        } 
      });

      // to load contract data
      App.contracts.Contest.deployed().then(function(instance){
        contestantInstance = instance;
        return contestantInstance.contestantsCount();
        }).then(function(contestantsCount){
        var contestantResults = $("#contestantResults");
        contestantResults.empty();
        var contestantSelect = $('#contestantSelect');
        contestantSelect.empty();

        for(var i=1 ; i<=contestantsCount; i++){
          contestantInstance.contestants(i).then(function(contestant){
            var id = contestant[0];
            var name = contestant[1];
            var voteCount =contestant[2];
            //renders the table and values
            var contestantTemplate = "<tr><th>"+id +"</th><td>"+name+"</td><td>"+voteCount+"</td></tr>"
            // renders the options available to vote  
            var contestantOption = "<option value ='"+id+"'>"+name+"</option>"
            contestantResults.append(contestantTemplate);
            contestantSelect.append(contestantOption);
          });
        }
      loader.hide();
      content.show();
      }).catch(function(error){
        console.warn(error);
      });
    },
  castVote : function(){
    var contestantId = $('#contestantSelect').val();
    App.contracts.Contest.deployed().then(function(instance){
      return instance.vote(contestantId, {from : App.account});
    }).then(function(result){
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err){
      console.error(err);
    });
  }


//};
 // markAdopted: function(adopters, account) {
    /*
     * Replace me...
     
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  //}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
