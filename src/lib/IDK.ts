export class EditableObject {
  constructor() {}
}

export class PackMeta extends EditableObject {
  name: string;
  description: string;
  format: PackFormat;

  constructor(name: string, description: string, format: PackFormat) {
    super();
    this.name = name;
    this.description = description;
    this.format = format;
  }

  public exportAsObject() {
    let metaObject = {
      pack: { description: this.description, format: this.format },
    };
    return metaObject;
  }
}

export class MCFunction extends EditableObject {
  name: string;
  commands: MCCommand[];

  constructor(name: string);
  constructor(name: string, commands: MCCommand[]);
  constructor(name: string, commands = []) {
    super();
    this.name = name;
    this.commands = commands;
  }

  public returnAsFile() {
    let mcfunctionstring = "";
    for (let command of this.commands) {
      mcfunctionstring += `${command.root} `;
      for (let param of command.parameters) {
        mcfunctionstring += `${param} `;
      }
      mcfunctionstring += "\n";
    }
  }
}

export class MCCommand {
  root: CommandRoot;
  parameters: any[];

  constructor(root, parameters) {
    this.root = root;
    this.parameters = parameters;
  }
}

type CommandRoot = "";

type PackFormat =
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;
