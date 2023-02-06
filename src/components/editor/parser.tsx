const AVAILABLE_TYPES = ["int", "float", "vec2"];
const vec2_regex = /\((\s?.*?)\d.*,(\s?.*?)\d.*\)/g;

export class Parser {
    file: string;

    constructor(file: string) {
        this.file = file;
    }

    parse() {
        const split = this.file.split("\n");
        const toParse = [];

        for (var line of split) {
            if (line.match("@editor")) {
                toParse.push(line);
            }
        }

        for (var line of toParse) {
            const data = line.split("@editor")[1];

            try {
                const line = this.line_parser(data);
                console.log(line);
            } catch (e) {
                console.log("LINE ERROR", e);
            }
        }
    }

    line_parser(line: string) {
        const params_raw = line.split(";");
        let params: { type: string; default: string; label: string } = {
            type: "",
            default: "",
            label: "",
        };

        for (var p of params_raw) {
            const tmp = p.trim().split("=");

            if (tmp.length == 1) continue;

            const a = tmp[0].trim();
            const b = tmp[1].trim();

            const param = this.params_validator(a, b);

            params = { ...params, ...param };
        }

        const is_ok = this.type_checker(params.type, params.default);

        if (!is_ok) {
            throw new Error("Line params validation has failed");
        }

        return params;
    }

    isInt(n: any) {
        return Number(n) === n && n % 1 === 0;
    }

    isFloat(n: any) {
        return Number(n) === n && n % 1 !== 0;
    }

    type_checker(type: string, value: string) {
        switch (type) {
            case "int":
                return this.isInt(value);
            case "float":
                return this.isFloat(value);
            case "vec2":
                return vec2_regex.test(value);
        }
    }

    params_validator(argument: string, value: string) {
        switch (argument) {
            case "label":
                return {
                    label: value,
                };
            case "type":
                if (AVAILABLE_TYPES.includes(value)) {
                    return {
                        type: value,
                    };
                }
            case "default":
                return {
                    default: value,
                };
            default:
                throw new Error(`Argument not recognized ${argument}`);
        }
    }
}
