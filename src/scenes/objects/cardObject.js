import Phaser from "phaser";

/**
 * @brief Models an Object that can be found in a Card
 */
export class CardObject {
    /**
     * @brief Constructs an instance of the clothes
     * @param {Phaser.Scene} parent_scene, the scene in which the clothes are contained
     * @param {JSON} sprite, {name, url} of the sprite that will be created
     * @param {Phaser.Math.Vector2} position the position of the object in the scene
     * @param {Function} onClickCallback callback set as an onclick response for this object
     * @param {Array} onClickArgs arguments that will be passed to the onClick callback
     * @param {Number} choice, the path that this item will entail (only if !-1)
     * @param {JSON} highlight {name, url} of the highlighted version of the sprite (can be null)
     */
    constructor(parent_scene, sprite, position, onClickCallback=null, onClickArgs=null, choice=-1, highlight=null) {
        this.parent_scene = parent_scene;

        //Sprite parameters
        this.name = sprite.name;
        this.url = sprite.url;

        //Position of the object while taking into account ratio deformation
        this.position = new Phaser.Math.Vector2(position.x, position.y);

        //Store callback
        this.onClickCallback = onClickCallback;
        this.onClickArgs = onClickArgs;

        //Interaction parameters
        this.choice = choice;

        //Highlighted sprite
        this.highlight = highlight;
    }

    /**
     * @brief Preloads the image associated to the sprite in memory
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);

        //Load the highlight if it exists
        if(this.highlight) {
            this.parent_scene.load.image(this.highlight.name, this.highlight.url);
        }
    }

    /**
     * @brief Creates the object and makes it interactable if needed
     * and animates it if needed
     */
    create() {
        this.sprite = this.parent_scene.add.image(this.position.x, this.position.y, this.name);
        this.sprite.name = this.name;

        //Create the highlight and animation if needed
        if(this.highlight) {
            this.highlight_sprite = this.parent_scene.add.image(
                this.position.x,
                this.position.y,
                this.highlight.name);

            this.parent_scene.tweens.add({
                targets: this.highlight_sprite,
                alpha: 0,
                duration: 2000,
                ease: "Quadratic",
                yoyo: true,
                loop: -1
            });
            this.highlight_sprite.setInteractive();
        }

        //Add a choice if needed
        if(this.choice !== -1 || this.onClickCallback !== null) {

            const interaction = () => {
                //Only trigger interaction if the dialogue is done
                if(this.parent_scene.dialogue.isDone()) {
                    //Check if the callback exists
                    if(this.onClickCallback !== null) {

                        //Check for arguments
                        if(this.onClickArgs !== null) {
                            this.onClickCallback(this.onClickArgs);
                        } else {
                            this.onClickCallback();
                        }
                    } else {
                        this.parent_scene.endCard();
                        this.parent_scene.nextCard(this.choice);
                    }
                }
            };

            //Make the sprites interactive
            if(this.highlight_sprite) {
                this.highlight_sprite.setInteractive().on('pointerdown', interaction, this);
            }
            this.sprite.setInteractive().on('pointerdown', interaction, this);
        }
    }

    /**
     * @brief Update method that is called on every frame.
     * Usually used to handle object animations
     */
    update() {
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }

    /**
     * @brief Modifies the object's onclickcallback
     * @param {Function} newCallback the new onclickCallback
     * @param {array} newArgs the arguments used by the new callback
     */
    updateOnClickCallback(newCallback, newArgs) {
        this.onClickCallback = newCallback;
        this.onClickArgs = newArgs;
    }

    /**
     * @brief Deallocates the memory linked to the sprite
     */
    destroy() {
        this.sprite.destroy();

        if(this.highlight_sprite) {
            this.highlight_sprite.destroy();
        }
    }
}
