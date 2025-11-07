export class Entity extends Phaser.GameObjects.Sprite {
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string ) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
    }
}