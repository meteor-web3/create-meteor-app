import fs from "fs";
import path from "path";

export function writeToOutput(val: object) {
  const outputDir = path.resolve(process.cwd(), "output");
  const filePath = path.resolve(outputDir, "app.json");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(filePath, JSON.stringify(val, null, 2));
}

enum YamlType {
  array = "array",
  string = "string",
  multilines = "multilines",
  boolean = "boolean",
  number = "number",
  null = "null",
  object = "object",
  emptyObject = "emptyObject",
}

export class JSToYamlResult {
  value?: string;
  error?: Error;
}

export class JSToYaml {
  private static spacing = "  ";
  private static spacingStart = "";

  public static stringify(data: any): JSToYamlResult {
    const result = { value: "" } as JSToYamlResult;
    const type = this.getType(data);

    if (type === YamlType.array) {
      this.convertFromArray(data, result, 0);
    } else if (type === YamlType.object || type === YamlType.emptyObject) {
      this.convertFromObject(data, result, 0);
    } else {
      result.error = new Error("Must be an object or an array");
    }

    return result;
  }

  private static convertFromArray(
    data: any[],
    result: JSToYamlResult,
    deep: number,
  ) {
    data.forEach(value => {
      result.value += `${this.spacingStart}${this.spacing.repeat(deep)}- `;
      const type: YamlType = this.getType(value);
      switch (type) {
        case YamlType.boolean || YamlType.number:
          result.value += `${value}\n`;
          break;
        case YamlType.null:
          result.value += `null\n`;
          break;
        case YamlType.string:
          result.value += `${this.normalizeString(value)}\n`;
          break;
        case YamlType.multilines:
          result.value += `|-\n`;
          value.split("\n").forEach((line: string) => {
            result.value += `${this.spacingStart}${this.spacing.repeat(
              deep + 1,
            )}${line}\n`;
          });
          break;
        case YamlType.array:
          if (value.length) {
            result.value += "\n";
            this.convertFromArray(value, result, deep + 1);
          } else {
            result.value += "[]\n";
          }
          break;
        case YamlType.emptyObject:
          result.value += `{}\n`;
          break;
        default:
          result.value += "\n";
          this.convertFromObject(value, result, deep + 1);
          break;
      }
    });
  }

  private static convertFromObject(
    data: any,
    result: JSToYamlResult,
    deep: number,
  ) {
    for (const propertyName of Object.keys(data)) {
      const value = data[propertyName];
      const type: YamlType = this.getType(value);
      result.value += `${this.spacingStart}${this.spacing.repeat(
        deep,
      )}${this.normalizeKey(propertyName)}: `;
      switch (type) {
        case YamlType.boolean:
        case YamlType.number:
          result.value += `${value}\n`;
          break;
        case YamlType.null:
          result.value += `null\n`;
          break;
        case YamlType.string:
          result.value += `${this.normalizeString(value)}\n`;
          break;
        case YamlType.multilines:
          result.value += `|-\n`;
          value.split("\n").forEach((line: string) => {
            result.value += `${this.spacingStart}${this.spacing.repeat(
              deep + 1,
            )}${line}\n`;
          });
          break;
        case YamlType.array:
          if (value.length) {
            result.value += "\n";
            this.convertFromArray(value, result, deep);
          } else {
            result.value += "[]\n";
          }
          break;
        case YamlType.emptyObject:
          result.value += `{}\n`;
          break;
        default:
          result.value += "\n";
          this.convertFromObject(value, result, deep + 1);
          break;
      }
    }
  }

  private static normalizeKey(str: string): string {
    if (str.indexOf(" ") > -1) {
      return this.normalizeString(str);
    }
    return str;
  }

  private static normalizeString(str: string): string {
    return `"${str.split('"').join('\\"')}"`;
  }

  private static getType(data: any): YamlType {
    const type: string = typeof data;
    if (data === null) {
      return YamlType.null;
    }
    if (data instanceof Array) {
      return YamlType.array;
    }
    switch (type) {
      case "string":
        if (data.indexOf("\n") > -1) {
          return YamlType.multilines;
        }
        return YamlType.string;
      case "boolean":
        return YamlType.boolean;
      case "number":
        return YamlType.number;
      case "undefined":
        return YamlType.null;
      default:
        if (Object.keys(data).length === 0) {
          return YamlType.emptyObject;
        }
        return YamlType.object;
    }
  }
}
