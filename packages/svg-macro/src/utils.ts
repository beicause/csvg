
export type Seed={value:number}

export function seedRandom(seed: Seed,min?: number, max?: number) {
    max = max || 1
    min = min || 0
    seed.value = (seed.value * 9301 + 49297) % 233280
    const rnd = seed.value / 233280
    return min + rnd * (max - min)
}