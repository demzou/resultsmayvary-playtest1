
let cnv;
let el;
let cnvW;
let cnvH;
let cnvX;
let cnvY;
let socket;
//const serverURL = 'URL';
const serverURL = 'localhost:8080';

let mode = 0;
let question;
let options = [];

// Mode 1 --> Intro
let question1 = "Pick the top 3 emotions you've been feeling during the lockdown";
let options1 = ['Focused', 'Unmotivated', 'Lonely', 'Stressed', 'In limbo', 'Depressed', 'Thankful', 'Lucky'];

// Mode 2 --> Vote WORK
let question2 = 'How have you felt about your work and/or your financial situation?';
let options2 = ['Safe', 'Uncertain'];

// Mode 5 --> List statements UNCERTAIN
let question5 = 'Select all the statements that apply to you';
let options5 = ['I have been furloughed', 'The business/industry took a hit', "I can't find a new job", 'I have lost my job', 'My salary has been reduced', 'Work is way more intense', 'My visa situation is precarious'];

// Mode 7 --> List statements SAFE
let question7 = 'Select all the statements that apply to you';
let options7 = ['I work for a supportive company', 'I have enough wealth/savings', 'I have maintaind my job', 'My visa situation is secured', "I've felt lucky", 'New opportunities appeared', 'I feel safe but trapped in my job'];

// Mode 8 --> Input WORK Stressful
let question8 = "Give an example of something you have written in an email or an online chat";
let input;

// Mode 9 --> Vote TIME
let question9 = 'How busy have you been?';
let options9 = ["It's been full-on", "I've had some extra time"];

// Mode 12 --> List of statements FULL-ON
let question12 = 'What are the main activities that kept you busy?';
let options12 = ['Exercising', 'Hobbies/Projects', 'Cooking', 'Work/Studies', 'Kids/Family', 'House chores', 'Relaxing', 'Distanced socialising'];

// Mode 14 --> Statements MORE TIME
let question14 = "What did you do with this extra time? Click on the statement if true";
let statement14 = ['Exercise / Yoga', 'Cook / Bake', 'Watch TV / Netflix or play games', 'Hobbies / Craft / Personal projects', 'Grow plants', 'Take more time for myself', 'Learn new skills'];
let statementCount = 0;

let optionsSelected = [false, false, false, false, false, false, false, false];
let optionsCol
let optionsBgCol;
let questionCol;
let choiceMade;
let maxReached;
let choice = [];
let maxSelected = 1;
let resultSent = false;
let keepPressing = false;
let statementClicked = false;

function preload() {
    futuraBold = loadFont('assets/Futura-CondensedExtraBold-05.ttf');
    futuraBook = loadFont('assets/futura_book.otf');
}
  
function centerCanvas() {
    // let x = (w - width) / 2;
    // let y = (h - height) / 2;
    cnvX = el.getBoundingClientRect().x;
    cnvY = el.getBoundingClientRect().y;
    cnv.position(cnvX, cnvY);
}

//--------------------------------------------------------------------
function setup() {
    el = document.getElementById("sketch-container");
    cnvW = el.getBoundingClientRect().width;
    cnvH = el.getBoundingClientRect().height;
    createCanvas(cnvW, cnvH);
    cnv = createCanvas(cnvW, cnvH);
    centerCanvas();
    cnv.parent('sketch-container');

    //Variables
    optionsBgCol = [color(0), color(0)];
    optionsCol = [color(255), color(255)];
    questionCol = color(255);
    choiceMade = false;

    //Input
    input = createInput();
    input.position(cnvX+20, cnvH/2);
    input.size(cnvW-40, cnvH/4);
    input.value(' ');
    input.style('background-color', '#111111');
    input.style('font-family', 'futura');
    input.style('font-size', '16px');
    input.style('color', 'white');
    input.style('border-color', 'white');
    input.style('display', 'none');

    //Socket.io
    socket = io.connect(serverURL);

    socket.on('mode', function(data) {
      input.style('display', 'none');
      console.log("Mode: " + data);
      mode = data;

      optionsSelected = [false, false, false, false, false, false, false, false];
      resultSent = false;
      keepPressing = false;
      statementClicked = false;
      statementCount = 0;

      if(mode == 1) {
          question = question1;
          options = options1;
      }
      if(mode == 2) {
        question = question2;
        options = options2;
      }
      if(mode == 5) {
        question = question5;
        options = options5;
      }
      if(mode == 7) {
        question = question7;
        options = options7;
      }

      if(mode==8) question = question8;

      if(mode == 9) {
        question = question9;
        options = options9;
      }

      if(mode == 12) {
        question = question12;
        options = options12;
      }

      if(mode == 14) {
        question = question14;
        statement = statement14;
      }
    });

    socket.on('nextStatement', function(data) {
        statementClicked = false;
        statementCount++;
        if(statementCount >= statement.length) {
            statementCount = 0;
        }
    });

    // socket.on('question', function(data) {
    //     console.log("Question: " + data);
    //     question = data;
    // });

    // socket.on('optionsList', function(data) {
    //     console.log("Options: " + data);
    //     options = data;
    // });


}

