import { createMemo } from "solid-js"
import { createComponent, Dynamic, For } from "solid-js/web"

/** @ts-ignore */
export function mx<U extends { as: string }, K extends U["as"]>(union: U): <F extends { [K1 in K]: U extends { as: K1 } ? (u: U) => unknown : never }> (f: F) => <V extends U>(value: V) => ReturnType<F[V["as"]]> { return (funcs) => (val) => funcs[val.as](val) }

/** @ts-ignore */
/** @deprecated */
export function Mx<U extends { as: string } | null, K extends Exclude<U, null | undefined | false>["as"]>(props: { over: U, match: (c: (p: { [K1 in K]: U extends { as: K1 } ? (u: U) => unknown : never }) => any) => any }): any {
  const as = () => {
    if (!props.over) throw new Error("Assert Mx: Assert over is not checked at this point")
    if (!props.over.as) {
      console.log("Mx", props.over)
      throw new Error(`Mx: props.over is not a matchable because over.as is "${props.over.as}"`)
    }
    return props.over.as
  }
  const compSelected = () => {
    if (!props.over) {
      return () => <></>
    }
    const funcs = props.match((x) => x)
    const a = as()
    if (!(a in funcs)) {
      console.log("Mx", funcs)
      throw new Error(`Mx: props.over is an unhandle matchable case ${a} not expected by props.match`)
    }
    return funcs[a]
  }
  return <>{createComponent(compSelected(), props.over)}</>
  // DO NOT USE, SPREADING PROPS CAN BREAK MUTABLES
  // return <Dynamic component={compSelected()} {...props.over} />
}
type Falsy = false | null | undefined
/** @deprecated */
export function AsMatch<U extends {as: string} | Falsy, K extends Exclude<U, Falsy>['as'], F extends {[K1 in K]: U extends {as: K1} ? (u: U) => unknown : never}>(props: {over: U, match: F}): any {
  const as = () => {
    if (!props.over) throw new Error("Assert Mx: Assert over is not checked at this point")
    if (!props.over.as) {
      console.log("Mx", props.over)
      throw new Error(`Mx: props.over is not a matchable because over.as is "${props.over.as}"`)
    }
    return props.over.as
  }
  const compSelected = () => {
    if (!props.over) {
      return () => <></>
    }
    const funcs = props.match // ((x) => x)
    const a = as()
    if (!(a in funcs)) {
      console.log("Mx", funcs)
      throw new Error(`Mx: props.over is an unhandle matchable case ${a} not expected by props.match`)
    }
    // @ts-ignore
    return funcs[a]
  }
  return <>{createComponent(compSelected(), props.over)}</>
  // DO NOT USE, SPREADING PROPS CAN BREAK MUTABLES
  // return <Dynamic component={compSelected()} {...props.over} />
}

export function MxAll<U extends { as: string } | null, K extends Exclude<U, null | undefined | false>["as"]>(props: { over: U, match: (c: (p: { [K1 in K]: U extends { as: K1 } ? (u: U) => unknown : never }) => any) => any }): any {
  const as = () => {
    if (!props.over) throw new Error("Assert Mx: Assert over is not checked at this point")
    if (!props.over.as) {
      console.log("Mx", props.over)
      throw new Error(`Mx: props.over is not a matchable because over.as is "${props.over.as}"`)
    }
    return props.over.as
  }
  const allComps = () => {
    if (!props.over) {
      return () => <></>
    }
    const funcs = props.match((x) => x)
    const a = as()
    if (!(a in funcs)) {
      console.log("Mx", funcs)
      throw new Error(`Mx: props.over is an unhandle matchable case ${a} not expected by props.match`)
    }
    return funcs
  }
  return <For each={Object.entries(allComps())}>
    {([as, compFunc]) => {
      const p = createMemo(() => props.over?.as == as ? props.over : {as})
      return <>{createComponent(compFunc as any, p())}</>
    }
    }
  </For>
  // return <>{createComponent(compSelected(), props.over)}</>
}