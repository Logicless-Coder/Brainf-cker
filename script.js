const codeEditor = document.getElementById("codeEditor");

const runButton = document.getElementById("runButton");

const dataStore = document.getElementById("dataStore");
const inputBar = document.getElementById("inputBar");
const outputBar = document.getElementById("outputBar");

let data = [],
	code = "",
	dataPointer = 0,
	instructionPointer = 0,
	dataSize = 0;

const resetVariables = () => {
	for (let i = 0; i < dataSize; i++) data[i] = 0;
	(code = ""), (dataPointer = 0), (instructionPointer = 0);
	outputBar.textContent = "";
	inputBar.value = "";
};

const initialize = (ds) => {
	resetVariables();
	dataSize = ds;

	for (let i = 0; i < dataSize; i++) {
		data.push(0);
		const dataBlock = document.createElement("div");
		dataBlock.setAttribute("class", "dataBlock");
		dataBlock.textContent = data[i];
		dataStore.appendChild(dataBlock);
	}
};

const takeInput = () => {
	const inputData = inputBar.value;
	inputBar.value = "";
	return inputData;
};

const showOutput = (value) => {
	outputBar.textContent += value;
};

const execute = () => {
	const instruction = code[instructionPointer];
	switch (instruction) {
		case ">": {
			if (dataPointer + 1 >= data.length)
				alert("ERROR! Cannot shift more right.");
			else dataPointer++;
			break;
		}
		case "<": {
			if (dataPointer - 1 < 0) alert("ERROR! Cannot shift more left.");
			else dataPointer--;
			break;
		}
		case "+": {
			if (dataPointer >= data.length)
				alert("ERROR! Cannot increment. Invalid position.");
			else data[dataPointer]++;
			break;
		}
		case "-": {
			if (dataPointer >= data.length)
				alert("ERROR! Cannot decrement. Invalid position.");
			else data[dataPointer]--;
			break;
		}
		case ",": {
			if (0 > dataPointer || dataPointer >= data.length)
				alert("ERROR! Cannot input data. Invalid position.");
			else data[dataPointer] = takeInput();
			break;
		}
		case ".": {
			if (0 > dataPointer || dataPointer >= data.length)
				alert("ERROR! Cannot output data. Invalid position.");
			else showOutput(data[dataPointer]);
			break;
		}
		default:
			break;
	}
};

const simulate = () => {
	if (instructionPointer >= code.length) return;

	dataStore.children[dataPointer].classList.remove("active");
	execute(code[instructionPointer], dataPointer);

	dataStore.children[dataPointer].classList.add("active");
	dataStore.children[dataPointer].textContent = data[dataPointer];
	setTimeout(() => {
		instructionPointer++;
		simulate();
	}, 500);
};

const runCode = () => {
	resetVariables();
	code = codeEditor.value;

	console.log("Running", code);
	simulate(code, instructionPointer, dataPointer);
};

runButton.addEventListener("click", runCode);

initialize(8);
