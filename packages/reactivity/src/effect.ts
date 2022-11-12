import { COLLECTION_KEY } from './consts'

const targetMap = new WeakMap<any, Map<any, Set<() => void>>>()

interface ActiveEffect {
  (): void
  deps?: any[]
}

let activeEffect: ActiveEffect
const effectStack: (() => void)[] = []

export function track<T extends object>(
  target: T,
  type: 'get' | 'ref-get' | 'collection-size',
  key: keyof T,
): void {
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)
  if (!deps) {
    // Set has built-in feature to remove repeat value
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect as () => void)
  activeEffect.deps?.push(deps)
}

export function trigger<T extends object>(
  target: T,
  type:
    | 'set'
    | 'ref-set'
    | 'delete'
    | 'collection-add'
    | 'collection-delete'
    | 'collection-has',
  key: keyof T,
): void {
  let keyName: any = key
  if (type === 'collection-add' || type === 'collection-delete') {
    keyName = COLLECTION_KEY
  }
  const deps = targetMap.get(target)?.get(keyName)
  if (deps) {
    new Set(deps).forEach(effect => effect())
  }
}

function clearUp(effectFn: ActiveEffect) {
  if (!effectFn.deps?.length) {
    return
  }
  for (let i = 0; i < effectFn.deps.length; i++) {
    effectFn.deps[i].delete(effectFn)
  }
  effectFn.deps = []
}

export function effect(fn: () => void) {
  const effectFn = () => {
    let fnResult
    try {
      activeEffect = effectFn
      effectStack.push(activeEffect)
      clearUp(effectFn)
      fnResult = fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1] || null
    }
    return fnResult
  }
  effectFn.deps = [] as any[]
  effectFn()
  return effectFn
}
