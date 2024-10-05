import * as DiscordJS from 'discord.js';
import { Regex } from './@LibsExports';

export = class {
    // утилиты


    public static hasValue(object: {}, value: any, toOneCase: boolean = false) {
        return Object.values(object).some((v: any) => (toOneCase ?
            v.toLowerCase() == value.toLowerCase() :
            v == value)
        );
    };

    public static hasKey(object: {}, key: any, toOneCase: boolean = false) {
        return Object.keys(object).some((v: any) => (toOneCase ?
            v.toLowerCase() == key.toLowerCase() :
            v == key)
        );
    };

    public static shortestArray(...arrays: any[]) {
        let arr = arguments[arguments.length - 1];
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i].length < arr.length) {
                arr = arguments[i];
            };
        };
        return arr;
    };

    public static longestArray(...arrays: any[]) {
        let arr = arguments[0];
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i].length > arr.length) {
                arr = arguments[i];
            };
        };
        return arr;
    };

    public static compareText(text1: string, text2: string) {
        const array1 = text1.split(' ');
        const array2 = text2.split(' ');
        const longArray = this.longestArray(array1, array2);
        const shortArray = this.shortestArray(array1, array2);
        let compareCharCount = 0;
        longArray.forEach(word1 => {
            shortArray.forEach(word2 => {
                const longWord = this.longestArray(word1, word2);
                const shortWord = this.shortestArray(word1, word2);
                for (let i = 0; i < longWord.length; i++) {
                    const char1 = longWord[i];
                    const char2 = shortWord[i];
                    if (char1 == char2) compareCharCount++;
                };
            });
        });
        return compareCharCount / longArray.join('').length;
    };

    public static ecroSpecChar(text: string) {
        return text.replace(new RegExp(Regex.specChar, 'g'), '\\$1');
    };


    // бот


    public static totalMemberCount(Client: DiscordJS.Client) {
        let members = 0;
        Client.guilds.cache.forEach(guild => members += guild.memberCount);
        return members;
    };

    public static totalUserCount(Client: DiscordJS.Client) {
        return Client.users.cache.size;
    };

    public static totalBotCount(Client: DiscordJS.Client) {
        return this.totalMemberCount(Client) - Client.users.cache.size;
    };

    public static lang(locale: string, ruText: string, engText: string) {
        return locale == 'ru' ? ruText : engText;
    };


    // время


    public static workTime(startDate: Date) {
        return new Date(Date.now() - startDate.getTime());
    };

    public static getTime(milliseconds: number) {
        const now = new Date();
        const monthDays = 32 - new Date(now.getFullYear(), now.getMonth(), 32).getDate();
        const secondsMs = 1000;
        const minutesMs = secondsMs * 60;
        const hoursMs = minutesMs * 60;
        const daysMs = hoursMs * 24;
        const monthsMs = daysMs * monthDays
        const yearsMs = monthsMs * 12;
        return {
            milliseconds: milliseconds % 1000,
            seconds: Math.floor(milliseconds / secondsMs) % 60,
            minutes: Math.floor(milliseconds / minutesMs) % 60,
            hours: Math.floor(milliseconds / hoursMs) % 24,
            days: Math.floor(milliseconds / daysMs) % monthDays,
            months: Math.floor(milliseconds / monthsMs) % 12,
            years: Math.floor(milliseconds / yearsMs) % 365,
        };
    };

    public static fixTime(num: number) {
        return (num.toString().length == 1 ? '0' : '') + num.toString();
    };


    // рандомные значения


    public static randValue(maxValue: number, minValue: number = 0) {
        if (minValue > maxValue) minValue = maxValue;
        return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
    };

    public static randArrValue(array: []) {
        return array[this.randValue(array.length)];
    };


    // генерация цветов


    // rgb
    public static genRgbCode(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        const value = Math.floor(this.randValue(maxBrightnessPercent, minBrightnessPercent) / 100 * 255);
        return (value > 255 ? 255 : (value < 0 ? 0 : value));
    };
    public static genRgbColor(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        const result = [];
        for (let i = 0; i < 3; i++) { result.push(this.genRgbCode(maxBrightnessPercent, minBrightnessPercent)); };
        return result;
    };

    // hex
    public static genHexCode(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        return this.fixHexCode(this.genRgbCode(maxBrightnessPercent, minBrightnessPercent).toString(16));
    };
    public static genHexColor(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        let result = '#';
        for (let i = 0; i < 3; i++) { result += this.genHexCode(maxBrightnessPercent, minBrightnessPercent); };
        return result;
    };

    // dec
    public static genDecColor(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        const white = 16777215;
        const max = Math.floor(maxBrightnessPercent / 100 * white);
        const min = Math.floor(minBrightnessPercent / 100 * white);
        return this.randValue(max, min);
    };
    public static genColor(maxBrightnessPercent: number = 100, minBrightnessPercent: number = 0) {
        const value = this.genRgbColor(maxBrightnessPercent, minBrightnessPercent);
        const r = value[0];
        const g = value[1];
        const b = value[2];
        return {
            hex: this.rgbColorToHexColor(r, g, b),
            rgb: value,
            dec: this.rgbColorToDecColor(r, g, b),
        };
    };


    // преобразование цветов


    // другое
    public static fixHexCode(hex: string) {
        if (hex.length == 1) hex += hex;
        return hex;
    };
    public static fixHexColor(hex: string) {
        if (hex.startsWith('#')) hex = hex.slice(1);
        const r = hex[0] + hex[0];
        const g = hex[1] + hex[1];
        const b = hex[2] + hex[2];
        return '#' + r + g + b;
    };

    // rgb
    public static rgbCodeToHexCode(num: number) {
        return this.fixHexCode(num.toString(16));
    };
    public static rgbColorToHexColor(r: number, g: number, b: number) {
        return '#' + this.rgbCodeToHexCode(r) + this.rgbCodeToHexCode(g) + this.rgbCodeToHexCode(b);
    };
    public static rgbCodeToDecCode(num: number) {
        return Math.floor(5592405 * (num / 255));
    };
    public static rgbColorToDecColor(r: number, g: number, b: number) {
        return this.rgbCodeToDecCode(r) + this.rgbCodeToDecCode(g) + this.rgbCodeToDecCode(b);
    };

    // hex
    public static hexCodeToRgbCode(hex: string) {
        return parseInt(this.fixHexCode(hex), 16);
    };
    public static hexColorToRgbColor(hex: string) {
        const value = hex.match(new RegExp(Regex.hex));
        return [
            this.hexCodeToRgbCode(value[1]),
            this.hexCodeToRgbCode(value[2]),
            this.hexCodeToRgbCode(value[3]),
        ];
    };
    public static hexCodeToDecCode(hex: string) {
        return this.rgbCodeToDecCode(parseInt(this.fixHexCode(hex), 16));
    };
    public static hexColorToDecColor(hex: string) {
        const value = hex.match(new RegExp(Regex.hex));
        const r = value[1];
        const g = value[2];
        const b = value[3];
        return this.hexCodeToDecCode(r) + this.hexCodeToDecCode(g) + this.hexCodeToDecCode(b);
    };

    // dec
    public static decCodeToRgbCode(dec: number) {
        return Math.floor(dec * 255 / 5592405);
    };
    public static decColorToRgbColor(dec: number) {
        const value = Math.floor(dec / 3);
        return [
            this.decCodeToRgbCode(value),
            this.decCodeToRgbCode(value),
            this.decCodeToRgbCode(value),
        ];
    };
    public static decCodeToHexCode(dec: number) {
        return this.rgbCodeToHexCode(this.decCodeToRgbCode(dec));
    };
    public static decColorToHexColor(dec: number) {
        const value = Math.floor(dec / 3);
        return '#' + this.decCodeToHexCode(value) + this.decCodeToHexCode(value) + this.decCodeToHexCode(value);
    };
};