function getTally(filteredList) {
  return filteredList.rejected.reduce((rejectedTally, item) => {
    if (rejectedTally[item.reason] === undefined) {
      rejectedTally[item.reason] = 0;
    }
    rejectedTally[item.reason] += 1;
    return rejectedTally;
  }, {});
}

function summariseFilteredList(filteredList) {
  return {
    Accepted: filteredList.accepted.length,
    Rejected: filteredList.rejected.length,
    Tally: getTally(filteredList),
  };
}

module.exports = summariseFilteredList;
