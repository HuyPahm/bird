
let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

function preload() {
  
  this.load.image('background', 'assets/background.png');
  
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.jpeg', { frameWidth: 64, frameHeight: 96 });


}

let roads;
let road;
let cursors;
let bird;
let hasLanded = false;
let hasBumped = false;
let button;
let isGameStarted = false;
let startButton;
let messageToPlayer;
let title;

function create() { //nạp hình
  
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0); //setupbackground
  roads = this.physics.add.staticGroup();
  
  let topColumns = this.physics.add.staticGroup({ //cột rớt xuống(stactic: hàm tĩnh)
    key: 'column', 
    repeat: 1,
    setXY: { x: 200, y: 0, stepX: 300 }
  });
  let bottomColumns = this.physics.add.staticGroup({ // cột chui lên    
    key: 'column',
    repeat: 1,
    setXY: { x: 350, y: 400, stepX: 300 },
    //setXY: toạ độ ; cột 2 cách 300px bên phải cột 1
  });


  bird = this.physics.add.sprite(0, 50, 'bird').setScale(2); //(sprite: hàm động - vị trí ban đầu góc phía trái) 
  bird.setBounce(0.2); //ràng buộc con chim (độ nảy khi va chạm nền 0,2)
  bird.setCollideWorldBounds(true); //chim va vào cạnh màn hình chứ kh đi xuyên qua 
  road = roads.create(400, 568, 'road').setScale(2).refreshBody();
  
  this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
  this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
  this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
  this.physics.add.collider(bird, road);
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);
  
  messageToPlayer = this.add.text(0, 0, ``, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
  Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);
  title = this.add.text(0, 0, `Liếm để nhảy`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "80px", color: "white", backgroundColor: "black" });
  Phaser.Display.Align.In.TopCenter(title, background);
  cursors = this.input.keyboard.createCursorKeys();

}

function update() { //thực hiện phản hồi tương tác
  
  if (!isGameStarted) {
    bird.setVelocityY(-160);
  }
  if (!hasLanded && isGameStarted) {
    bird.body.velocity.x = 50;
  }
  if (hasLanded || hasBumped) {
    bird.body.velocity.x = 0;
    messageToPlayer.text = `Oh no!`
  }
  if (cursors.up.isDown && !hasBumped && !hasLanded &&  isGameStarted)
  {
    bird.setVelocityY(-160);
  }
  if (cursors.up.isDown && !isGameStarted) {
    isGameStarted = true;
    title.destroy();
    messageToPlayer.text = `Liếm để nhảy`
  }
  if (bird.x > 750) {
    bird.setVelocityY(40);
    // messageToPlayer.text = `Congrats! You won!`
  }  
}
