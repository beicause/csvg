import { getRandomCompiler, getRepeatCompiler, Params, resolveParams, getIndexCompiler, getSetCompiler, getGetCompiler, getCalcCompiler } from "../packages/csvg/src/compiler"

it("test resolveParams", () => {
    const options = { name: "fun", sign: "#" }
    expect(resolveParams("#fun()", options)).toEqual({
        params: [],
        content: "",
        open: 4,
        close: 5,
    } as Params)
    expect(resolveParams("#fun(3)", options)).toEqual({
        params: ["3"],
        content: "3",
        open: 4,
        close: 6,
    } as Params)
    expect(resolveParams("#fun(#fn(),1)", options)).toEqual({
        params: ["#fn()", "1"],
        content: "#fn(),1",
        open: 4,
        close: 12,
    } as Params)
})
it("test repeat compiler", () => {
    const res = getRepeatCompiler()(`
    <svg>
        @repeat(<path/>@repeat(<path/>,2),3)
        @repeat(<path/>)
    </svg>`)
    expect(res).toMatchInlineSnapshot(`
"
    <svg>
        <path/><path/><path/><path/><path/><path/><path/><path/><path/>
        
    </svg>"
`)
})

it("test random compiler", () => {
    const res = getRandomCompiler({name:'ra'})(getRandomCompiler()(`
        <svg> <rect width="@random(100,200)" height="@ra(@random(),@ra(10,20))" /> </svg>
    `))
    expect(res).toMatchInlineSnapshot(`
"
        <svg> <rect width=\\"121.132116\\" height=\\"11.612900\\" /> </svg>
    "
`)
})

it('test index compiler', () => {
    const res = getIndexCompiler({ name: 'i' })(getRepeatCompiler({ name: 're' })(`
    <svg>@i(2), @i(), @i(0,0), @i(0,1), @re(@i(), @i(1,1), ,5)</svg>
    `))
    expect(res).toMatchInlineSnapshot(`
"
    <svg>1, 2, 2, -1, 3, 0, 4, 1, 5, 2, 6, 3, 7, 4, </svg>
    "
`)
})

it('test get&set compiler',()=>{
    const compiler=getGetCompiler()
    const res = compiler(getSetCompiler()(`
    <svg>@set(123) @set(456) @set(789) @get() @get(0)</svg>
    `))
    expect(compiler.options.storage).toEqual(['123','456','789'])    
    expect(res).toMatchInlineSnapshot(`
"
    <svg>123 456 789 789 123</svg>
    "
`)
})

it('test calc compiler',()=>{
    const res=getCalcCompiler()(`@calc((10+2)/10*1.2+0.56+6%8)`)
    expect(res).toBe('8')
})