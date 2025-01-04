export function formatNumber(num: number) {
  let formatted;

  if (Math.abs(num) >= 1_000_000_000) {
    // Format for millions (M)
    formatted = (num / 1_000_000_000).toFixed(2) + "B";
  } else if (Math.abs(num) >= 1_000_000) {
    // Format for millions (M)
    formatted = (num / 1_000_000).toFixed(2) + "M";
  } else if (Math.abs(num) >= 1_000) {
    // Format for thousands (K)
    formatted = (num / 1_000).toFixed(2) + "K";
  } else {
    // Format for regular numbers
    formatted = num.toFixed(2);
  }

  return(formatted);
}

export function printWithNineDecimals(num: number) {
  return(num.toFixed(9));
}