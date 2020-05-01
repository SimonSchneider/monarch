const helpers = {
  formatNumber: (x) => {
    const num = Number(x);
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) + "k"
      : Math.sign(num) * Math.abs(num).toFixed(2);
  },
};

export default helpers;
