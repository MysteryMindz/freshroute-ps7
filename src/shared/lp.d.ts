declare module 'javascript-lp-solver' {
  interface LPModel { optimize: string; opType: 'max' | 'min'; constraints: Record<string, { max?: number; min?: number; equal?: number }>; variables: Record<string, Record<string, number>>; options?: { timeout?: number } }
  interface LPResult { feasible: boolean; bounded?: boolean; result: number; [key: string]: number | boolean | undefined }
  const solver: { Solve(model: LPModel): LPResult };
  export default solver;
}
