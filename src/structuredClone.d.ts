// workaround for structuredClone() until upgrade to TypeScript ~4.7
// cp. <https://stackoverflow.com/a/72306923/1140589>

interface WindowOrWorkerGlobalScope {
  structuredClone(value: any, options?: StructuredSerializeOptions): any;
}
declare function structuredClone(
  value: any,
  options?: StructuredSerializeOptions
): any;
