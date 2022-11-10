const targetMap = new WeakMap<any, Map<any, Set<() => void>>>()

let activeEffect: (() => void) | null
export function track<T extends object>(
  target: T,
  type: 'get' | 'ref-get',
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
}

export function trigger<T extends object>(
  target: T,
  type: 'set' | 'ref-set',
  key: keyof T,
): void {
  targetMap
    .get(target)
    ?.get(key)
    ?.forEach(effect => effect())
}

export function effect(fn: () => void) {
  activeEffect = fn
  fn()
  activeEffect = null
}
