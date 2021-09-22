import { BigNumber, ethers } from 'ethers';

interface FormatAmountProps {
  value: BigNumber;
  decimals: number;
  roundToDecimals: number;
}

const formatAmount = ({
  value,
  decimals,
  roundToDecimals,
}: FormatAmountProps) => {
  if (roundToDecimals <= decimals) {
    const divisor = BigNumber.from(10).pow(decimals - roundToDecimals);
    const remainder = value.mod(divisor);
    const shortenedAmount = value.sub(remainder);
    return ethers.utils.formatUnits(shortenedAmount, decimals);
  } else {
    return ethers.utils.formatUnits(value, decimals);
  }
};

export default formatAmount;
