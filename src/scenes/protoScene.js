import Phaser from "phaser";
import { WakeUpCard } from "./cards/ProtoSceneCards/wakeUpCard.js";
import { DialogueController, DIALOGUE_BOX_KEY } from "../core/dialogueController.js";
import { IntroCard } from "./cards/ProtoSceneCards/introCard.js";
import { ComputerCard } from "./cards/ProtoSceneCards/computerCard.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { ProtoGuy, ProtoGuyCard } from "../characters/protoGuy.js";
import { ZoomMiniGameCard } from "./cards/ProtoSceneCards/zoomMiniGameCard.js";
import { MessageCard } from "./cards/ProtoSceneCards/messageCard.js";

const CARDS = {
    INTRO: 0,
    WAKE_UP: 1,
    CHOSE_PATH: 2,
    CLOTHES: 3,
    KITCHEN: 4,
    COMPUTER: 5,
    MINI_GAME: 6,
    MESSAGE: 7
};
const NUM_CARDS = 8

export const ProtoGuyClothes = {
    PYJAMAS: 0,
    CLEAN_CLOTHES: 1,
    YESTERDAY_CLOTHES: 2
};

export class ProtoScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to now which card we are at
     * in said scene
     */
    constructor() {
        super({key: 'Prototype'});

        //Create all of the cards
        this.introCard = new IntroCard(this);

        this.wakeUpCard = new WakeUpCard(this);

        this.chosePathCard = new Card(this, [
            new Background(
                this,
                "/sprites/ProtoScene/ChosePathCard/bg.png",
                "choseBG"
            ),
            new CardObject(
                this,
                { name: "room", url: "sprites/ProtoScene/ChosePathCard/room.png" },
                new Phaser.Math.Vector2(1418, 1260),
                1
            ),
            new CardObject(
                this,
                { name: "closet", url: "sprites/ProtoScene/ChosePathCard/Closet.png" },
                new Phaser.Math.Vector2(460, 1340),
                0
            ),
            new ProtoGuy(this, 1270, 2080, ProtoGuyCard.CHOSE_PATH)
        ]);

        this.clothesCard = new Card(this, [
            new Background(
                this,
                "sprites/ProtoScene/ClothesCard/bg.jpg", 
                "ClothesBG"
            ),
            new CardObject(
                this,
                { name: "clothes", url: "sprites/ProtoScene/ClothesCard/clothes.png" },
                new Phaser.Math.Vector2(1545, 1376),
                0
            ),
            new CardObject(
                this,
                { name: "chair", url: "sprites/ProtoScene/ClothesCard/chair.png" },
                new Phaser.Math.Vector2(650, 2070),
                1
            ),
            new ProtoGuy(this, 1125, 1515, ProtoGuyCard.CLOTHES)
        ]);

        this.kitchenCard = new Card(this, [
            new Background(
                this,
                "sprites/ProtoScene/KitchenCard/bg.jpg",
                "KitchenBG",
            ),
            new ProtoGuy(this, 660, 1290, ProtoGuyCard.KITCHEN),
            new CardObject(
                this,
                { name: "fridge", url: "sprites/ProtoScene/KitchenCard/fridge.png" },
                new Phaser.Math.Vector2(1350, 1100),
                1,
                { name: "fridge_h", url: "sprites/ProtoScene/KitchenCard/fridge_highlight.png" }
            ),
            new CardObject(
                this,
                { name: "table", url: "sprites/ProtoScene/KitchenCard/table.png" },
                new Phaser.Math.Vector2(980, 2020)
            ),
            new CardObject(
                this,
                { name: "counter", url: "sprites/ProtoScene/KitchenCard/counter.png" },
                new Phaser.Math.Vector2(1025, 2190)
            ),
            new CardObject(
                this,
                { name: "sink", url: "sprites/ProtoScene/KitchenCard/sink.png" },
                new Phaser.Math.Vector2(1430, 2430),
                2,
                { name: "sink_h", url: "sprites/ProtoScene/KitchenCard/sink_highlight.png" }
            ),
            new CardObject(
                this,
                { name: "counter_stuff", url: "sprites/ProtoScene/KitchenCard/counter_stuff.png" },
                new Phaser.Math.Vector2(1300, 2550)
            ),
            new CardObject(
                this,
                { name: "toaster", url: "sprites/ProtoScene/KitchenCard/toaster.png" },
                new Phaser.Math.Vector2(390, 2520),
                0,
                { name: "toaster_h", url: "sprites/ProtoScene/KitchenCard/toaster_highlight.png" }
            ),
            new CardObject(
                this,
                { name: "lamp", url: "sprites/ProtoScene/KitchenCard/lamp.png" },
                new Phaser.Math.Vector2(1230, 555)
            )
        ]);

        this.computerCard = new ComputerCard(this);

        this.zoomMiniGame = new ZoomMiniGameCard(this);

        this.messageCard = new MessageCard(this);

        this.cards = [
            this.introCard,
            this.wakeUpCard,
            this.chosePathCard,
            this.clothesCard,
            this.kitchenCard,
            this.computerCard,
            this.zoomMiniGame,
            this.messageCard
        ];

        //Keep track of wich card is displayed
        this.cardIdx = CARDS.INTRO;
        this.current_card = this.zoomMiniGame;

        //Create the dialogue controller 
        this.dialogue = new DialogueController(this);

        //Keep track of the clothes that protoguy is wearing
        this.clothes = ProtoGuyClothes.PYJAMAS;
    }

    /**
     * @brief preload all of the elements of all of the cards 
     * that will be shown in the scene
     */
    preload() {
        //Load in the dialogue box
        this.load.spritesheet(
            DIALOGUE_BOX_KEY, 
            "sprites/UI/dialogueBox.png",
            { frameWidth: 1886, frameHeight: 413 }  
        );

        this.cards.forEach(card => card.preload());
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {
        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }
    }

    /**
     * @brief Update the scene
     */
    update() {
        if(this.current_card.isLoaded()) {
            this.current_card.update();
        }
    }

    /**
     * @brief Ends the current card
     */
    endCard() {
        this.current_card.endCard();
    }

    /**
     * @brief moves to the next card
     * @param {Number} choice the choice that was made
     */
    nextCard(choice) {

        if(this.cardIdx < NUM_CARDS - 1 && this.current_card.isDone()) {
            this.current_card.destroy();

            switch(this.cardIdx) {
                case CARDS.INTRO:
                    this.cardIdx = CARDS.WAKE_UP;
                    this.current_card = this.wakeUpCard;
                    //Load the next card
                    this.current_card.create();
                    break;

                case CARDS.WAKE_UP:
                        this.cardIdx = CARDS.CHOSE_PATH;
                        this.current_card = this.chosePathCard;
                        //Load the next card
                        this.current_card.create();
                    break;

                case CARDS.CHOSE_PATH:

                    //Chose the next card depending on the user's choice
                    switch(choice) {
                        //The Closet was selected
                        case 0:
                            this.cardIdx = CARDS.CLOTHES;
                            this.current_card = this.clothesCard;
                            this.current_card.create();
                            break;
                        
                        //The kitchen was selected
                        case 1:
                            this.cardIdx = CARDS.KITCHEN;
                            this.current_card = this.kitchenCard;
                            this.current_card.create();
                            break;
                        
                        //Proto guy was selected (back to bed)
                        case 2:
                            this.cardIdx = CARDS.WAKE_UP;
                            break;
                        
                        default:
                            break;
                        
                    }
                    
                    break;

                case CARDS.CLOTHES:
                    //Chose the next card depending on the user's choice
                    switch(choice) {
                        //The clean clothes were selected
                        case 0:
                            this.clothes = ProtoGuyClothes.CLEAN_CLOTHES;
                            this.cardIdx = CARDS.COMPUTER;
                            this.current_card = this.computerCard;
                            this.current_card.create();
                            break;
                        
                        //The chair was selected
                        case 1:
                            this.clothes = ProtoGuyClothes.YESTERDAY_CLOTHES;
                            this.cardIdx = CARDS.COMPUTER;
                            this.current_card = this.computerCard;
                            this.current_card.create();
                            break;
                        
                        //Proto guy was selected (pyjamas)
                        case 2:
                            this.clothes = ProtoGuyClothes.PYJAMAS;
                            this.cardIdx = CARDS.COMPUTER;
                            this.current_card = this.computerCard;
                            this.current_card.create();
                            break;
                        
                        default:
                            break;
                        
                    }
                    break;

                case CARDS.KITCHEN:
                    this.cardIdx = CARDS.COMPUTER;
                    this.current_card = this.computerCard;
                    this.current_card.create();
                    this.current_card.showItem(choice);
                    break;

                case CARDS.COMPUTER:
                    this.cardIdx = CARDS.MINI_GAME;
                    this.current_card = this.zoomMiniGame;
                    this.current_card.create();

                case CARDS.MINI_GAME:
                    this.cardIdx = CARDS.MESSAGE;
                    this.current_card = this.messageCard;
                    this.current_card.create();
                    break;
                    
                default:
                    break;
            }
        }
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }


}