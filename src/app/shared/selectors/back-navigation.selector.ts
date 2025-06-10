// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectBackNavigationPossible = (state: any) => {
  return state?.backNavigation || []
}
