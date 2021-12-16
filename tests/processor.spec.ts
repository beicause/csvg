import {
    processCalc,
    processGet,
    processIndex,
    processRandom,
    processRepeat,
    processSet
  } from '../packages/csvg/src/process'
  
  it('test repeat processor', () => {
    const res = processRepeat(' <svg> <path/> </svg> , 3')
    expect(res).toMatchInlineSnapshot(
      `" <svg> <path/> </svg>  <svg> <path/> </svg>  <svg> <path/> </svg> "`
    )
  })
  
  it('test random processor', () => {
    const res = processRandom('10,20') + processRandom('5,10') + processRandom('')
    expect(res).toMatchInlineSnapshot(`"12.1132128.5471110.546772"`)
  })
  
  it('test index processor', () => {
    const res =
      processIndex('3') +
      processIndex('102,1') +
      processIndex('-1') +
      processIndex('0, 0, 0') +
      processIndex('0,1, 50')
    expect(res).toMatchInlineSnapshot(`"21011050"`)
  })
  
  it('test get&set processor', () => {
    const set = processSet('a10a') + processSet('b5b')
    const get = processGet('') + processGet('0')
    expect(processGet.options?.storage).toEqual(['a10a', 'b5b'])
    expect(set).toMatchInlineSnapshot(`"a10ab5b"`)
    expect(get).toMatchInlineSnapshot(`"b5ba10a"`)
  })
  
  it('test calc processor', () => {
    const res = processCalc(`((10+2)/10*1.2+0.56+6%8)`)
    expect(res).toBe('8')    
  })
  