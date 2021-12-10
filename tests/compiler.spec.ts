import { getRandomCompiler, getRepeatCompiler, Params, resolveParams, getIndexCompiler } from "../packages/svg-macro/src/compiler"

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
it("test compileIteration", () => {
    const res = getRepeatCompiler()(`
    <svg>
        @repeat(
            <path/>
            @repeat(
            <path/>
            ,2)
        ,3)

        @repeat(
            <path/>
        )
    </svg>`)
    expect(res).toMatchInlineSnapshot(`
    "
        <svg>
            
                <path/>
                
                <path/>
                
                <path/>
                
            
                <path/>
                
                <path/>
                
                <path/>
                
            
                <path/>
                
                <path/>
                
                <path/>
                
            

            
                <path/>
            
        </svg>"
  `)
})

it("test compileRanom", () => {
    const res = getRandomCompiler()(`
        <svg> <rect width="@random(100,200)" height="@random(@random(),@random(10,20))" /> </svg>
    `)
    expect(res).toMatchInlineSnapshot(`
    "
            <svg> <rect width=\\"121.132116\\" height=\\"12.333162\\" /> </svg>
        "
  `)
})

it('test compileIndex', () => {
    const res = getIndexCompiler({ name: 'i' })(getRepeatCompiler({ name: 're' })(`
    <svg>@i() @i(2) @i() @i(0,0) @i(3) @re(@i() ,5)</svg>
    `))
    expect(res).toMatchInlineSnapshot(`
"
    <svg>0 2 3 0 3 4 5 6 7 8 </svg>
    "
`)
})
