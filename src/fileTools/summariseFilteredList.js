function tallyAsArray(filteredList) {
  const tallyObj = filteredList.rejected.reduce((rejectedTally, item) => {
    if (rejectedTally[item.reason] === undefined) {
      rejectedTally[item.reason] = 0;
    }
    rejectedTally[item.reason] += 1;
    return rejectedTally;
  }, {});
  return Object.keys(tallyObj).map(key => ({
    [key]: tallyObj[key],
  }));
}

function summariseFilteredList(filteredList) {
  return {
    Accepted: filteredList.accepted.length,
    Rejected: filteredList.rejected.length,
    Tally: tallyAsArray(filteredList),
  };
}

module.exports = summariseFilteredList;