//--------------------------------------------------------------------
function draw() {
    console.log(resultSent);

    background(0);

    if (mode==1) drawList(question, options, 3, 3);
    if (mode==2) drawChoice(question, options);
    if (mode==5) drawList(question, options, 1, options.length+1);
    if (mode==7) drawList(question, options, 1, options.length+1);
    if (mode==8) drawInput(question, input);
    if (mode==9) drawChoice(question, options);
    if (mode==12) drawList(question, options, 1, options.length+1);
    if (mode==14) buttonStatement(question, statement);

    //drawChoice(question, options);
    //drawList(question, options, 1, options.length+1);
    //drawList(question, options, 3, 3);
    //drawInput(question, input);
    //buttonStatement(question, statement);

}


//--------------------------------------------------------------------
function drawChoice(_question, _options) {

    if(resultSent) {
        questionCol = color(100);
    } else {
        questionCol = color(255);
    }
    
    //Count if options are fullfilled
    let count = 0;
    for (let i=0; i<optionsSelected.length; i++) {
        if (optionsSelected[i] === true) {
            count++;
        }
    }
    if (count > 0) {
        choiceMade = true;
    } else {
        choiceMade = false;
    }

    textAlign(CENTER, CENTER);

    //Question
    fill(questionCol);
    textFont(futuraBold);
    textSize(24);
    text(_question, 20, height/4, width-20, height/4);

    //Buttons
    buttonSquare(0);
    buttonSquare(1);
    if(!resultSent) submitButton('selection');

}

//--------------------------------------------------------------------
function buttonSquare(_optionNum) {

    let buttonWidth = width/2-20;
    let buttonHeight = height/4;
    let startX = 20+_optionNum*buttonWidth;
    let startY = height/2;
    let isHovered = false;

    //Check hover and clicks
    if(!resultSent) {
        if(mouseX > startX && mouseX < startX+buttonWidth*(1+_optionNum)) {
            if(mouseY > startY && mouseY < startY+buttonHeight) {
                if(mouseIsPressed) {
                    if(choiceMade === true) {
                        for (let i = 0; i < optionsSelected.length; i++) {
                            optionsSelected[i] = false;
                        }
                        optionsSelected[_optionNum] = true;
                    } else {
                        optionsSelected[_optionNum] = !optionsSelected[_optionNum];
                    }
                } else {
                    isHovered = true;
                }
            }
        } else {
            isHovered = false;
        }
    }

    //Change colours accordingly
    if (optionsSelected[_optionNum] === true) {
        optionsBgCol[_optionNum] = color(0, 255, 255);
        optionsCol[_optionNum] = color(0);
    } else if (isHovered === true) {
        optionsBgCol[_optionNum] = color(50);
        optionsCol[_optionNum] = color(255);
    } else {
        optionsBgCol[_optionNum] = color(0);
        optionsCol[_optionNum] = color(255);
    }

    if(resultSent && !optionsSelected[_optionNum]) optionsCol[_optionNum] = color(100);
    
    //Draw button 
    push(); 
    fill(optionsBgCol[_optionNum]);
    rect(startX, startY, buttonWidth, buttonHeight);

    textFont(futuraBook);
    textSize(24);
    fill(optionsCol[_optionNum]);
    text(options[_optionNum], startX, 2.25*buttonHeight, buttonWidth, buttonHeight/2);
    pop();
}


