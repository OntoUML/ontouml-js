function pushItemsToArrayIfNotNull<T>(array: T[], ...issues: T[]): void {
  for (const issue of issues) {
    if (issue) {
      array.push(issue);
    }
  }
}

export const utils = {
  pushItemsToArrayIfNotNull
};
