function pushItemsToArrayIfNotNull<T>(
  array: T[],
  ...issues: (T | null)[]
): void {
  for (const issue of issues) {
    if (issue) {
      array.push(issue);
    }
  }
}

export const utils = {
  pushItemsToArrayIfNotNull
};
