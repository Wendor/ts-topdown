import { Game } from "@/game/scenes/Game";
import { Entity } from "./Entity";

export class Player extends Phaser.Physics.Arcade.Sprite {
    moveSpeed = 5;
    sprites: {
        hair: Phaser.GameObjects.Sprite;
        base: Phaser.GameObjects.Sprite;
        tools: Phaser.GameObjects.Sprite;
    };
    scene: Game;

    constructor (scene: Game, x: number, y: number, textures: { base: string; hair: string; tools: string }) {
        super(scene, x, y, textures.base);
        this.scene = scene;
        this.sprites= {
            base: new Entity(scene, x, y, textures.base),
            hair: new Entity(scene, x, y, textures.hair),
            tools: new Entity(scene, x, y, textures.tools),
        };

        this.scene.physics.add.existing(this);
        this.setSize(12, 12);
        this.setOffset(this.width/2 - 6, this.height/2 - 4);

        const anims = this.scene.anims;
        anims.create({
            key: 'player_base_idle',
            frames: anims.generateFrameNumbers('player_base_idle', {
                start: 0,
                end: 8,
            }),
            frameRate: 9,
            repeat: -1,
        });
        anims.create({
            key: 'player_hair_idle',
            frames: anims.generateFrameNumbers('player_hair_idle', {
                start: 0,
                end: 8,
            }),
            frameRate: 9,
            repeat: -1,
        });
        anims.create({
            key: 'player_tools_idle',
            frames: anims.generateFrameNumbers('player_tools_idle', {
                start: 0,
                end: 8,
            }),
            frameRate: 9,
            repeat: -1,
        });
        anims.create({
            key: 'player_base_run',
            frames: anims.generateFrameNumbers('player_base_run', {
                start: 0,
                end: 7,
            }),
            frameRate: 9,
            repeat: -1,
        });
        anims.create({
            key: 'player_hair_run',
            frames: anims.generateFrameNumbers('player_hair_run', {
                start: 0,
                end: 7,
            }),
            frameRate: 9,
            repeat: -1,
        });
        anims.create({
            key: 'player_tools_run',
            frames: anims.generateFrameNumbers('player_tools_run', {
                start: 0,
                end: 7,
            }),
            frameRate: 9,
            repeat: -1,
        });
    }

    update(_time: number, delta: number) {
        const keys = this.scene.input.keyboard?.createCursorKeys();
        const kbKeys = this.scene.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as Phaser.Types.Input.Keyboard.CursorKeys;

        const joyKeys = this.scene.joystick?.createCursorKeys();

        if (!this.body || !keys || !kbKeys || !joyKeys) {
            return;
        }

        this.setVelocity(0,0);

        let speed = this.moveSpeed;

        const pressedArrows = [
            keys.down.isDown || kbKeys.down.isDown || joyKeys.down.isDown,
            keys.left.isDown || kbKeys.left.isDown || joyKeys.left.isDown,
            keys.right.isDown || kbKeys.right.isDown || joyKeys.right.isDown,
            keys.up.isDown || kbKeys.up.isDown || joyKeys.up.isDown,
        ].filter(k => k).length;

        if (pressedArrows > 1) {
            speed = this.moveSpeed * 0.66;
        } else {
            speed = this.moveSpeed;
        }

        if (pressedArrows > 0) {
            this.startAnimation('run');
        } else {
            this.startAnimation('idle');
        }

        if (keys.up.isDown || kbKeys.up.isDown || joyKeys.up.isDown) {
            this.body.velocity.y += -delta * speed;
        }
        if (keys.down.isDown || kbKeys.down.isDown || joyKeys.down.isDown) {
            this.body.velocity.y += delta * speed;
        }
        if (keys.left.isDown || kbKeys.left.isDown || joyKeys.left.isDown) {
            this.body.velocity.x += -delta * speed;
            this.flipX = true;
        }
        if (keys.right.isDown || kbKeys.right.isDown || joyKeys.right.isDown) {
            this.body.velocity.x += delta * speed;
            this.flipX = false;
        }

        this.syncSpritesPositions();
    }

    syncSpritesPositions() {
        [...Object.values(this.sprites)].forEach((s) => {
            s.setPosition(this.x, this.y);
            s.flipX = this.flipX;
        });
    }

    startAnimation(name: string) {
        this.sprites.hair.play('player_hair_' + name, true);
        this.sprites.base.play('player_base_' + name, true);
        this.sprites.tools.play('player_tools_' + name, true);
    }
}
