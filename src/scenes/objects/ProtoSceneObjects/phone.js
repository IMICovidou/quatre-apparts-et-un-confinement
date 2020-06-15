import Phaser from "phaser";
import { CardObject } from "../cardObject";

/**
 * @brief FSM states used for the phone's animation
 */
const phoneState = {
    IDLE: 'idle',
    MOVE_LEFT: 'left',
    MOVE_RIGHT: 'right',
    DONE: 'done'
};

const PHONE_MOVEMENT = 10;
const RING_MOVEMENT = 20;

const WAKE_UP_ID = "reveil";

/**
 * @brief Models the ProtoGuy's phone as a custom sprite
 */
export class Phone extends CardObject {
    /**
     * @brief Creates the phone as a custom sprite
     * @param parent_scene, the scene in which the phone is contained 
     * @param x, the phone's x position in the scene
     * @param y, the phone's y position in the scene
     */
    constructor(parent_scene, x, y) {
        //Call base contructor
        super(
            parent_scene,
            "phone",
            "sprites/ProtoScene/WakeUpCard/phone.png", // URL relatif: on va surement pas heberger à la racine
            new Phaser.Math.Vector2(x, y),
            false
        );

        //All of the "ringing" sprite urls
        
        // Plutot une sprite sheet!
        // this.ring_urls = [
        //     "sprites/ProtoScene/WakeUpCard/ring1.png",
        //     "sprites/ProtoScene/WakeUpCard/ring2.png",
        //     "sprites/ProtoScene/WakeUpCard/ring3.png"
        // ];
        
        this.cur_state = phoneState.IDLE;
    }

    /**
     * @brief loads in the sprite needed to display the phone
     */
    preload() {
        super.preload();

        this.parent_scene.load.spritesheet('ring', 'sprites/ProtoScene/WakeUpCard/ring_spritesheet.png', { frameWidth: 300, frameHeight: 99 });
        
        //Load the ringing sprites
        /*let i = 1;
        this.ring_urls.forEach(url => {
            this.parent_scene.load.image("ring" + i++, url);
        });*/
    }

    /**
     * @brief created the phone and places it in the scene
     */
    create() {
        super.create();
        this.sprite.setOrigin(0, 0);
        this.sprite.setScale(1);
        
        // Create ring sprites

        let parent_scene_this_gets_really_verbose = this.parent_scene;
        this.parent_scene.anims.create({
          key: 'phone-ring',
          frameRate: 12,
          frames: this.parent_scene.anims.generateFrameNames('ring'),
          repeat: 5
        });
        let ringSprite = this.parent_scene.add.sprite(this.x + 150, this.y - 70, 'ring').play('phone-ring');
        
        // A améliorer, juste pour montrer le principe
        this.parent_scene.tweens.add({
          targets: this.sprite,
          x: this.sprite.x + PHONE_MOVEMENT,
          y: this.sprite.y,
          duration: 30,
          ease: "Power2", // changer pour plus de “idle”, ou mettre un “onComplete” par exemple
          yoyo: true,
          loop: -1,
        });
        
        /*
        let ring1_sprite = this.parent_scene.add.image(this.x + 130, this.y - 70, "ring1");
        let ring2_sprite = this.parent_scene.add.image(this.x + 150, this.y - 70, "ring2");
        let ring3_sprite = this.parent_scene.add.image(this.x + 170, this.y - 10, "ring3");
        */
        
        // this.ring_sprites = [ring1_sprite, ring2_sprite, ring3_sprite];

        //Make the phone interactive
        this.sprite.setInteractive();

        //Set an event listener for clicking on the phone
        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                //Check that we clicked on the phone
                if(gameObject === this.sprite) {
                    this.cur_state = phoneState.DONE;

                    // this.ring_sprites.forEach(sp => sp.destroy());
                    this.sprite.destroy();

                    //Trigger the dialogue
                    this.parent_scene.dialogue.display(WAKE_UP_ID);
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Updates the phone's state and handles the animation
     */
    update() {
        super.update();
        //Check the current state of the phone
        /*switch(this.cur_state) {
            case phoneState.IDLE:
                //Start the phone's vibration
                this.cur_state = phoneState.MOVE_LEFT;
                break;

            case phoneState.MOVE_LEFT:
                //Move the phone to the left
                this.sprite.x -= PHONE_MOVEMENT;
                this.ring_sprites.forEach(sp => sp.x += RING_MOVEMENT);
                this.cur_state = phoneState.MOVE_RIGHT;
                break;

            case phoneState.MOVE_RIGHT:
                //Move the phone to the right
                this.sprite.x += PHONE_MOVEMENT;
                this.ring_sprites.forEach(sp => sp.x -= RING_MOVEMENT);
                this.cur_state = phoneState.MOVE_LEFT;
                break;

            case phoneState.DONE:
                break;

            default:
                break;
        }*/
    }
}