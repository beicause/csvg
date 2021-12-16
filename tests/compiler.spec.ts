import { parse } from '../packages/csvg/src/parse'
import { Compiler } from '../packages/csvg/src/compile'

it('test parse', () => {
  const res = parse('@q() @a( a ,a@b(), @c() )', '@', '')
  expect(JSON.stringify(res)).toMatchInlineSnapshot(
    `"[{\\"name\\":\\"@q\\",\\"content\\":\\"@q()\\",\\"range\\":[0,4],\\"params\\":{\\"content\\":\\"\\"}},{\\"name\\":\\"@a\\",\\"content\\":\\"@a( a ,a@b(), @c() )\\",\\"range\\":[5,25],\\"params\\":{\\"content\\":\\" a ,a@b(), @c() \\",\\"functions\\":[{\\"name\\":\\"@b\\",\\"content\\":\\"@b()\\",\\"range\\":[13,17],\\"params\\":{\\"content\\":\\"\\"}},{\\"name\\":\\"@c\\",\\"content\\":\\"@c()\\",\\"range\\":[19,23],\\"params\\":{\\"content\\":\\"\\"}}]}}]"`
  )

  const res1 = parse('@re!( @ra(10) , @ra!(5))', '@', '!')
  expect(JSON.stringify(res1)).toMatchInlineSnapshot(
    `"[{\\"name\\":\\"@re!\\",\\"content\\":\\"@re!( @ra(10) , @ra!(5))\\",\\"range\\":[0,24],\\"params\\":{\\"content\\":\\" @ra(10) , @ra!(5)\\",\\"functions\\":[{\\"name\\":\\"@ra\\",\\"content\\":\\"@ra(10)\\",\\"range\\":[6,13],\\"params\\":{\\"content\\":\\"10\\"}},{\\"name\\":\\"@ra!\\",\\"content\\":\\"@ra!(5)\\",\\"range\\":[16,23],\\"params\\":{\\"content\\":\\"5\\"}}]}}]"`
  )
})

it('test compiler', () => {
  const input = `
		@re!(
			-@re!(#class-@i() {animation-delay: @calc(@set(@ra(1, 2))>1.5?@get():3)s;}, 2),@ra!(30))`
  const out = new Compiler().compile(input)
  expect(out).toMatchInlineSnapshot(`
    "
    		
    			-#class-0 {animation-delay: 1.709422s;}#class-1 {animation-delay: 1.546772s;}
    			-#class-2 {animation-delay: 1.738803s;}#class-3 {animation-delay: 1.819466s;}
    			-#class-4 {animation-delay: 3s;}#class-5 {animation-delay: 3s;}
    			-#class-6 {animation-delay: 1.843861s;}#class-7 {animation-delay: 1.966705s;}
    			-#class-8 {animation-delay: 1.536823s;}#class-9 {animation-delay: 3s;}
    			-#class-10 {animation-delay: 1.6732s;}#class-11 {animation-delay: 1.640694s;}"
  `)
})
