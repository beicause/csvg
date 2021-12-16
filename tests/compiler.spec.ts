import { parse } from '../packages/csvg/src/parse'
import { Compiler } from '../packages/csvg/src/compile'

it('test parse', () => {
  const res = parse('@q() @a( a ,a@b(), @c() )', '@', '')
  expect(JSON.stringify(res)).toMatchInlineSnapshot(
    `"[{\\"name\\":\\"@q\\",\\"content\\":\\"@q()\\",\\"range\\":[0,4],\\"params\\":{\\"content\\":\\"\\"}},{\\"name\\":\\"@a\\",\\"content\\":\\"@a( a ,a@b(), @c() )\\",\\"range\\":[5,25],\\"params\\":{\\"content\\":\\" a ,a@b(), @c() \\",\\"functions\\":[{\\"name\\":\\"@c\\",\\"content\\":\\"@c()\\",\\"range\\":[19,23],\\"params\\":{\\"content\\":\\"\\"}},{\\"name\\":\\"@b\\",\\"content\\":\\"@b()\\",\\"range\\":[13,17],\\"params\\":{\\"content\\":\\"\\"}}]}}]"`
  )

  const res1 = parse('@re!( @ra(10) , @ra!(5))', '@', '!')
  expect(JSON.stringify(res1)).toMatchInlineSnapshot(
    `"[{\\"name\\":\\"@re!\\",\\"content\\":\\"@re!( @ra(10) , @ra!(5))\\",\\"range\\":[0,24],\\"params\\":{\\"content\\":\\" @ra(10) , @ra!(5)\\",\\"functions\\":[{\\"name\\":\\"@ra!\\",\\"content\\":\\"@ra!(5)\\",\\"range\\":[16,23],\\"params\\":{\\"content\\":\\"5\\"}},{\\"name\\":\\"@ra\\",\\"content\\":\\"@ra(10)\\",\\"range\\":[6,13],\\"params\\":{\\"content\\":\\"10\\"}}]}}]"`
  )
})

it('test compile simple', () => {
  const input = '@re!( @set(@ra(100)) @get() @re!(1,5), @ra!(10))'
  const c = new Compiler(input)
  const res = c.compile(input)
  expect(res).toMatchInlineSnapshot(
    `" 70.942215 70.942215 11111 54.677212 54.677212 11111"`
  )
})

it('test compiler', () => {
  const input = `
    @re!(<circle class="bubble" id="bubble-@i()"  cx="@set(@ra(100))" cy="@set(@ra(100))" transform-origin="@calc(@get(@i(1,1)) + 10) @calc(@get(@i(1,1)) + 10)" r="1.5"></circle>
	,10)
	<style>
		/*reset index @i(0,0,-1) */
		@re!(#bubble-@i() {
				animation-duration: @ra(1, 2)s;
				animation-delay: @ra(1, 2)s;
			}
			, 10)`
  const output = new Compiler().compile(input)
  expect(output).toMatchInlineSnapshot(`
    "
        <circle class=\\"bubble\\" id=\\"bubble-0\\"  cx=\\"21.132116\\" cy=\\"70.942215\\" transform-origin=\\"31.132116 80.942215\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-1\\"  cx=\\"54.677212\\" cy=\\"73.880316\\" transform-origin=\\"64.677212 83.880316\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-2\\"  cx=\\"81.946588\\" cy=\\"6.345165\\" transform-origin=\\"91.946588 16.345165\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-3\\"  cx=\\"37.508145\\" cy=\\"84.386145\\" transform-origin=\\"47.508145 94.386145\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-4\\"  cx=\\"96.670525\\" cy=\\"53.682270\\" transform-origin=\\"106.670525 63.68227\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-5\\"  cx=\\"19.927555\\" cy=\\"67.319959\\" transform-origin=\\"29.927555 77.319959\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-6\\"  cx=\\"64.069359\\" cy=\\"30.237483\\" transform-origin=\\"74.069359 40.237483\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-7\\"  cx=\\"59.960134\\" cy=\\"10.336077\\" transform-origin=\\"69.960134 20.336077\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-8\\"  cx=\\"56.982596\\" cy=\\"16.257716\\" transform-origin=\\"66.982596 26.257716\\" r=\\"1.5\\"></circle>
    	<circle class=\\"bubble\\" id=\\"bubble-9\\"  cx=\\"34.149091\\" cy=\\"41.829561\\" transform-origin=\\"44.149091 51.829561\\" r=\\"1.5\\"></circle>
    	
    	<style>
    		/*reset index -1 */
    		#bubble-0 {
    				animation-duration: 1.778794s;
    				animation-delay: 1.771751s;
    			}
    			#bubble-1 {
    				animation-duration: 1.264450s;
    				animation-delay: 1.864918s;
    			}
    			#bubble-2 {
    				animation-duration: 1.810807s;
    				animation-delay: 1.524957s;
    			}
    			#bubble-3 {
    				animation-duration: 1.837616s;
    				animation-delay: 1.875326s;
    			}
    			#bubble-4 {
    				animation-duration: 1.616482s;
    				animation-delay: 1.113555s;
    			}
    			#bubble-5 {
    				animation-duration: 1.381974s;
    				animation-delay: 1.955693s;
    			}
    			#bubble-6 {
    				animation-duration: 1.109401s;
    				animation-delay: 1.747419s;
    			}
    			#bubble-7 {
    				animation-duration: 1.959255s;
    				animation-delay: 1.241821s;
    			}
    			#bubble-8 {
    				animation-duration: 1.388327s;
    				animation-delay: 1.043836s;
    			}
    			#bubble-9 {
    				animation-duration: 1.927482s;
    				animation-delay: 1.721365s;
    			}
    			"
  `)
})