//--------------------------------------------------------------------
function drawList(_question, _options, _min, _max) {

    if(resultSent) {
        questionCol = color(100);
    } else {
        questionCol = color(255);
    }

    //Count if options are fullfilled
    let count = 0;
    for (let i=0; i<optionsSelected.length; i++) {
        if (optionsSelected[i] === true) {
            count++;
        }
    }
    if (count >= _min) {
        choiceMade = true;
    } else {
        choiceMade = false;
    }

    if (count >= _max) {
        maxReached = true;
    } else {
        maxReached = false;
    }

    textAlign(CENTER, CENTER);

    //Question
    fill(questionCol);
    textFont(futuraBold);
    textSize(24);
    text(_question, 20, 20, width-20, height/4);

    //Buttons
    for (let i=0; i<_options.length; i++) {
        buttonList(i);
    }
    if(!resultSent) submitButton('selection');

}

//--------------------------------------------------------------------
function buttonList(_optionNum) {

    let buttonWidth = width-40;
    let buttonHeight = height/16;
    let startX = 20;
    let startY = height/4+ 10 + _optionNum*(buttonHeight+10);
    let isHovered = false;
    let isActive = true;

    if (maxReached === true && optionsSelected[_optionNum] === false) {
        isActive = false;
    } 

    //Check hover and clicks
    if(!resultSent && isActive) {
        if(mouseX > startX && mouseX < startX+buttonWidth*(1+_optionNum)) {
            if(mouseY > startY && mouseY < startY+buttonHeight) {
                if(mouseIsPressed && keepPressing == false) {
                    optionsSelected[_optionNum] = !optionsSelected[_optionNum];
                    keepPressing = true;
                } else {
                    isHovered = true;
                }
            }
        } else {
            isHovered = false;
        }
    } 

    //Change colours accordingly
    if(isActive == false) {
        optionsBgCol[_optionNum] = color(0);
        optionsCol[_optionNum] = color(100);
    } else if (optionsSelected[_optionNum] === true) {
        optionsBgCol[_optionNum] = color(0, 255, 255);
        optionsCol[_optionNum] = color(0);
    } else if (isHovered === true) {
        optionsBgCol[_optionNum] = color(50);
        optionsCol[_optionNum] = color(255);
    } else {
        optionsBgCol[_optionNum] = color(0);
        optionsCol[_optionNum] = color(255);
    }

    if(resultSent && !optionsSelected[_optionNum]) optionsCol[_optionNum] = color(100);
    
    //Draw button 
    push(); 
    fill(optionsBgCol[_optionNum]);
    rect(startX, startY, buttonWidth, buttonHeight);

    textFont(futuraBook);
    textSize(18);
    fill(optionsCol[_optionNum]);
    text(options[_optionNum], startX, startY+buttonHeight/4, buttonWidth, buttonHeight/2);
    pop();
}

//--------------------------------------------------------------------
function drawInput(_question, _input) {

    if(resultSent) {
        questionCol = color(100);
    } else {
        questionCol = color(255);
    }

    if (_input.value() != ' ') {
        choiceMade = true;
    }

    textAlign(CENTER, CENTER);

    //Question
    fill(questionCol);
    textFont(futuraBold);
    textSize(24);
    text(_question, 20, height/6, width-20, height/4);

    //Input
    _input.style('display', 'block');

    if(!resultSent) submitButton('input');
    if(resultSent) {
        input.style('background-color', '#111111');
        input.style('color', 'grey');
        input.style('border', 'none');
    } 

}

