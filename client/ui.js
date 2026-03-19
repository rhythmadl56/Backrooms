const blessed = require("blessed");

function createUI() {
  const screen = blessed.screen({
    smartCSR: true,
    title: "Backrooms Chat"
  });

  // Chat box (top)
  const chatBox = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: "85%",
    border: "line",
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    mouse: true,
    scrollbar: {
      ch: " ",
      inverse: true
    },
    style: {
      border: { fg: "cyan" }
    }
  });

  // Input box (bottom)
  const input = blessed.textbox({
    bottom: 0,
    left: 0,
    width: "100%",
    height: 3,
    border: "line",
    inputOnFocus: true,
    style: {
      border: { fg: "green" }
    }
  });

  screen.append(chatBox);
  screen.append(input);

  input.focus();
  input.key(["C-c"], () => process.exit(0));
  // Exit keys
  screen.key(["escape", "q", "C-c"], () => process.exit(0));

  return { screen, chatBox, input };
}

module.exports = createUI;