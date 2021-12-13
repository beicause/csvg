import {
    processCalc,
    processGet,
    processIndex,
    processRandom,
    processRepeat,
    processSet
} from '../packages/csvg/src/processor'
import { parse } from '../packages/csvg/src/parser'

it('test repeat processor', () => {
    const res = processRepeat([`<svg><path/></svg>`, '2'])
    expect(res).toMatchInlineSnapshot(`"<svg><path/></svg><svg><path/></svg>"`)
})

it('test random processor', () => {
    const res = processRandom(['10', '20']) + '/' + processRandom(['5', '10'])
    expect(res).toMatchInlineSnapshot(`"12.113212/8.547111"`)
})

it('test index processor', () => {
    const res =
        processIndex(['3']) +
        '/' +
        processIndex(['102', '1']) +
        '/' +
        processIndex(['-1']) +
        '/' +
        processIndex(['0', '0', '0']) +
        '/' +
        processIndex(['0', '1', '100'])
    expect(res).toMatchInlineSnapshot(`"2/101/1/0/100"`)
})

it('test get&set processor', () => {
    const set = processSet(['a10a']) + '/' + processSet(['b5b'])
    const res = processGet(['']) + '/' + processGet(['0'])
    expect(processGet.options.storage).toEqual(['a10a', 'b5b'])
    expect(res).toEqual(`"b5b/a10a"`)
    expect(set).toEqual('\\"a10a/b5b\\"')
})

it('test calc processor', () => {
    const res = processCalc([`((10+2)/10*1.2+0.56+6%8)`])
    expect(res).toBe('8')
})

it('test parser', () => {
    const res = parse(
        `
    @a(1,a,@b(),d) @c(0)
    `,
        '@'
    )
    expect(JSON.stringify(res)).toMatchInlineSnapshot(
        `"[{\\"name\\":\\"@a\\",\\"range\\":[5,18],\\"content\\":\\"@a(1,a,@b(),d)\\",\\"params\\":[\\"1\\",\\"a\\",{\\"name\\":\\"@b\\",\\"range\\":[12,15],\\"content\\":\\"@b()\\",\\"params\\":[]},\\"d\\"]},{\\"name\\":\\"@c\\",\\"range\\":[20,24],\\"content\\":\\"@c(0)\\",\\"params\\":[\\"0\\"]}]"`
    )
})