//--------------------------------------------------------------------
function submitButton(_type) {

    let buttonWidth = width-40;
    let buttonHeight = height/14;
    let startX = 20;
    let startY = height-height/8;

    let buttonBgCol = color(0);
    let buttonMainCol = color(0);

    //Check hover and clicks
    if (choiceMade === true) {
        if(mouseX > startX && mouseX < startX+buttonWidth) {
            if(mouseY > startY && mouseY < startY+buttonHeight) {
                if(mouseIsPressed) {
                    if(resultSent === false) {

                        if(_type === 'selection') {
                            choice.length = 0;
                            for (let i=0; i<optionsSelected.length; i++) {
                                if (optionsSelected[i] === true) {
                                    choice.push(i);
                                }
                            }
                            console.log(choice);

                            if(mode ==1) socket.emit('submit1', choice);
                            if(mode ==2) socket.emit('submit2', choice);
                            if(mode ==9) socket.emit('submit9', choice);
                            if(mode ==12) socket.emit('submit12', choice);
                            
                            resultSent = true;
                        }

                        if(_type === 'input') {
                            choice.length = 0;
                            choice = input.value();
                            console.log(choice);
                            socket.emit('input', choice);
                            resultSent = true;
                            choice = [];
                        }
                        
                    }
                    buttonBgCol = color(0, 255, 255);
                    buttonMainCol = color(0);
                } else {
                    buttonBgCol = color(255);
                    buttonMainCol = color(0);
                }
            } else {
                buttonBgCol = color(0);
                buttonMainCol = color(255);
            }
        } else {
            buttonBgCol = color(0);
            buttonMainCol = color(255);
        }
    } else {
        buttonBgCol = color(0);
        buttonMainCol = color(100);
    }

    //Draw button
    push();
    stroke(buttonMainCol);
    fill(buttonBgCol)
    rect(startX, startY, buttonWidth, buttonHeight);
    textFont(futuraBook);
    textSize(20);
    fill(buttonMainCol);
    text('SEND', startX, startY+buttonHeight/4, buttonWidth, buttonHeight/2);
    pop();
}

//--------------------------------------------------------------------
function buttonStatement(_question, _statement) {

    if(statementClicked) {
        questionCol = color(100);
    } else {
        questionCol = color(255);
    }

    let buttonSize = width-60;
    let centreX = width/2;
    let centreY = height/5*3;
    let isHovered = false;
    let statementCol;
    let circleBorderCol;
    let circleBgCol;

    //Check hover and clicks
    if(mouseX > centreX-buttonSize/2 && mouseX < centreX+buttonSize/2) {
        if(mouseY > centreY-buttonSize/2 && mouseY< centreY+buttonSize/2) {
            if(mouseIsPressed && keepPressing == false) {
                statementClicked = true;
                socket.emit('statementClicked', 1);
                keepPressing = true;
            } else {
                isHovered = true;
            }
        } 
    } else {
        isHovered = false;
    }

    //Change colours accordingly
    if (statementClicked === true) {
        statementCol = color(0);
        circleBorderCol = color(0, 255, 255);
        circleBgCol = color(0, 255, 255);
    } else if (isHovered === true) {
        statementCol = color(255);
        circleBorderCol = color(0, 255, 255);
        circleBgCol = color(50);  
    } else {
        statementCol = color(255);
        circleBorderCol = color(0, 255, 255);
        circleBgCol = color(0); 
    }

    textAlign(CENTER, CENTER);

    //Question
    fill(questionCol);
    textFont(futuraBold);
    textSize(24);
    text(_question, 20, height/6, width-20, height/4);

    //Draw button 
    push(); 
    fill(circleBgCol);
    stroke(circleBorderCol);
    strokeWeight(2);
    circle(centreX, centreY, buttonSize);

    textFont(futuraBook);
    textSize(20);
    fill(statementCol);
    noStroke();
    text(_statement[statementCount], centreX-buttonSize/2, centreY-buttonSize/2, buttonSize, buttonSize);
    pop();

}

//--------------------------------------------------------------------
function windowResized() {
    el = document.getElementById("sketch-container");
    w = el.getBoundingClientRect().width;
    h = el.getBoundingClientRect().height;
    centerCanvas();
  }


// //--------------------------------------------------------------------
// function mousePressed() {
//     mouseIsClicked = true;
//     console.log('click');
//   }

//--------------------------------------------------------------------
function mouseReleased() {
    keepPressing = false;
  }