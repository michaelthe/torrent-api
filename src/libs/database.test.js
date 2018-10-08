"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
describe('database', () => {
    test('set string', async () => {
        await database_1.default.set('somekey', 'somevalue');
        let value = await database_1.default.get('somekey');
        expect(value).toEqual('somevalue');
    });
    test('set object', async () => {
        let someUser = { name: 'someUser' };
        await database_1.default.set('somekey', someUser);
        let value = await database_1.default.get('somekey');
        console.log(value);
        expect(value).toEqual(someUser);
    });
    test('set many', async () => {
        await Promise.all([
            await database_1.default.set('somekey', 'somevalue'),
            await database_1.default.set('someotherkey', 'someothervalue')
        ]);
        let value = await database_1.default.get('somekey');
        let othervalue = await database_1.default.get('someotherkey');
        expect(value).toEqual('somevalue');
        expect(othervalue).toEqual('someothervalue');
    });
});
//# sourceMappingURL=database.test.js.map