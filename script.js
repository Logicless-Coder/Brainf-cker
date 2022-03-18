const codeEditor = document.getElementById("codeEditor");

const runButton = document.getElementById("runButton");

const dataStore = document.getElementById("dataStore");
const inputBar = document.getElementById("inputBar");
const outputBar = document.getElementById("outputBar");

const simulationSpeedInput = document.getElementById("simulationSpeedInput");

let data = [],
	code = "",
	dataPointer = 0,
	instructionPointer = 0,
	dataSize = 0,
	simulationSpeed = 1;

const resetVariables = () => {
	for (let i = 0; i < dataSize; i++) data[i] = 0;
	(code = ""),
		(dataPointer = 0),
		(instructionPointer = 0),
		(simulationSpeed = 1);
	outputBar.textContent = "";
	inputBar.value = "";
	simulationSpeedInput.value = 1;
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

const showOutput = (value, mode = 0) => {
	if (mode) outputBar.textContent += String.fromCharCode(value);
	else outputBar.textContent += value;
};

const findMatchingClosing = () => {
	let depth = 0;
	for (let i = instructionPointer; i < code.length; i++) {
		if (code[i] == "[") depth++;
		else if (code[i] == "]") depth--;

		if (depth == 0) return i;
	}

	return -1;
};

const findMatchingOpening = () => {
	let depth = 0;
	for (let i = instructionPointer; i >= 0; i--) {
		if (code[i] == "]") depth++;
		else if (code[i] == "[") depth--;

		if (depth == 0) return i;
	}

	return -1;
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
		case ":": {
			if (0 > dataPointer || dataPointer >= data.length)
				alert("ERROR! Cannot output data. Invalid position.");
			else showOutput(data[dataPointer], 1);
			break;
		}
		case "[": {
			if (0 > dataPointer || dataPointer >= data.length)
				alert("ERROR! Cannot check data. Invalid position.");
			else {
				if (data[dataPointer] == 0) {
					const closingPos = findMatchingClosing();
					console.log("Close:", closingPos);
					if (closingPos == -1)
						alert(
							"ERROR! No matching bracket found for opening bracket at char: " +
								instructionPointer
						);
					else instructionPointer = closingPos;
				}
			}
			break;
		}
		case "]": {
			if (0 > dataPointer || dataPointer >= data.length)
				alert("ERROR! Cannot check data. Invalid position.");
			else {
				if (data[dataPointer] != 0) {
					const openingPos = findMatchingOpening();
					console.log("Open:", openingPos);
					if (openingPos == -1)
						alert(
							"ERROR! No matching bracket found for closing bracket at char: " +
								instructionPointer
						);
					else instructionPointer = openingPos;
				}
			}
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
	}, 500 / simulationSpeed);
};

const runCode = () => {
	resetVariables();
	code = codeEditor.value;

	console.log("Running", code);
	simulate(code, instructionPointer, dataPointer);
};

const updateSimulationSpeed = () => {
	simulationSpeed = simulationSpeedInput.value;
};

runButton.addEventListener("click", runCode);
simulationSpeedInput.addEventListener("change", updateSimulationSpeed);

initialize(32);
