import { Scene } from 'phaser';
import { Player } from '../../entities/Player';

export class Game extends Scene
{
    player?: Player;
    fpsMeter:  Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'home' });
        const tileset = map.addTilesetImage('base_tiles', 'base_tiles', 16, 16);
        if (!tileset) {
            throw new Error('TILESET NOT CREATED');
        }

        const groundLayer = map.createLayer('ground', tileset, 0, 0);
        const objectsLayer = map.createLayer('objects', tileset, 0, 0);

        // @ts-ignore
        const waterLayer =  map.createLayer('water', tileset, 0, 0);
        // @ts-ignore
        const topLayer = map.createLayer('top', tileset, 0, 0);
        // @ts-ignore
        const treesLayer = map.createLayer('trees', tileset, 0, 0);
       
        const wallsLayer = map.createLayer('walls', tileset, 0, 0);
        wallsLayer?.setVisible(false);

        if (!groundLayer || !wallsLayer || !objectsLayer) {
            throw new Error('LAYERS NOT CREATED');
        }

        this.player = new Player(this, 100, 100, {
            base: 'player_base_idle',
            hair: 'player_hair_idle',
            tools: 'player_tools_idle',
         });
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.physics.add.collider(this.player, wallsLayer);
        //this.physics.add.collider(this.player, objectsLayer);
        wallsLayer.setCollisionByExclusion([-1]);
        //objectsLayer.setCollisionByExclusion([-1]);
        this.player.setCollideWorldBounds(true);

        this.fpsMeter = new Phaser.GameObjects.Text(this, 2, 2, '0', { font: '14px Arial', color: '#ffff00'});
        this.add.existing(this.fpsMeter);

        this.sound.play('background_music');
    }

    update(time: number, delta: number) {
        this.player?.update(time, delta);
        this.fpsMeter.setText(Math.round(this.game.loop.actualFps).toString());
    }
      
}
