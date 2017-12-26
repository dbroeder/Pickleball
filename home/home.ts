import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {PlayersProvider} from '../../providers/players/players'
import {NewPlayerPage} from '../new-player/new-player'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  playerNumber:number;
  picklePlayers = [];
  matches = [];
  b=true;
  in=false;
  singles=false;
  singleGame={
    player1:Playa,
    player2:Playa,
    courtNum:0
  };
  byeRound=false;
  byePlayer:Playa;
  buttonColor=[];
  sbuttonColor1='primary';
  sbuttonColor2='primary';
  rounds=0;

  constructor(public navCtrl: NavController) {
    
  }

  play(){
    this.picklePlayers=[];
    for(var person=1; person<=this.playerNumber;person++){
      this.picklePlayers.push(new Playa(person));
    }
    this.randomList(this.picklePlayers.length);
    this.matchups();
    this.b=false;
    this.in=true;

  }

  allHaveHadByes(){
    var check=false;
    for(var index=0;index<this.picklePlayers.length;index++){
      if(!this.picklePlayers[index].bye){
        check=true;
      }
    }
    if(!check){
      for(var index=0;index<this.picklePlayers.length;index++)
      {
        this.picklePlayers[index].bye=false;
      }
    }
  }

  allHavePlayedSingles(){
    var count=0;;
    for(var index=0;index<this.picklePlayers.length;index++){
      if(!this.picklePlayers[index].singles){
        count++;
      }
    }
    if(count<3){
      for(var index=0;index<this.picklePlayers.length;index++)
      {
        this.picklePlayers[index].singles=false;
      }
    }
  }

  matchups(){
    this.matches=[];
    if(this.picklePlayers.length%4===0){
      this.byeRound=false;
      this.singles=false;
      for(var index=0;index<this.picklePlayers.length;index+=4){
        this.matches.push(new DoublesGame(this.picklePlayers[index],this.picklePlayers[index+1],this.picklePlayers[index+2],this.picklePlayers[index+3],index/4+1))
      }
    }else if(this.picklePlayers.length%4===1){
      this.byeRound=true;
      this.singles=false;
      this.allHaveHadByes();
      while(this.picklePlayers[this.picklePlayers.length-1].bye){
        this.randomList(this.picklePlayers.length);
      }
      for(var index=0;index<this.picklePlayers.length-1;index+=4){
        this.matches.push(new DoublesGame(this.picklePlayers[index],this.picklePlayers[index+1],this.picklePlayers[index+2],this.picklePlayers[index+3],index/4+1))
      }
      this.byePlayer=this.picklePlayers[this.picklePlayers.length-1];
      this.picklePlayers[this.picklePlayers.length-1].bye=true;
    }
    else if(this.picklePlayers.length%4===3){
      this.allHaveHadByes();
      while(this.picklePlayers[this.picklePlayers.length-1].bye){
        this.randomList(this.picklePlayers.length);
      }
      this.byePlayer=this.picklePlayers[this.picklePlayers.length-1];
      this.picklePlayers[this.picklePlayers.length-1].bye=true;
      this.allHavePlayedSingles();
      while(this.picklePlayers[this.picklePlayers.length-2].singles){
        this.randomList(this.picklePlayers.length-1);
      }
      this.picklePlayers[this.picklePlayers.length-2].singles=true;
      this.singleGame.player1=this.picklePlayers[this.picklePlayers.length-2];
      while(this.picklePlayers[this.picklePlayers.length-3].singles){
        this.randomList(this.picklePlayers.length-2);
      }
      this.picklePlayers[this.picklePlayers.length-3].singles=true;
      this.singleGame.player2=this.picklePlayers[this.picklePlayers.length-3];
     
      this.singleGame.courtNum=Math.floor(this.picklePlayers.length/4)+1;
      this.sbuttonColor1='primary';
      this.sbuttonColor2='primary';
     
      this.byeRound=true;
      this.singles=true;
      for(var index=0;index<this.picklePlayers.length-3;index+=4){
        this.matches.push(new DoublesGame(this.picklePlayers[index],this.picklePlayers[index+1],this.picklePlayers[index+2],this.picklePlayers[index+3],index/4+1))
      }
    }
    else{
      this.byeRound=false;
      this.singles=true;
      this.allHavePlayedSingles();
      while(this.picklePlayers[this.picklePlayers.length-1].singles){
        this.randomList(this.picklePlayers.length);
      }
      this.sbuttonColor1='primary';
      this.sbuttonColor2='primary';
      this.picklePlayers[this.picklePlayers.length-1].singles=true;
      this.singleGame.player1=this.picklePlayers[this.picklePlayers.length-1];
      while(this.picklePlayers[this.picklePlayers.length-2].singles){
        this.randomList(this.picklePlayers.length-1);
      }
      this.picklePlayers[this.picklePlayers.length-2].singles=true;
      this.singleGame.player2=this.picklePlayers[this.picklePlayers.length-2];
     
      this.singleGame.courtNum=Math.floor(this.picklePlayers.length/4)+1;
      for(var index=0;index<this.picklePlayers.length-2;index+=4){
        this.matches.push(new DoublesGame(this.picklePlayers[index],this.picklePlayers[index+1],this.picklePlayers[index+2],this.picklePlayers[index+3],index/4+1))
      }
    }
    
  }

  winnerWinnerDoubles(cnum,bnum,plyr1,plyr2,plyr3,plyr4){
    if(bnum===1)
    {
      this.matches[cnum-1].buttonColor1='secondary';
    }else if(bnum===2){
      this.matches[cnum-1].buttonColor2='secondary';
    }
    for(var index=0;index<this.picklePlayers.length;index++){
      if(plyr1.id===this.picklePlayers[index].id||plyr1.id===this.picklePlayers[index].id)
      {
        this.picklePlayers[index].wins++;
      }else if(plyr3.id===this.picklePlayers[index].id||plyr4.id===this.picklePlayers[index].id)
      {
        this.picklePlayers[index].wins--;
      }
    }
  }

  winnerWinnerSingles(num,plyr1,plyr2){
    if(num===1)
    {
      this.sbuttonColor1='secondary';
    }else if(num===2){
      this.sbuttonColor2='secondary';
    }
    for(var index=0;index<this.picklePlayers.length;index++){
      if(plyr1.id===this.picklePlayers[index].id)
      {
        this.picklePlayers[index].wins++;
      }else if(plyr2.id===this.picklePlayers[index].id)
      {
        this.picklePlayers[index].wins--;
      }
    }
  }

  competeShuff(){

  }

  randomList(num){
    let m=num;
    for(var index=0;index<num;index++){
      let rn = Math.floor(Math.random()*m);
      console.log(rn);
      while(this.picklePlayers[index].id===this.picklePlayers[rn].id){
        rn = Math.floor(Math.random()*m);
      }
      let i = this.picklePlayers[index];
      this.picklePlayers[index]=this.picklePlayers[rn];
      this.picklePlayers[rn]=i;
      
    }
  }

  postGame(){
    for(var index=0;index<this.matches.length;index++){
      var counter=0;
      for(var dd=0;dd<4;dd++){
        while(this.matches[index].players[dd].id!==this.picklePlayers[counter].id){
          counter++;
        }
        this.picklePlayers[counter]=this.matches[index].players[dd];
      }

    }
  }

  nextRound(){
    this.rounds++;
    this.postGame();
    this.randomList(this.picklePlayers.length);
    this.matchups();
  }

  addPlayer(){
    this.picklePlayers.push(new Playa(this.picklePlayers.length+1));
    this.nextRound();
  }

}
class DoublesGame{
  buttonColor1='primary';
  buttonColor2='primary';
  court='';
  players=[]
  constructor(player1,player2,player3,player4,num){
    this.court=num;
    this.players.push(player1);
    this.players.push(player2);
    this.players.push(player3);
    this.players.push(player4);
  }
}

class Playa {
  public wins=0;
  public id: number;
  public bye=false;
  public singles=false;

  constructor(num){
    this.id=num;
  }

  winna_winna(){
    this.wins++;
  }

  byeRound(){
    this.bye=true;
  }

}
