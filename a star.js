//A binary min-heap implementation using heapify Javascript library (https://github.com/luciopaiva/heapify/tree/main), modified to allow pair of integers (for coordinates) to be stored
// this is just to make it clear that we are using a 1-based array; changing it to zero won't work without code changes
const ROOT_INDEX = 1;
class MinQueue {
    constructor(capacity = 64, keys = [], keys2 = [], priorities = [], KeysBackingArrayType = Uint32Array, PrioritiesBackingArrayType = Uint32Array) {
        this._capacity = capacity;
        this._keys = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this._keys2 = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this._priorities = new PrioritiesBackingArrayType(capacity + ROOT_INDEX);
        // to keep track of whether the first element is a deleted one
        this._hasPoppedElement = false;
        if (keys.length !== priorities.length) {
            throw new Error("Number of keys does not match number of priorities provided.");
        }
        if (capacity < keys.length) {
            throw new Error("Capacity less than number of provided keys.");
        }
        // copy data from user
        for (let i = 0; i < keys.length; i++) {
            this._keys[i + ROOT_INDEX] = keys[i];
            this._keys2[i + ROOT_INDEX] = keys2[i];
            this._priorities[i + ROOT_INDEX] = priorities[i];
        }
        this.length = keys.length;
        for (let i = keys.length >>> 1; i >= ROOT_INDEX; i--) {
            this.bubbleDown(i);
        }
    }
    get capacity() {
        return this._capacity;
    }
    clear() {
        this.length = 0;
        this._hasPoppedElement = false;
    }
    /**
     * Bubble an item up until its heap property is satisfied.
     */
    bubbleUp(index) {
        const row = this._keys[index];
        const column = this._keys2[index];
        const priority = this._priorities[index];
        while (index > ROOT_INDEX) {
            // get its parent item
            const parentIndex = index >>> 1;
            if (this._priorities[parentIndex] <= priority) {
                break; // if parent priority is smaller, heap property is satisfied
            }
            // bubble parent down so the item can go up
            this._keys[index] = this._keys[parentIndex];
            this._keys2[index] = this._keys2[parentIndex];
            this._priorities[index] = this._priorities[parentIndex];
            // repeat for the next level
            index = parentIndex;
        }
        // we finally found the place where the initial item should be; write it there
        this._keys[index] = row;
        this._keys2[index] = column;
        this._priorities[index] = priority;
    }
    /**
     * Bubble an item down until its heap property is satisfied.
     */
    bubbleDown(index) {
        const row = this._keys[index];
        const column = this._keys2[index];
        const priority = this._priorities[index];
        const halfLength = ROOT_INDEX + (this.length >>> 1); // no need to check the last level
        const lastIndex = this.length + ROOT_INDEX;
        while (index < halfLength) {
            const left = index << 1;
            // pick the left child
            let childPriority = this._priorities[left];
            let childKeyRow = this._keys[left];
            let childKeyColumn = this._keys2[left];
            let childIndex = left;
            // if there's a right child, choose the child with the smallest priority
            const right = left + 1;
            if (right < lastIndex) {
                const rightPriority = this._priorities[right];
                if (rightPriority < childPriority) {
                    childPriority = rightPriority;
                    childKeyRow = this._keys[right];
                    childKeyColumn = this._keys2[right];
                    childIndex = right;
                }
            }
            if (childPriority >= priority) {
                break; // if children have higher priority, heap property is satisfied
            }
            // bubble the child up to where the parent is
            this._keys[index] = childKeyRow;
            this._keys2[index] = childKeyColumn;
            this._priorities[index] = childPriority;
            // repeat for the next level
            index = childIndex;
        }
        // we finally found the place where the initial item should be; write it there
        this._keys[index] = row;
        this._keys2[index] = column;
        this._priorities[index] = priority;
    }
    /**
     * @param key the identifier of the object to be pushed into the heap
     * @param priority the priority associated with the key
     */
    push(row, column, priority) {
        if (this.length === this._capacity) {
            throw new Error("Heap has reached capacity, can't push new items");
        }
        if (this._hasPoppedElement) {
            // replace root element (which was deleted from the last pop)
            this._keys[ROOT_INDEX] = row;
            this._keys2[ROOT_INDEX] = column;
            this._priorities[ROOT_INDEX] = priority;
            this.length++;
            this.bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        }
        else {
            const pos = this.length + ROOT_INDEX;
            this._keys[pos] = row;
            this._keys2[pos] = column;
            this._priorities[pos] = priority;
            this.length++;
            this.bubbleUp(pos);
        }
    }
    /**
     * @return the key with the highest priority, or undefined if the heap is empty
     */
    pop() {
        if (this.length === 0) {
            return undefined;
        }
        this.removePoppedElement();
        this.length--;
        this._hasPoppedElement = true;
        return [this._keys[ROOT_INDEX], this._keys2[ROOT_INDEX]];
    }
    peekPriority() {
        this.removePoppedElement();
        return this._priorities[ROOT_INDEX];
    }
    peek() {
        this.removePoppedElement();
        return [this._keys[ROOT_INDEX], this._keys2[ROOT_INDEX]];
    }
    removePoppedElement() {
        if (this._hasPoppedElement) {
            // since root element was already deleted from pop, replace with last and bubble down
            this._keys[ROOT_INDEX] = this._keys[this.length + ROOT_INDEX];
            this._keys2[ROOT_INDEX] = this._keys2[this.length + ROOT_INDEX];
            this._priorities[ROOT_INDEX] = this._priorities[this.length + ROOT_INDEX];
            this.bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        }
    }
    get size() {
        return this.length;
    }
    dumpRawPriorities() {
        this.removePoppedElement();
        const result = Array(this.length - ROOT_INDEX);
        for (let i = 0; i < this.length; i++) {
            result[i] = this._priorities[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }
}



class priorityQueue {
  constructor(size) {
    //the queue will receive distances of cells
    //the lower the distance to end the better
    //so for that reason, the lower the distance = priority, the better
    //items with lowest distance will be picked first
    this.heap = new MinQueue(size); //10000
  }
  push(element){ //enqueue
    let coordinates, priority, column, row;
    [coordinates, priority] = element;
    [row, column] = coordinates;

    console.warn(coordinates)
    console.warn("priority", priority);
    
    this.heap.push(row, column, priority);
  }
  pop(){ //dequeue
  	let row, column;
  	[row, column] = this.heap.pop();
    return [row, column];
  }
  get length(){
  	return this.heap.length;
  }

}
document.getElementById("fakefileinput").addEventListener("keydown", function(event){
	console.log(event.key);
	if(event.key == "Enter"){
		document.getElementById("inputfile").click();
	}
});

document.getElementById("helpButton").addEventListener("click", function(){
	let a = document.getElementById("format");
	a.classList.remove("hidden");
	document.getElementById("formatOK").focus(); //By default the browser will scroll the element into view after focusing it
	a.scroll(0,0); //for that reason scroll after .focus();
});

let mazeAppClassHolderVariable; //the instance of the maze app
let animationDelay = document.getElementById("visualisationDelayPicker");

class BFSMazeApp{
	constructor() {
		this.fronta;
		this.pocetColumns = 0;
		this.pocetRows = 0;
		this.maze = [];
		this.startCoordinates = [];
		this.endCoordinates = [];
		this.zcelaHotovo = false;
		this.poleVidena = {};
		this.zJakehoPoleJsmeSemPrisli = {};
		this.delkaCesty = 0;
		this.delkaCestyPocetIterations = 0;
		this.mainLoopPocetIterations = 0; //how many times runBFS ran
		this.pocetProjdenychPoli = 0; //how many cells were searched
	}
	hideMaze(){
		this.graphicalMaze.hidden = true;
		//if you want to see the paths, which are consisted of cells which were the closest to end (as specified in the txt file), not TO START at any point in time to locations you choose, do it
		//=> this can provide paths which are very far from shortest here 
		//it produces fun, but not very useful results (look at Snímek obrazovky (1458).png)
	}
	createMaze(){
		const d = new Date();
		let table = document.createElement("table");
		let tbody = document.createElement("tbody");
		table.appendChild(tbody);
		document.getElementById("tableContainer").appendChild(table);
		this.graphicalMaze = tbody;
	}
	handleTabletChange(e) {
		  // Check if the media query is true
		  //solved with  this.handleTabletChange.bind(this) //which gave the function the necessary value of this as a reference of the class (and thus the possibility to call this. handleTabletChange, and give it this.graphicalMaze) and instead of the MediaQueryList value (which is passed as the e parameter)
		  //previously: THE VALUE OF this WHEN CALLED FROM this.handleTabletChange(mediaQuery); => IS THE CLASS BFSMazeApp, AS EXPECTED
		  //HOWEVER, THE VALUE OF this WHEN CALLED FROM mediaQuery.addListener(this.handleTabletChange); IS MediaQueryList!!!!!!
		  //MediaQueryList { media: "(max-width: 954px)", matches: false, onchange: null }
			// matches: false
			// media: "(max-width: 954px)"
			
			let tableElement = this.graphicalMaze.parentElement;
		  if (e.matches) {
		    // Then log the following message to the console
		    console.log('Media Query Matched!');
		    tableElement.className = "useFullWidthForMobile"; //same as document.getElementById("tableParent")

		  }else{
		    console.log("media query not matched");
		    tableElement.className = "";

		  }
		}

	tryToFitTheMazeOnScreen(){

		const tdMinWidthInclPadding = 12; //10 + 1px padding
		const tableBorderSpacing = 1.5;
		let calculateMinWidth = tdMinWidthInclPadding * this.pocetColumns;
		calculateMinWidth += 30;
		calculateMinWidth += (this.pocetColumns - 1) * tableBorderSpacing;
		const mediaQuery = window.matchMedia('(max-width:'+ calculateMinWidth +'px)');
		
		mediaQuery.addListener(this.handleTabletChange.bind(this)); //nice, src bind fix https://stackoverflow.com/questions/36794934/pass-argument-to-matchmedia-addlistener-callback-function

		// Initial check
		this.handleTabletChange(mediaQuery);
	}
	renderMaze(text){
		this.createMaze()
	    if(text[text.length - 1].trim() == ""){
	    	text.pop();
	    }
	    this.pocetRows = text.length;
	    this.pocetColumns = text[0].length;
	    this.fronta = new priorityQueue(this.pocetRows*this.pocetColumns);
	    console.log(text)
	   
	    this.tryToFitTheMazeOnScreen();
	    let mapText = document.getElementById("mapText");
	    mapText.textContent = "";
	    for(let x = 0; x < text.length - 2; x++){ //last 2 lines are start and stop (and possibly an empty line => which I removed already)

	    	let row = text[x].split("")
	    	console.log(row)
	    	const tr = this.graphicalMaze.insertRow();
	    	
	    	//the 2D array, storing the maze in place
				this.maze.push(row); 
	    	mapText.textContent += row + "\n";

	    	for(let y of row){
					const td = tr.insertCell();
					const div = document.createElement("div");
					div.className = "s";
					td.appendChild(div);
	  			if(y == "X"){
	  				td.classList.add("green");
	  			}
	    	}
			}

	   	let k;
	    if(text[this.pocetRows - 1].includes("end")){
	    	k = text[this.pocetRows - 1].trim().split(" "); //ten text end 153, 25 na konci vstupu
	    }
	    else{
	     	document.getElementById("endNotSpecified").classList.remove("hidden");
	     	this.zcelaHotovo = true;
	     	return;
	    }

	    this.endCoordinates = []; //column: row (will be reversed in startBFS, this format is for compatibility with mazes other created)
	    for(let x = 1; x < k.length; x++){
	    	this.endCoordinates.push( parseInt(k[x]) );	
	    }
	    console.log("this.endCoordinates", this.endCoordinates)

	    let s;
	    //same here, unlike Python, IN JS 'in' operator only for objects, for strings use .includes()
	    if(text[this.pocetRows - 2].includes("start")){
	    	s = text[this.pocetRows - 2].trim().split(" ") //text start 67, 11
	    }else{
	    	document.getElementById("startNotSpecified").classList.remove("hidden");
	    	this.zcelaHotovo = true;
	     	return;
	    }

	    this.startCoordinates = []; //column: row (will be reversed in startBFS, this format is for compatibility with mazes other created)
	    for(let x = 1; x < s.length; x++){
	    	this.startCoordinates.push( parseInt(s[x]) );	
	    }
	    console.log("this.startCoordinates", this.startCoordinates)
	    
	  }
	  presentResult(){
	  	let row = this.graphicalMaze.insertRow()
	  	let holder = row.insertCell();
	  	holder.colSpan = this.pocetColumns //77;
	  	holder.className = "presentResult";
	  	holder.innerHTML = "<span class='pathText'>Path</span> length from <span class='startText'>start</span> to end is " + this.delkaCestyPocetIterations + " cells long, while the main loop ran " + this.mainLoopPocetIterations + " times and " + this.pocetProjdenychPoli + " cells were searched"; //this.delkaCesty + " " vraci spatne vysledky (rucne jsem to prepocitaval, spravne vysledky vraci this.delkaCestyPocetIterations)
	  }
	  async startBFS(){ //async so I can use wait function
			//each item in the fronta queue has a row number, a column number and the distance from start (= length of the path) 
			//coordinates (row : column), distance
			//tuple, integer
			// (67, 11), 0
			this.startCoordinates.reverse();
			this.endCoordinates.reverse();

			this.fronta.push([this.startCoordinates, 0]);
			this.addClassToCell(this.startCoordinates, "start");
			this.addClassToCell(this.endCoordinates, "end");
			console.time("run");
			this.runBFS();
		}
		async runBFS(){
			let evaluatedVrchol, priority;
			console.log(this.fronta);
			while(this.fronta.length > 0 && this.zcelaHotovo == false){
				evaluatedVrchol = this.fronta.pop();
				console.error("compare field", evaluatedVrchol, "with end", this.endCoordinates) //just for aestetic purposes, not an error
				//=>IN PYTHON, evaluatedVrchol == this.endCoordinates WORKS
				//=>IN JS, that would compare memory locations, so I use String()
				//performance OK, the arrays have 2 items each
				if(String(evaluatedVrchol) == String(this.endCoordinates)){
					this.zcelaHotovo = true;
					//return; //pridan return, protoze jinak to jeste najde jednu polozku za cilem, tu se to pokusi hodit do heap a pak se to posere, memory leak
					try{
						this.calculatePath();
					}catch(TypeError){ // TypeError: can't access property Symbol.iterator, coordinates is undefined
						alert("queue is empty before end was found, wtf")
					}
					this.presentResult();
					console.timeEnd("run");
				}
				await wait(parseInt(animationDelay.value));
				await this.evaluateKolemPole(evaluatedVrchol, this.endCoordinates);
				this.mainLoopPocetIterations += 1;
			}
	}

		calculatePath(){
			let pole = this.endCoordinates;
			this.customCalculatePath(pole);
		}

		customCalculatePath(coordinates){
			let pole = coordinates;
			this.addClassToCell(coordinates, "end");
			//to compare coordinates which are arrays with two items
			while(String(pole) !== String(this.startCoordinates)){
				this.delkaCestyPocetIterations += 1;
				pole = this.zJakehoPoleJsmeSemPrisli[pole];
				this.addClassToCell(pole, "cesta2");			
			}
		}

		async najdiOkolniPole(coordinates){
			let column = coordinates[1]
			let row = coordinates[0]
			let okolniPolePos = [];

			if(row > 0){
				if(this.maze[row - 1][column] != "X"){
					okolniPolePos.push([row - 1, column]);
				}
			}
			//is last row
			if(row < this.pocetRows - 1){
				if(this.maze[row + 1][column] != "X"){
					okolniPolePos.push([row + 1, column]);
				}
			}
			if(column > 0){
				if(this.maze[row][column - 1] != "X"){
					okolniPolePos.push([row, column - 1]);
				}
			}
			//is last column
			if(column < this.pocetColumns - 1){
				if(this.maze[row][column + 1] != "X"){
					okolniPolePos.push([row, column + 1]);
				}
			}
			console.log(okolniPolePos);
			return okolniPolePos;
		}

		calculateDistance(coordinates){ //used to detemine the priority of the neighbor
			let row, column;
			let rowEnd, columnEnd;
			[row, column] = coordinates;
			[rowEnd, columnEnd] = this.endCoordinates;

			//uses the Pythagorian theorem to calculate the distance
			let a = Math.abs(rowEnd - row);
			let b = Math.abs(columnEnd - column);
			let c = a**2 + b**2;

			//interestingly, it is finds shorter paths this way:
				// on 114.txt 116 cells long using return c
				// on 114.txt 128 cells long using Math.sqrt(c)
				//(both results still longer than paths found by BFS)
			//return c; //The heap uses 32 bit unsigned integers, where the max value is 4,294,967,295, so I can keep it as is, skip Math.sqrt(c) 
			//return Math.sqrt(c); (because the float gets implicitly floored to integer by JS when being added to the heap (which uses typed Uint32Arrays) => which causes imprecision)
			//doing Math.round(Math.sqrt(c)) explicitly would cause a longer path being computed as well, for the same reasons, it is imprecise, compared to the original float (which is reasonably precise in heap implentations which accept floats for priorities) 
			//but of course, when integers are required, returning c is the best solution
			//it is still well worth it, because this implementation based on heapify.js with typed Arrays is 1.5 times faster than the equivalent using tinyqueue.js with normal JS Arrays
			return c;
		}
		
		async evaluateKolemPole(coordinates, end) {
			let okolniPolePosLoc = await this.najdiOkolniPole(coordinates);
			this.addClassToCell(coordinates, "considered");
			//this.consideredCellCoordinatesDisplay.textContent = coordinates;
			await wait(parseInt(animationDelay.value)) // so that the viewer can prepare for new surrounding fields
			for (let x = 0; x < okolniPolePosLoc.length; x++) {
				let pole = okolniPolePosLoc[x];

				if(pole in this.poleVidena){
					console.log("skips");
					this.addClassToCell(okolniPolePosLoc[x],"skipped")
				}else{
					this.addClassToCell(okolniPolePosLoc[x], "visited");
					this.poleVidena[okolniPolePosLoc[x]] = this.delkaCesty + 1;
					this.delkaCesty += 1;
					this.fronta.push([okolniPolePosLoc[x], this.calculateDistance(okolniPolePosLoc[x])]);
					this.zJakehoPoleJsmeSemPrisli[okolniPolePosLoc[x]] = coordinates;
				}
				this.pocetProjdenychPoli += 1;
			}
			await wait(parseInt(animationDelay.value));
			this.removeClassFromCell(coordinates, "considered");
		}

		addClassToCell(coordinates, className){
			//coordinates are row : column
			//tables (tbody) support only rows : column (cells is the method of td only, not tbody) 
			let row, column;
			[row, column] = coordinates;
			try{
				this.graphicalMaze.rows[row].cells[column].classList.add(className);
			}catch(TypeError){
				console.warn("TypeError caught", "row", row, "column", column);
			}
		}
		removeClassFromCell(coordinates, className){
			let row, column;
			[row, column] = coordinates;
			try{
				this.graphicalMaze.rows[row].cells[column].classList.remove(className);
			}catch(TypeError){
				console.warn("TypeError caught", "row", row, "column", column);
			}

		}

		attachClickListenerToDrawPathToAnyField(){
			this.graphicalMaze.addEventListener("click", function(e){
				let a = e.target;
				if(a.matches("td.presentResult")){
					return;
				}else if(a.matches("div.s")){
					console.log("skrrrt", this);
													//div  td 					tr 										div		td
					let coordinates = [a.parentElement.parentElement.rowIndex, a.parentElement.cellIndex];
					console.log(coordinates);
					this.customCalculatePath(coordinates); //this.calculatePath is not a function => need to bind this
				}else if(a.matches("td")){
					console.log("brrr");
					let coordinates = [a.parentElement.rowIndex, a.cellIndex];
					this.customCalculatePath(coordinates);
				}
			}.bind(this));
		}

}

function whichLineEnding(source) {
	var temp = source.indexOf('\n');
	if (source[temp - 1] === '\r')
		return 'CRLF' //Windows
	return 'LF' //Linux
}

let mazePicker = document.getElementById("mazePicker");
mazePicker.addEventListener("change", function(e){
	let mazeSelected = mazePicker.value;
	if(mazeSelected != ""){
		let mazeUrl = ""

		if(window.location.protocol == "file:"){
			//Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///C:/Users/Andrey/Documents/ksp/84.txt. (Reason: CORS request not http).
			//=> that is on purpose: 
			//	https://amp.thehackernews.com/thn/2019/07/firefox-same-origin-policy-hacking.html 
			//	https://bugzilla.mozilla.org/show_bug.cgi?id=1558299
			//so show user an alert
			document.getElementById("loadOnLocalServer").classList.remove("hidden");
			document.getElementById("loadOnLocalServerOK").focus();
			return;
		}else{
				//is not local server
				if(location.hostname.endsWith("github.io")){
					mazeUrl = window.location.href + mazeSelected;
				}else{
					//is local server
					mazeUrl = "/"  + mazeSelected;
				}	
		}
		
		fetch(mazeUrl)
		.then( r => r.text() )
   	.then( t => {
   		//Fun fact: when I don't stop the previous instance, I can have 5 mazes running at the same time no problem, and even responsive design works :)
   		if(mazeAppClassHolderVariable != undefined){
   			mazeAppClassHolderVariable.zcelaHotovo = true;
   			mazeAppClassHolderVariable.hideMaze();
   		}
   		mazeAppClassHolderVariable = new BFSMazeApp();
		let lineEnding = whichLineEnding(t);
		if(lineEnding == "CRLF"){
			mazeAppClassHolderVariable.renderMaze(t.split("\r\n"));
		}else if(lineEnding == "LF"){
			mazeAppClassHolderVariable.renderMaze(t.split("\n"));
		}
		mazeAppClassHolderVariable.startBFS();
   	});
	}
});

//reading and parsing the input into a table to display as well as the correspoding 2D Array
document.getElementById('inputfile').addEventListener('change', function(event) {
	console.log(event);
	let text = "";
    var fr=new FileReader();
    fr.onload=function(){
		let lineEnding = whichLineEnding(fr.result);
		if(lineEnding == "CRLF"){
			text = fr.result.split("\r\n");
		}else if(lineEnding == "LF"){
			text = fr.result.split("\n");
		}
        if(mazeAppClassHolderVariable != undefined){
	   		mazeAppClassHolderVariable.zcelaHotovo = true;
	   		mazeAppClassHolderVariable.hideMaze();
	   	}
	   	mazeAppClassHolderVariable = new BFSMazeApp();
   		mazeAppClassHolderVariable.renderMaze(text);
        mazeAppClassHolderVariable.startBFS(); //entry point to our actual program
    }
    fr.readAsText(this.files[0]);
    document.getElementById("selectedFileLabel").textContent = this.files[0].name;
});

//https://stackoverflow.com/a/53452241/11844784
function wait(ms) {
	if(ms > 0){
		return new Promise((resolve, reject) => {
	    setTimeout(() => {
	      resolve(ms)
	    }, ms )
	  })
	}else{
			return;
		}
}
